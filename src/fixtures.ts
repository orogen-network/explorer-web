import type {
  Account,
  Block,
  DisputeEvent,
  Model,
  Operator,
  SlashEvent,
} from "./api";

export const fixture: {
  blocks: Block[];
  accounts: Account[];
  operators: Operator[];
  models: Model[];
  slashes: SlashEvent[];
  disputes: DisputeEvent[];
} = {
  blocks: [
    {
      number: 1_234_567,
      hash: "0xaa11",
      parentHash: "0xaa10",
      timestamp: 1_747_440_000_000,
      extrinsics: [
        {
          hash: "0xext0001",
          blockNumber: 1_234_567,
          signer: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
          call: "operatorStake.register",
          success: true,
        },
      ],
    },
    {
      number: 1_234_566,
      hash: "0xaa10",
      parentHash: "0xaa0f",
      timestamp: 1_747_439_988_000,
      extrinsics: [],
    },
  ],
  accounts: [
    {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      free: "10000000000000",
      reserved: "1000000000000",
    },
  ],
  operators: [
    {
      id: "op-001",
      ss58: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      gpuClasses: ["H100-SXM-80GB"],
      stake: "5000000000000",
      status: "online",
    },
  ],
  models: [
    {
      id: "llama-3.1-70b",
      family: "llama",
      contentHash: "0xfeed1234",
      weightTier: "fp8",
    },
  ],
  slashes: [
    {
      block: 1_234_500,
      operator: "5OffenderxyzAddress00000000000000000000000000000",
      faultCode: "F1-receipt-mismatch",
      amount: "100000000000",
    },
  ],
  disputes: [
    {
      block: 1_234_400,
      operator: "5OffenderxyzAddress00000000000000000000000000000",
      challenger: "5ChallengerxxxxAddress00000000000000000000000000",
      status: "open",
    },
  ],
};
