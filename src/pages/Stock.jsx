import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const StockManagement = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [productId, setProductId] = useState("");
  const [stockTransactions, setStockTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Add or Remove
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    fetchProducts();
    fetchStockTransactions();
  }, [user, navigate]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setProducts(response.data);  // Populate products with dynamically calculated stock
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Fetch stock transactions
  const fetchStockTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stock", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setStockTransactions(response.data);
    } catch (error) {
      console.error("Error fetching stock transactions", error);
    }
  };

  // Add stock (Staff Admin and Staff)
  const handleAddStock = async (e) => {
    e.preventDefault();

    if (!productId || !quantity) {
      alert("Product and quantity are required!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/stock/add",
        { product_id: productId, quantity },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchStockTransactions();
      setQuantity("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding stock", error);
      alert(error.response?.data?.error || "Failed to add stock.");
    }
  };

  // Remove stock (Staff Admin and Staff)
  const handleRemoveStock = async (e) => {
    e.preventDefault();

    if (!productId || !quantity) {
      alert("Product and quantity are required!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/stock/remove",
        { product_id: productId, quantity },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchStockTransactions();
      setQuantity("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error removing stock", error);
      alert(error.response?.data?.error || "Failed to remove stock.");
    }
  };

  // Open modal for adding/removing stock
  const handleModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={user?.role} />
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Manajemen Stok</h1>

        {(user.role === "staff_admin" || user.role === "staff") && (
          <>
            <button
              onClick={() => handleModal("add")}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
              Tambah Stok
            </button>
            <button
              onClick={() => handleModal("remove")}
              className="bg-yellow-600 text-white px-4 py-2 rounded mb-4"
            >
              Kurangi Stok
            </button>
          </>
        )}

        {/* Products Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nama Produk</th>
              <th className="border border-gray-300 px-4 py-2">Stok</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleModal("add")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Yakin ingin menghapus produk ini?")) {
                        handleRemoveStock(product.id);
                      }
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Add/Remove Stock */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">{modalType === "add" ? "Tambah Stok" : "Kurangi Stok"}</h2>
              <form
                onSubmit={modalType === "add" ? handleAddStock : handleRemoveStock}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Pilih Produk</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Pilih Produk</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Jumlah Stok</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    {modalType === "add" ? "Tambah" : "Kurangi"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-400 text-white py-2 px-4 rounded-lg"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement;
