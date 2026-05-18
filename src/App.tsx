import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { Blocks } from "./pages/Blocks";
import { BlockDetail } from "./pages/BlockDetail";
import { ExtrinsicDetail } from "./pages/ExtrinsicDetail";
import { AccountDetail } from "./pages/AccountDetail";
import { OperatorDetail } from "./pages/OperatorDetail";
import { ModelDetail } from "./pages/ModelDetail";
import { Slashes } from "./pages/Slashes";
import { Disputes } from "./pages/Disputes";

const NAV_ITEMS = [
  { to: "/blocks", label: "Blocks" },
  { to: "/slashes", label: "Slashes" },
  { to: "/disputes", label: "Disputes" },
];

export function App(): JSX.Element {
  return (
    <HashRouter>
      <AppShell subtitle="Chain explorer">
        <nav className="mb-6 flex flex-wrap items-center gap-1 border-b border-crust-800 pb-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded px-3 py-1.5 text-sm no-underline transition-colors ${
                  isActive
                    ? "bg-crust-900 text-magma-400"
                    : "text-crust-300 hover:bg-crust-800/60 hover:text-crust-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Blocks />} />
            <Route path="/blocks" element={<Blocks />} />
            <Route path="/block/:hash" element={<BlockDetail />} />
            <Route path="/extrinsic/:hash" element={<ExtrinsicDetail />} />
            <Route path="/account/:address" element={<AccountDetail />} />
            <Route path="/operator/:id" element={<OperatorDetail />} />
            <Route path="/model/:id" element={<ModelDetail />} />
            <Route path="/slashes" element={<Slashes />} />
            <Route path="/disputes" element={<Disputes />} />
          </Routes>
        </main>
      </AppShell>
    </HashRouter>
  );
}
