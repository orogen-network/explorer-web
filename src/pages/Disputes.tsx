import { useEffect, useState } from "react";
import { getApi } from "../api";
import type { DisputeEvent } from "../api";

function statusClasses(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("open")) return "text-magma-400";
  if (s.includes("upheld") || s.includes("slashed") || s.includes("fail"))
    return "text-red-400";
  if (s.includes("dismissed") || s.includes("clear") || s.includes("ok"))
    return "text-crystal-500";
  return "text-crust-200";
}

export function Disputes(): JSX.Element {
  const [disputes, setDisputes] = useState<DisputeEvent[]>([]);
  useEffect(() => {
    getApi().listDisputes().then(setDisputes);
  }, []);
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="heading-eyebrow">Verification</p>
          <h2 className="mt-1 text-xl font-semibold text-crust-100">Disputes</h2>
        </div>
        <span className="font-mono text-xs tabular-nums text-crust-400">
          {disputes.length} open
        </span>
      </div>
      <div className="overflow-x-auto rounded-md border border-crust-700">
        <table className="prose-table">
          <thead>
            <tr className="bg-crust-900/60 text-left text-xs uppercase tracking-[0.14em] text-crust-300">
              <th>Block</th>
              <th>Operator</th>
              <th>Challenger</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((d) => (
              <tr
                key={`${d.block}-${d.operator}`}
                className="transition-colors hover:bg-crust-900/40"
              >
                <td className="font-mono tabular-nums text-crust-100">{d.block}</td>
                <td className="font-mono text-xs tabular-nums text-crust-200">{d.operator}</td>
                <td className="font-mono text-xs tabular-nums text-crust-200">{d.challenger}</td>
                <td
                  className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] ${statusClasses(
                    d.status,
                  )}`}
                >
                  {d.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
