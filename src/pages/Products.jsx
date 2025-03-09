import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Add or Edit
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    fetchProducts();
    fetchCategories();
  }, [user, navigate]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setProducts(response.data);  // Populate products without stock
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Add a product (Staff Admin or Staff)
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name.trim() || !categoryId || !buyPrice || !sellPrice || !barcode) {
      alert("All fields are required!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/products",
        { name, category_id: categoryId, buy_price: buyPrice, sell_price: sellPrice, barcode },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchProducts();
      setName("");
      setCategoryId("");
      setBuyPrice("");
      setSellPrice("");
      setBarcode("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding product", error);
      alert(error.response?.data?.error || "Failed to add product.");
    }
  };

  // Update a product (Staff Admin or Staff)
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!name.trim() || !categoryId || !buyPrice || !sellPrice || !barcode) {
      alert("All fields are required!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/products/${editingProductId}`,
        { name, category_id: categoryId, buy_price: buyPrice, sell_price: sellPrice, barcode },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchProducts();
      setName("");
      setCategoryId("");
      setBuyPrice("");
      setSellPrice("");
      setBarcode("");
      setEditingProductId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating product", error);
      alert(error.response?.data?.error || "Failed to update product.");
    }
  };

  // Delete a product (Staff Admin or Staff)
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  // Open the modal for editing a product
  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setCategoryId(product.category_id);
    setBuyPrice(product.buy_price);
    setSellPrice(product.sell_price);
    setBarcode(product.barcode);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={user?.role} />
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Manajemen Produk</h1>

        {/* Only Staff Admin and Staff can add a product */}
        {(user.role === "staff_admin" || user.role === "staff") && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          >
            Tambah Produk
          </button>
        )}

        {/* Products Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nama Produk</th>
              <th className="border border-gray-300 px-4 py-2">Kategori</th>
              <th className="border border-gray-300 px-4 py-2">Harga Beli</th>
              <th className="border border-gray-300 px-4 py-2">Harga Jual</th>
              <th className="border border-gray-300 px-4 py-2">Barcode</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.category_name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.buy_price}</td>
                <td className="border border-gray-300 px-4 py-2">{product.sell_price}</td>
                <td className="border border-gray-300 px-4 py-2">{product.barcode}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Yakin ingin menghapus produk ini?")) {
                        handleDeleteProduct(product.id);
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

        {/* Modal for Add or Edit Product */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "add" ? "Tambah Produk" : "Edit Produk"}
              </h2>
              <form
                onSubmit={modalType === "add" ? handleAddProduct : handleUpdateProduct}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Nama Produk</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama produk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Kategori</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Harga Beli</label>
                  <input
                    type="number"
                    placeholder="Masukkan harga beli"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Harga Jual</label>
                  <input
                    type="number"
                    placeholder="Masukkan harga jual"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Barcode</label>
                  <input
                    type="text"
                    placeholder="Masukkan barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    {modalType === "add" ? "Tambah" : "Perbarui"}
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

export default ProductManagement;
