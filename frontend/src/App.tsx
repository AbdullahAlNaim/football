import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { CalendarPage } from "./pages/CalendarPage";
import { ClubPage } from "./pages/ClubPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TeamsPage } from "./pages/TeamsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="clubs" element={<ClubPage />} />
          <Route path="clubs/:teamId" element={<ClubPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="*" element={<ComingSoonPage title="Page not found" message="That page doesn't exist." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
