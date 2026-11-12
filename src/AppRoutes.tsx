import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./AppShell";
import { RLPage } from "@/components/rl/RLPage";
import { BanditsPage } from "@/components/bandits/BanditsPage";
import { DPPage } from "@/components/dp/DPPage";
import { SavedAgentsPage } from "@/components/agents/SavedAgentsPage";
import { TheoryPage } from "@/components/theory/TheoryPage";
import { REDIRECTS } from "./routeRedirects";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/gridworld" replace />} />
        <Route path="gridworld" element={<RLPage />} />
        <Route path="bandits" element={<BanditsPage />} />
        <Route path="dp" element={<DPPage />} />
        <Route path="agents" element={<SavedAgentsPage />} />
        <Route path="theory" element={<TheoryPage />} />
        {REDIRECTS.map(({ path, to }) => (
          <Route
            key={path}
            path={path}
            element={<Navigate to={to} replace />}
          />
        ))}
      </Route>
    </Routes>
  );
}
