import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return <div className="text-center text-lg font-semibold p-6">Loading...</div>;
  }

  const role = user.role;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold">Dashboard - {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
        {role === "admin" ? (
          <div className="mt-4 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-gray-700">Sebagai Admin, Anda dapat mengelola pengguna, produk, transaksi, dan melihat laporan.</p>
            <ul className="mt-4 space-y-2">
              <li className="bg-blue-500 text-white p-2 rounded">➤ Manajemen Pengguna</li>
              <li className="bg-green-500 text-white p-2 rounded">➤ Manajemen Produk</li>
              <li className="bg-yellow-500 text-white p-2 rounded">➤ Laporan Keuangan</li>
            </ul>
          </div>
        ) : (
          <div className="mt-4 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold">Kasir Panel</h2>
            <p className="text-gray-700">Sebagai Kasir, Anda hanya dapat mengelola transaksi dan mencetak struk.</p>
            <ul className="mt-4 space-y-2">
              <li className="bg-blue-500 text-white p-2 rounded">➤ Buat Transaksi</li>
              <li className="bg-green-500 text-white p-2 rounded">➤ Cetak Struk</li>
            </ul>
          </div>
        )}
        <button onClick={logout} className="mt-6 bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
