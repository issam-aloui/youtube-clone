import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SpinnerLoader } from "./components/loaders";

const HomePage = lazy(() => import("./pages/homePage"));
const SubscriptionsPage = lazy(() => import("./pages/SubscriptionsPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const PlaylistsPage = lazy(() => import("./pages/PlaylistsPage"));
const PlaylistDetailPage = lazy(() => import("./pages/PlaylistDetailPage"));
const WatchPageWrapper = lazy(() => import("./components/WatchPageWrapper"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <SpinnerLoader
            fullHeight={true}
            text="Loading page..."
            textColor="white"
            color="red.500"
            thickness="4px"
          />
        }>
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
      </Suspense>
    </Router>
  );
}
