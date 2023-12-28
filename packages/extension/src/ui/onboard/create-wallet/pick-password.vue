<template>
  <div class="pick-password">
    <h3 class="pick-password__title">Tide</h3>
    <p class="pick-password__description">
      This will be used to unlock your wallet.
    </p>

    <div class="pick-password__form">
      <base-button title="Tide" @click="tideClick" orange />
    </div>
  </div>
</template>
<script setup lang="ts">
/* eslint-disable */
import BaseButton from "@action/components/base-button/index.vue";
import { useRouter } from "vue-router";
import { routes } from "./routes";
import { useOnboardStore } from "./store";
import { Heimdall, TidePromise } from "heimdall-tide"

const config = {
  vendorPublic: 'prF0iFt2krLxFPvUgN80kjWvP5V6yaqqS+bRSzCDUGI=',
  vendorLocationSignature: "DW4GbP9ZIwnmSYtoq48AGv/U73YcNEjU+Tg2tAkCczcF9T8r1EAVop2YyaMAt4VhP/YI+WQXoVc+nIVoBHQcAA==",
  homeORKUrl: "https://prod-ork1.azurewebsites.net",
  enclaveRequest: {
    getUserInfoFirst: false, // 1 step process - we will not supply a customModel halfway through the process
    refreshToken: true, // I want a TideJWT returned
    customModel: undefined, // I do not want to provide a customModel
  }
};

const router = useRouter();
const store = useOnboardStore();
const heimdall = new Heimdall(config);
const tidePromise = new TidePromise(); 
const tideButtonAction = async (promise: TidePromise) => heimdall.GetCompleted(promise);

const tideClick = async () => {
  tideButtonAction(tidePromise)
  tidePromise.promise.then((res: any) => {
    if (res.responseType == "completed") {
      store.setPassword(res.TideJWT);
      router.push({
        name: routes.recoveryPhrase.name,
      });
    }
  })
};
</script>

<style lang="less">
@import "~@action/styles/theme.less";

.pick-password {
  width: 100%;

  &__title {
    font-style: normal;
    font-weight: 700;
    font-size: 34px;
    line-height: 40px;
    letter-spacing: 0.25px;
    color: @primaryLabel;
    margin: 0 0 8px 0;
  }

  &__description {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: @secondaryLabel;
    margin: 0;
  }

  &__form {
    padding: 16px 0;
  }

  &__label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: @secondaryLabel;
    margin: 0;
  }
}
</style>
