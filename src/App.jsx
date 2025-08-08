import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SpinnerLoader } from "./components/loaders";
import Layout from "./layout/Layout";

const HomePage = lazy(() => import("./pages/homePage"));
const SubscriptionsPage = lazy(() => import("./pages/SubscriptionsPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const PlaylistsPage = lazy(() => import("./pages/PlaylistsPage"));
const PlaylistDetailPage = lazy(() => import("./pages/PlaylistDetailPage"));
const WatchPageWrapper = lazy(() => import("./components/WatchPageWrapper"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <Router basename="/youtube-clone">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlist" element={<PlaylistDetailPage />} />
          <Route path="/watch/:id" element={<WatchPageWrapper />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
