import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Voting from "./pages/Voting";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <GoogleOAuthProvider clientId="139401816309-f0pr0i3hot6jqordnv7bamjhhp8tjdc1.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/voting" element={<Voting />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;