import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WatchPage from "./pages/WatchPage";
import HomePage from "./pages/homePage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import HistoryPage from "./pages/HistoryPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import WatchPageWrapper from "./components/WatchPageWrapper";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/playlist" element={<PlaylistDetailPage />} />
        <Route path="/watch/:id" element={<WatchPageWrapper />} />
        {/* Catch-all route for unbuilt pages */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
