import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApi } from "../api";
import type { Account } from "../api";

export function AccountDetail(): JSX.Element {
  const { address } = useParams<{ address: string }>();
  const [acct, setAcct] = useState<Account | null>(null);
  useEffect(() => {
    if (address) getApi().getAccount(address).then(setAcct);
  }, [address]);
  if (!acct) return <p className="font-mono text-sm text-crust-400">Loading account {address}…</p>;
  return (
    <section>
      <p className="heading-eyebrow">Account</p>
      <h2 className="mt-1 break-all font-mono text-lg text-crust-100">{acct.address}</h2>
      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]">
        <dt className="text-crust-400">Free</dt>
        <dd className="font-mono tabular-nums text-crust-100">{acct.free}</dd>
        <dt className="text-crust-400">Reserved</dt>
        <dd className="font-mono tabular-nums text-crust-100">{acct.reserved}</dd>
      </dl>
    </section>
  );
}
