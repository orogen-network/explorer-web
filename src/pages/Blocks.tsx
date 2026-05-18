import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApi } from "../api";
import type { Block } from "../api";

export function Blocks(): JSX.Element {
  const [blocks, setBlocks] = useState<Block[]>([]);
  useEffect(() => {
    getApi().listBlocks().then(setBlocks);
  }, []);
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="heading-eyebrow">Chain head</p>
          <h2 className="mt-1 text-xl font-semibold text-crust-100">Recent blocks</h2>
        </div>
        <span className="font-mono text-xs tabular-nums text-crust-400">
          {blocks.length} block{blocks.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="overflow-x-auto rounded-md border border-crust-700">
        <table className="prose-table">
          <thead>
            <tr className="bg-crust-900/60 text-left text-xs uppercase tracking-[0.14em] text-crust-300">
              <th>Number</th>
              <th>Hash</th>
              <th>Extrinsics</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr key={b.hash} className="transition-colors hover:bg-crust-900/40">
                <td className="font-mono tabular-nums text-crust-100">{b.number}</td>
                <td className="max-w-[28ch] truncate font-mono text-xs text-crust-200">
                  <Link
                    to={`/block/${b.hash}`}
                    className="text-magma-400 no-underline hover:text-magma-300"
                  >
                    {b.hash}
                  </Link>
                </td>
                <td className="font-mono tabular-nums text-crust-300">{b.extrinsics.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
