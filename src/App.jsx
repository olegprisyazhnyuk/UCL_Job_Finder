import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";
import { QAProvider } from "@/lib/QAContext";
import Landing from "./pages/Landing";
import JobFinder from "./pages/JobFinder";
import ModuleInformation from "./pages/ModuleInformation";
import IndustryInformation from "./pages/IndustryInformation";
import Results from "./pages/Results";

const GitHubPagesRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const route = params.get("route");

    if (route) {
      navigate(route, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router basename="/UCL_Job_Finder">
        <QAProvider>
          <GitHubPagesRedirect />
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/job-finder" element={<JobFinder />} />
            <Route
              path="/module-information"
              element={<ModuleInformation />}
            />
            <Route
              path="/industry-information"
              element={<IndustryInformation />}
            />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </QAProvider>

        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;