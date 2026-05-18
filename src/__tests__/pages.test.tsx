import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { Blocks } from "../pages/Blocks";
import { BlockDetail } from "../pages/BlockDetail";
import { OperatorDetail } from "../pages/OperatorDetail";
import { Slashes } from "../pages/Slashes";
import { Disputes } from "../pages/Disputes";

function withRouter(path: string, route: string, element: JSX.Element): JSX.Element {
  return (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={route} element={element} />
      </Routes>
    </MemoryRouter>
  );
}

describe("explorer pages", () => {
  it("Blocks renders the recent-blocks table", async () => {
    render(withRouter("/blocks", "/blocks", <Blocks />));
    await waitFor(() => expect(screen.getByText(/Recent blocks/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/1234567/)).toBeInTheDocument());
  });

  it("BlockDetail renders a block by hash", async () => {
    render(withRouter("/block/0xaa11", "/block/:hash", <BlockDetail />));
    await waitFor(() => expect(screen.getByText(/Block #1234567/)).toBeInTheDocument());
  });

  it("OperatorDetail renders operator status", async () => {
    render(withRouter("/operator/op-001", "/operator/:id", <OperatorDetail />));
    await waitFor(() => expect(screen.getByText(/op-001/)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/online/)).toBeInTheDocument());
  });

  it("Slashes lists fault events", async () => {
    render(withRouter("/slashes", "/slashes", <Slashes />));
    await waitFor(() => expect(screen.getByText(/F1-receipt-mismatch/)).toBeInTheDocument());
  });

  it("Disputes lists open disputes", async () => {
    render(withRouter("/disputes", "/disputes", <Disputes />));
    await waitFor(() => expect(screen.getByText(/open/i)).toBeInTheDocument());
  });
});
