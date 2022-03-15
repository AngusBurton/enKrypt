import { getCustomError } from "@/libs/error";
import { MiddlewareFunction } from "@enkryptcom/types";
import EthereumProvider from "..";
import { hashPersonalMessage } from "ethereumjs-util";
import { stripHexPrefix, bufferToHex } from "@enkryptcom/utils";
import { WindowPromise } from "@/libs/window-promise";
const method: MiddlewareFunction = function (
  this: EthereumProvider,
  payload,
  res,
  next
): void {
  if (payload.method !== "personal_sign") return next();
  else {
    if (!payload.params || payload.params.length < 2) {
      return res(getCustomError("personal_sign: invalid params"));
    }
    const msg = bufferToHex(
      hashPersonalMessage(Buffer.from(stripHexPrefix(payload.params[0])))
    );
    this.KeyRing.getAccount(payload.params[1].toLowerCase()).then((account) => {
      const windowPromise = new WindowPromise();
      windowPromise
        .getResponse(
          this.getUIPath(this.UIRoutes.ethSign.path),
          JSON.stringify({ ...payload, params: [msg, account] }),
          true
        )
        .then(({ error, result }) => {
          if (error) return res(error);
          res(null, JSON.parse(result as string));
        });
    });
  }
};
export default method;