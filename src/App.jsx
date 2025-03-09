import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Suppliers from "./pages/Suppliers";
import CategoryManagement from "./pages/Category";
import ProductManagement from "./pages/Products";
import StockManagement from "./pages/Stock";

function App() {
  return (
    <Router>  {/* Ensure that Router wraps the entire App */}
      <AuthProvider> {/* Wrap AuthProvider inside Router */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
          <Route path="/Stock" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
