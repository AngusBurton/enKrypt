import { NetworkNames } from "@enkryptcom/types";
import { BaseTokenOptions } from "./base-token";

interface EthereumRawInfo {
  blockHash: string;
  blockNumber: string;
  contractAddress: string | null;
  effectiveGasPrice: string;
  from: string;
  to: string | null;
  gas: string;
  gasUsed: string;
  status: string;
  transactionHash: string;
  data: string;
  nonce: string;
  value: string;
  timestamp: number | undefined;
}

interface SubstrateRawInfo {
  from: string;
  to: string;
  success: boolean;
  hash: string;
  block_num: number;
  block_timestamp: number;
  module: string;
  amount: string;
  fee: string;
  nonce: number;
  asset_symbol: string;
  asset_type: string;
}

enum ActivityStatus {
  pending = "pending",
  success = "success",
  failed = "failed",
}

enum ActivityType {
  transaction = "transaction",
}

interface Activity {
  network: NetworkNames;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  isIncoming: boolean;
  transactionHash: string;
  token: BaseTokenOptions;
  status: ActivityStatus;
  type: ActivityType;
  rawInfo: EthereumRawInfo | SubstrateRawInfo;
}

export {
  EthereumRawInfo,
  SubstrateRawInfo,
  Activity,
  ActivityStatus,
  ActivityType,
};