
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/authcontext";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import GuestRegister from "./pages/guestsignup";
import Dashboard from "./pages/dashboard";
import CreateEvent from "./components/createevent";
import ProtectedRoute from "./components/protacted";
import Home from "./pages/home";
import EventDetail from "./pages/eventdetails";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Signup />} />
          <Route path="/guest-register" element={<GuestRegister />} />

          {/* Protected Routes */}
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/event-detail"
            element={
              <ProtectedRoute>
                <EventDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/event-detail/:eventId"
            element={
              <ProtectedRoute>
                <EventDetail />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
