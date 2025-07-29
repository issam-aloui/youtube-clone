import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WatchPage from "./pages/WatchPage";
import HomePage from "./pages/homePage";
import WatchPageWrapper from "./components/WatchPageWrapper";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch/:id" element={<WatchPageWrapper />} />
      </Routes>
    </Router>
  );
}
