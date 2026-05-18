import { useEffect, useState } from "react";
import { getApi } from "../api";
import type { SlashEvent } from "../api";

export function Slashes(): JSX.Element {
  const [slashes, setSlashes] = useState<SlashEvent[]>([]);
  useEffect(() => {
    getApi().listSlashes().then(setSlashes);
  }, []);
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="heading-eyebrow">Faults</p>
          <h2 className="mt-1 text-xl font-semibold text-crust-100">Slashes</h2>
        </div>
        <span className="font-mono text-xs tabular-nums text-crust-400">
          {slashes.length} event{slashes.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="overflow-x-auto rounded-md border border-crust-700">
        <table className="prose-table">
          <thead>
            <tr className="bg-crust-900/60 text-left text-xs uppercase tracking-[0.14em] text-crust-300">
              <th>Block</th>
              <th>Operator</th>
              <th>Fault</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {slashes.map((s) => (
              <tr
                key={`${s.block}-${s.operator}`}
                className="transition-colors hover:bg-crust-900/40"
              >
                <td className="font-mono tabular-nums text-crust-100">{s.block}</td>
                <td className="font-mono text-xs tabular-nums text-crust-200">{s.operator}</td>
                <td>
                  <span className="rounded border border-red-500/40 bg-red-500/10 px-2 py-0.5 font-mono text-xs text-red-400">
                    {s.faultCode}
                  </span>
                </td>
                <td className="font-mono tabular-nums text-crust-100">{s.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
