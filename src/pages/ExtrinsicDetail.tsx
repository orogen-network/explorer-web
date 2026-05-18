import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApi } from "../api";
import type { Extrinsic } from "../api";

export function ExtrinsicDetail(): JSX.Element {
  const { hash } = useParams<{ hash: string }>();
  const [x, setX] = useState<Extrinsic | null>(null);
  useEffect(() => {
    if (hash) getApi().getExtrinsic(hash).then(setX);
  }, [hash]);
  if (!x) return <p className="font-mono text-sm text-crust-400">Loading extrinsic {hash}…</p>;
  return (
    <section>
      <p className="heading-eyebrow">Extrinsic</p>
      <h2 className="mt-1 break-all font-mono text-base text-crust-100">{x.hash}</h2>
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
        <dt className="text-crust-400">Call</dt>
        <dd className="font-mono text-crust-100">{x.call}</dd>
        <dt className="text-crust-400">Signer</dt>
        <dd className="break-all font-mono text-crust-200">{x.signer}</dd>
        <dt className="text-crust-400">Success</dt>
        <dd
          className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] ${
            x.success ? "text-crystal-500" : "text-red-400"
          }`}
        >
          {x.success ? "yes" : "no"}
        </dd>
      </dl>
    </section>
  );
}
