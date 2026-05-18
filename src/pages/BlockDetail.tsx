import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "../api";
import type { Block } from "../api";

export function BlockDetail(): JSX.Element {
  const { hash } = useParams<{ hash: string }>();
  const [block, setBlock] = useState<Block | null>(null);
  useEffect(() => {
    if (hash) getApi().getBlock(hash).then(setBlock);
  }, [hash]);
  if (!block) return <p className="font-mono text-sm text-crust-400">Loading block {hash}…</p>;
  return (
    <section>
      <p className="heading-eyebrow">Block</p>
      <h2 className="mt-1 font-mono text-xl font-semibold tabular-nums text-crust-100">
        {`Block #${block.number}`}
      </h2>
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
        <dt className="text-crust-400">Hash</dt>
        <dd className="break-all font-mono text-xs tabular-nums text-crust-100">{block.hash}</dd>
        <dt className="text-crust-400">Parent</dt>
        <dd className="break-all font-mono text-xs tabular-nums text-crust-200">
          {block.parentHash}
        </dd>
        <dt className="text-crust-400">Timestamp</dt>
        <dd className="font-mono text-xs tabular-nums text-crust-200">
          {new Date(block.timestamp).toISOString()}
        </dd>
      </dl>
      <h3 className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-crust-300">
        Extrinsics
      </h3>
      <ul className="mt-2 space-y-1 font-mono text-sm">
        {block.extrinsics.map((x) => (
          <li key={x.hash}>
            <Link
              to={`/extrinsic/${x.hash}`}
              className="text-magma-400 no-underline hover:text-magma-300"
            >
              {x.call}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
