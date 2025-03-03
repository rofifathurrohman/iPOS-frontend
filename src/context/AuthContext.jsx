import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email: email.trim(),  // Trim untuk menghindari spasi kosong
        password: password.trim(),
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      localStorage.setItem("token", response.data.token);
      setUser({ token: response.data.token });
      navigate("/");
    } catch (error) {
      console.error("Login failed", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Login gagal, periksa email dan password!");
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
