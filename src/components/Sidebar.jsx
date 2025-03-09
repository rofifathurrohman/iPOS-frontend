import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold">iPOS Management</h2>
      <ul className="mt-4">
        <li className="mb-2">
          <Link to="/" className="block p-2 hover:bg-gray-700">
            Dashboard
          </Link>
        </li>

        {/* Both Admin and Staff Admin can see the "Manajemen Pengguna" link */}
        {(role === "admin" || role === "staff_admin") && (
          <li className="mb-2">
            <Link to="/users" className="block p-2 hover:bg-gray-700">
              Manajemen Pengguna
            </Link>
          </li>
        )}

        {/* Staff Admin and Staff can see the "Manajemen Supplier" link */}
        {(role === "staff_admin" || role === "staff") && (
          <li className="mb-2">
            <Link to="/suppliers" className="block p-2 hover:bg-gray-700">
              Manajemen Supplier
            </Link>
          </li>
        )}

        {/* Only Staff Admin and Staff can see the "Manajemen Kategori" link */}
        {(role === "staff_admin" || role === "staff") && (
          <li className="mb-2">
            <Link to="/stock" className="block p-2 hover:bg-gray-700">
              Manajemen Stock
            </Link>
          </li>
        )}

        {/* Only Staff Admin and Staff can see the "Manajemen Kategori" link */}
        {(role === "staff_admin" || role === "staff") && (
          <li className="mb-2">
            <Link to="/products" className="block p-2 hover:bg-gray-700">
              Manajemen Produk
            </Link>
          </li>
        )}

        {/* Only Staff Admin and Staff can see the "Manajemen Kategori" link */}
        {(role === "staff_admin" || role === "staff") && (
          <li className="mb-2">
            <Link to="/categories" className="block p-2 hover:bg-gray-700">
              Manajemen Kategori Produk
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
