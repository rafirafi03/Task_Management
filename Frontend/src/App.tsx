import "./App.css";
import Signup from "./pages/User/Signup";
import Login from "./pages/User/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./router/User/protectedRoute";
import Dashboard from "./pages/User/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";
import UserDetails from "./pages/Admin/userDetails";
import AdminLogin from "./pages/Admin/Login";
import PublicRoute from "./router/User/publicRoute";
import ProtectedAdminRoute from "./router/Admin/protectedRoute";
import PublicAdminRoute from "./router/Admin/publicRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
          <Route element={<PublicAdminRoute />}>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/admin/userDetails/:userId"
              element={<UserDetails />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
