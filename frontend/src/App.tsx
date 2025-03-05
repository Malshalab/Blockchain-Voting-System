import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Voting from "./pages/Voting";
import Dashboard from "./pages/Dashboard"
import Navbar from "./components/Navbar";

function App() {
  return (
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
  );
};

export default App;
