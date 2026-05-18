import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApi } from "../api";
import type { Operator } from "../api";

export function OperatorDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [op, setOp] = useState<Operator | null>(null);
  useEffect(() => {
    if (id) getApi().getOperator(id).then(setOp);
  }, [id]);
  if (!op) return <p className="font-mono text-sm text-crust-400">Loading operator {id}…</p>;
  const online = op.status === "online";
  return (
    <section>
      <p className="heading-eyebrow">Operator</p>
      <h2 className="mt-1 font-mono text-lg text-crust-100">{op.id}</h2>
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
        <dt className="text-crust-400">SS58</dt>
        <dd className="break-all font-mono text-xs tabular-nums text-crust-200">{op.ss58}</dd>
        <dt className="text-crust-400">Stake</dt>
        <dd className="font-mono tabular-nums text-crust-100">{op.stake}</dd>
        <dt className="text-crust-400">Status</dt>
        <dd
          className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] ${
            online ? "text-crystal-500" : "text-red-400"
          }`}
        >
          {op.status}
        </dd>
        <dt className="text-crust-400">GPU classes</dt>
        <dd className="flex flex-wrap gap-1.5">
          {op.gpuClasses.map((g) => (
            <span
              key={g}
              className="rounded border border-crust-700 bg-crust-900 px-2 py-0.5 font-mono text-xs text-crust-200"
            >
              {g}
            </span>
          ))}
        </dd>
      </dl>
    </section>
  );
}
