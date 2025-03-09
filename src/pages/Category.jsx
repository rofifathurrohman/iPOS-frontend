import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const CategoryManagement = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Add or Edit
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");  // Redirect to login if no user
    }
    fetchCategories();
  }, [user, navigate]);

  // Fetch categories based on role (Staff Admin, Staff)
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

  // Add a category (only Staff Admin or Staff)
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/categories",
        { name: categoryName },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchCategories();
      setCategoryName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding category", error);
      alert(error.response?.data?.error || "Failed to add category.");
    }
  };

  // Update a category (only Staff Admin or Staff)
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/categories/${editingCategoryId}`,
        { name: categoryName },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchCategories();
      setCategoryName("");
      setEditingCategoryId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating category", error);
      alert(error.response?.data?.error || "Failed to update category.");
    }
  };

  // Delete a category (only Staff Admin or Staff)
  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:5000/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  // Open the modal for editing a category
  const handleEditClick = (category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
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
        <h1 className="text-2xl font-bold mb-4">Manajemen Kategori Produk</h1>

        {/* Only Staff Admin and Staff can add a category */}
        {(user.role === "staff_admin" || user.role === "staff") && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          >
            Tambah Kategori
          </button>
        )}

        {/* Categories Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nama Kategori</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(category)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Yakin ingin menghapus kategori ini?")) {
                        handleDeleteCategory(category.id);
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

        {/* Modal for Add or Edit Category */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "add" ? "Tambah Kategori" : "Edit Kategori"}
              </h2>
              <form
                onSubmit={modalType === "add" ? handleAddCategory : handleUpdateCategory}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Nama Kategori</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama kategori"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
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

export default CategoryManagement;
