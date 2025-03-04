import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Suppliers = () => {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Add or Edit
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");  // Redirect to login if no user
    }
    fetchSuppliers();
  }, [user, navigate]);

  // Fetch suppliers based on role (Staff Admin, Staff)
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/suppliers", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    }
  };

  // Add a supplier (only Staff Admin or Staff)
  const handleAddSupplier = async (e) => {
    e.preventDefault();

    if (!name.trim() || !contact.trim() || !address.trim()) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/suppliers",
        { name, contact, address },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchSuppliers();
      setName("");
      setContact("");
      setAddress("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding supplier", error);
      alert(error.response?.data?.error || "Gagal menambahkan supplier.");
    }
  };

  // Update a supplier (only Staff Admin or Staff)
  const handleEditSupplier = async (e) => {
    e.preventDefault();

    if (!name.trim() || !contact.trim() || !address.trim()) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/suppliers/${editingSupplierId}`,
        { name, contact, address },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchSuppliers();
      setName("");
      setContact("");
      setAddress("");
      setEditingSupplierId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error editing supplier", error);
      alert(error.response?.data?.error || "Gagal memperbarui supplier.");
    }
  };

  // Delete a supplier (only Staff Admin or Staff)
  const handleDeleteSupplier = async (supplierId) => {
    try {
      await axios.delete(`http://localhost:5000/suppliers/${supplierId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier", error);
    }
  };

  // Open the modal for editing a supplier
  const handleEditClick = (supplier) => {
    setEditingSupplierId(supplier.id);
    setName(supplier.name);
    setContact(supplier.contact);
    setAddress(supplier.address);
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
        <h1 className="text-2xl font-bold mb-4">Manajemen Supplier</h1>
        {(user.role === "staff_admin" || user.role === "staff") && (
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          >
            Tambah Supplier
          </button>
        )}

        {/* Supplier Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nama</th>
              <th className="border border-gray-300 px-4 py-2">Kontak</th>
              <th className="border border-gray-300 px-4 py-2">Alamat</th>
              <th className="border border-gray-300 px-4 py-2">Ditambahkan Oleh</th>
              <th className="border border-gray-300 px-4 py-2">Tanggal Dibuat</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="border border-gray-300 px-4 py-2">{supplier.id}</td>
                <td className="border border-gray-300 px-4 py-2">{supplier.name}</td>
                <td className="border border-gray-300 px-4 py-2">{supplier.contact}</td>
                <td className="border border-gray-300 px-4 py-2">{supplier.address}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {supplier.created_by_name || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                    {new Date(supplier.created_at).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(supplier)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Yakin ingin menghapus supplier ini?")) {
                        handleDeleteSupplier(supplier.id);
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

        {/* Modal for Add or Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {modalType === "add" ? "Tambah Supplier" : "Edit Supplier"}
              </h2>
              <form
                onSubmit={modalType === "add" ? handleAddSupplier : handleEditSupplier}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Nama</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Kontak</label>
                  <input
                    type="text"
                    placeholder="Masukkan kontak"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Alamat</label>
                  <input
                    type="text"
                    placeholder="Masukkan alamat"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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

export default Suppliers;
