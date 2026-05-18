import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApi } from "../api";
import type { Model } from "../api";

export function ModelDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [m, setM] = useState<Model | null>(null);
  useEffect(() => {
    if (id) getApi().getModel(id).then(setM);
  }, [id]);
  if (!m) return <p className="font-mono text-sm text-crust-400">Loading model {id}…</p>;
  return (
    <section>
      <p className="heading-eyebrow">Model</p>
      <h2 className="mt-1 font-mono text-lg text-crust-100">{m.id}</h2>
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
        <dt className="text-crust-400">Family</dt>
        <dd className="text-crust-100">{m.family}</dd>
        <dt className="text-crust-400">Weight tier</dt>
        <dd className="font-mono text-crust-100">{m.weightTier}</dd>
        <dt className="text-crust-400">Content hash</dt>
        <dd className="break-all font-mono text-xs tabular-nums text-crust-200">{m.contentHash}</dd>
      </dl>
    </section>
  );
}
