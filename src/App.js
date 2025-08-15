import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./component/login";
import RepoSelector from "./component/repoSelector";
import AuthCallback from "./component/authCallback";
import Dashboard from "./component/dashboard";
import RepoFiles from "./component/reposFiles";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
         <Route path="/repos" element={<RepoSelector />} /> 
           <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/repos/files" element={<RepoFiles />} />
        {/* Add more routes later */}
      </Routes>
    </Router>
  );
}

export default App;
