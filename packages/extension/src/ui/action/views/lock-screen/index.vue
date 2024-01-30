<template>
  <div class="lock-screen__container">
    <div
      v-show="!isForgot && !isLocked && !isUnlocking"
      class="lock-screen__wrap"
    >
      <logo-big class="lock-screen__logo" />
      <h4>Unlock with Tide</h4>
      <base-button title="Open Tide" @click="unlockAction" orange />
    </div>

    <div v-show="isUnlocking" class="lock-screen__unlocking">
      <swap-looking-animation />
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable */
import { ref } from "vue";
import LogoBig from "@action/icons/common/logo-big.vue";
import BaseButton from "@action/components/base-button/index.vue";
import { sendToBackgroundFromAction } from "@/libs/messenger/extension";
import { InternalMethods } from "@/types/messenger";
import SwapLookingAnimation from "@action/icons/swap/swap-looking-animation.vue";
import BitcoinNetworks from "@/providers/bitcoin/networks";
import KeyRing from "@/libs/keyring/keyring";
import { NetworkNames, WalletType } from "@enkryptcom/types";
import { getAccountsByNetworkName } from "@/libs/utils/accounts";
import { Heimdall, TidePromise } from "heimdall-tide";

const emit = defineEmits<{
  (e: "update:init"): void;
}>();

const isError = ref(false);
const isForgot = ref(false);
const isLocked = ref(false);
const isUnlocking = ref(false);

const config = {
  vendorPublic: 'prF0iFt2krLxFPvUgN80kjWvP5V6yaqqS+bRSzCDUGI=',
  vendorLocationSignature: "DW4GbP9ZIwnmSYtoq48AGv/U73YcNEjU+Tg2tAkCczcF9T8r1EAVop2YyaMAt4VhP/YI+WQXoVc+nIVoBHQcAA==",
  homeORKUrl: "https://prod-ork1.azurewebsites.net",
  enclaveRequest: {
    getUserInfoFirst: false,
    refreshToken: false, // I want a TideJWT returned
    customModel: undefined, // I do not want to provide a customModel
  }
};

const heimdall = new Heimdall(config);
const tidePromise = new TidePromise(); 
const tideButtonAction = async (promise: TidePromise) => heimdall.GetUserInfo(promise);

const unlockAction = async () => {
  isUnlocking.value = true;
  tideButtonAction(tidePromise);
  const values = await tidePromise.promise;
  const unlockStatus = await sendToBackgroundFromAction({
    message: JSON.stringify({
      method: InternalMethods.unlock,
      params: [values.UID],
    }),
  });
  if (unlockStatus.error) {
    isError.value = true;
    isUnlocking.value = false;
  } else {
    isError.value = false;

    // Add bitcoin if not added.
    const bitcoinAccounts = await getAccountsByNetworkName(
      NetworkNames.Bitcoin
    );

    if (bitcoinAccounts.length == 0) {
      const privateKeyring = new KeyRing();
      await privateKeyring.unlock(values.TideJWT);

      await privateKeyring.saveNewAccount({
        basePath: BitcoinNetworks.bitcoin.basePath,
        name: "Bitcoin Account 1",
        signerType: BitcoinNetworks.bitcoin.signer[0],
        walletType: WalletType.mnemonic,
      });

      privateKeyring.lock();
    }

    emit("update:init");
    setTimeout(() => (isUnlocking.value = false), 750);
  }
};
</script>

<style lang="less" scoped>
@import "~@action/styles/theme.less";
.lock-screen {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  &__container {
    width: 800px;
    height: 600px;
    //   width: 454px;
    //   height: 397px;
    overflow-x: hidden;
    overflow-y: hidden;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background: radial-gradient(
        100% 50% at 100% 50%,
        rgba(250, 250, 250, 0.92) 0%,
        rgba(250, 250, 250, 0.98) 100%
      )
      @primary;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  &__wrap {
    width: 320px;
    height: auto;
    box-sizing: border-box;
    position: relative;
    h4 {
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 32px;
      color: @primaryLabel;
      margin: 0 0 8px 0;
    }
  }
  &__unlocking {
    width: 300px;
    height: 300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;

    svg {
      width: 132px;
      position: relative;
      z-index: 2;
    }
  }
  &__logo {
    margin-bottom: 24px;
  }
  &__forgot {
    position: absolute;
    width: 320px;
    left: 50%;
    margin-left: -160px;
    bottom: 20px;
  }
}
</style>
