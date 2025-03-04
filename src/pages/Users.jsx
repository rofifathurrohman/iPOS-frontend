import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  // Add password state
  const [role, setRole] = useState("kasir");
  const [editingUserId, setEditingUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [modalType, setModalType] = useState(""); // Add or Edit
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");  // Redirect to login if no user
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });

      // Filter users based on the role
      const filteredUsers = filterUsersByRole(response.data);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const filterUsersByRole = (users) => {
    // Staff Admin only sees "Staff" and "Kasir" users
    if (user.role === "staff_admin") {
      return users.filter((u) => u.role === "staff" || u.role === "kasir");
    }

    // Admin can see all users
    if (user.role === "admin") {
      return users;
    }

    // Staff can only see "Kasir" users
    return users.filter((u) => u.role === "kasir");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/users",
        { name, email, password, role },  // Include password here
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchUsers(); // Update user list after adding
      setName("");
      setEmail("");
      setPassword("");  // Reset password field
      setRole("kasir");
      setIsModalOpen(false); // Close the modal after successful add
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    const updateData = { name, email, role };

    // Only include password if it's not empty
    if (password.trim() !== "") {
      updateData.password = password; // Update password only if provided
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/users/${editingUserId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      fetchUsers(); // Update user list after editing
      setName("");
      setEmail("");
      setPassword("");  // Reset password field
      setRole("kasir");
      setEditingUserId(null);
      setIsModalOpen(false); // Close the modal after successful edit
    } catch (error) {
      console.error("Error editing user", error.response?.data || error.message);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      fetchUsers(); // Update user list after deletion
      setIsModalOpen(false); // Close modal after deleting user
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
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
        <h1 className="text-2xl font-bold mb-4">Manajemen Pengguna</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Tambah Pengguna
        </button>

        {/* User Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nama</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border border-gray-300 px-4 py-2">{u.id}</td>
                <td className="border border-gray-300 px-4 py-2">{u.name}</td>
                <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                <td className="border border-gray-300 px-4 py-2">{u.role}</td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(u)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  {(user.role === "admin" || user.role === "staff_admin") && (
                    <button
                      onClick={() => {
                        if (window.confirm("Yakin ingin menghapus pengguna ini?")) {
                          handleDeleteUser(u.id);
                        }
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  )}
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
                {modalType === "add" ? "Tambah Pengguna" : "Edit Pengguna"}
              </h2>
              <form
                onSubmit={modalType === "add" ? handleAddUser : handleEditUser}
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
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Masukkan password (kosongkan untuk tidak mengubah)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="kasir">Kasir</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="staff_admin">Staff Admin</option>
                  </select>
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

export default Users;
