/**
 * Live chain implementation of `ChainApi` backed by `@polkadot/api` over
 * a WebSocket connection.
 *
 * Methods backed by RPC against the forge testnet:
 *   - listBlocks, getBlock, getExtrinsic (walks recent blocks for the
 *     latter, since polkadot/api has no extrinsic-hash index)
 *   - getAccount
 *
 * Methods that need indexed pallet events:
 *   - getOperator, getModel, listSlashes, listDisputes
 *
 * On a freshly-running forge testnet none of those pallet events fire (the
 * pallet bodies are still skeleton), so these methods return empty until
 * chain-indexer is live. They'll switch to a GraphQL backend then.
 */
import { ApiPromise, WsProvider } from "@polkadot/api";

import type {
  Account,
  Block,
  ChainApi,
  DisputeEvent,
  Extrinsic,
  Model,
  Operator,
  SlashEvent,
} from "./api";

export class PolkadotChainApi implements ChainApi {
  private apiPromise: Promise<ApiPromise> | null = null;

  constructor(private endpoint: string) {}

  private ready(): Promise<ApiPromise> {
    if (!this.apiPromise) {
      const provider = new WsProvider(this.endpoint);
      this.apiPromise = ApiPromise.create({ provider, throwOnConnect: false });
    }
    return this.apiPromise;
  }

  async listBlocks(limit = 20): Promise<Block[]> {
    const api = await this.ready();
    const head = await api.rpc.chain.getHeader();
    const headN = head.number.toNumber();
    const start = Math.max(0, headN - limit + 1);
    const hashes = await Promise.all(
      Array.from({ length: headN - start + 1 }, (_, i) => start + i).map((n) =>
        api.rpc.chain.getBlockHash(n),
      ),
    );
    const blocks = await Promise.all(
      hashes.map(async (h) => this.fetchBlock(api, h.toHex())),
    );
    // Newest first.
    return blocks.filter((b): b is Block => b !== null).reverse();
  }

  async getBlock(hash: string): Promise<Block | null> {
    const api = await this.ready();
    return this.fetchBlock(api, hash);
  }

  private async fetchBlock(api: ApiPromise, hash: string): Promise<Block | null> {
    try {
      const signed = await api.rpc.chain.getBlock(hash);
      const events = await api.query.system.events.at(hash);
      const success = new Set<number>();
      const failed = new Set<number>();
      // events is a Vec<EventRecord>; each has .phase which may be ApplyExtrinsic(u32)
      (events as unknown as Array<{ phase: { isApplyExtrinsic: boolean; asApplyExtrinsic: { toNumber: () => number } }; event: { section: string; method: string } }>).forEach((rec) => {
        if (rec.phase.isApplyExtrinsic && rec.event.section === "system") {
          const idx = rec.phase.asApplyExtrinsic.toNumber();
          if (rec.event.method === "ExtrinsicSuccess") success.add(idx);
          else if (rec.event.method === "ExtrinsicFailed") failed.add(idx);
        }
      });

      const blockNumber = signed.block.header.number.toNumber();
      const extrinsics: Extrinsic[] = signed.block.extrinsics.map((x, i) => ({
        hash: x.hash.toHex(),
        blockNumber,
        signer: x.isSigned ? x.signer.toString() : "",
        call: `${x.method.section}.${x.method.method}`,
        success: !failed.has(i),
      }));

      // Best-effort timestamp via timestamp.set extrinsic (always inherent #0 on Substrate).
      let timestamp = 0;
      const ts = signed.block.extrinsics.find(
        (x) => x.method.section === "timestamp" && x.method.method === "set",
      );
      if (ts && ts.method.args[0]) {
        timestamp = Number(
          (ts.method.args[0] as unknown as { toBigInt(): bigint }).toBigInt(),
        );
      }

      return {
        number: blockNumber,
        hash: signed.block.header.hash.toHex(),
        parentHash: signed.block.header.parentHash.toHex(),
        timestamp,
        extrinsics,
      };
    } catch {
      return null;
    }
  }

  async getExtrinsic(hash: string): Promise<Extrinsic | null> {
    // No index by extrinsic hash; walk back up to 50 blocks.
    const api = await this.ready();
    const head = await api.rpc.chain.getHeader();
    const headN = head.number.toNumber();
    for (let n = headN; n >= Math.max(0, headN - 50); n--) {
      const blockHash = await api.rpc.chain.getBlockHash(n);
      const block = await this.fetchBlock(api, blockHash.toHex());
      if (!block) continue;
      const found = block.extrinsics.find((x) => x.hash === hash);
      if (found) return found;
    }
    return null;
  }

  async getAccount(address: string): Promise<Account | null> {
    const api = await this.ready();
    try {
      const info = (await api.query.system.account(address)) as unknown as {
        data: { free: { toString(): string }; reserved: { toString(): string } };
      };
      return {
        address,
        free: info.data.free.toString(),
        reserved: info.data.reserved.toString(),
      };
    } catch {
      return null;
    }
  }

  // Pallet-derived; require chain-indexer.
  async getOperator(_id: string): Promise<Operator | null> {
    return null;
  }
  async getModel(_id: string): Promise<Model | null> {
    return null;
  }
  async listSlashes(): Promise<SlashEvent[]> {
    return [];
  }
  async listDisputes(): Promise<DisputeEvent[]> {
    return [];
  }
}
