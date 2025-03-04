import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold">iPOS Management</h2>
      <ul className="mt-4">
        <li className="mb-2"><Link to="/" className="block p-2 hover:bg-gray-700">Dashboard</Link></li>
        
        {/* Admin Access */}
        {role === "admin" && (
          <>
            <li className="mb-2"><Link to="/users" className="block p-2 hover:bg-gray-700">Manajemen Pengguna</Link></li>
            <li className="mb-2"><Link to="/reports" className="block p-2 hover:bg-gray-700">Laporan</Link></li>
          </>
        )}
        
        {/* Staff Admin Access */}
        {role === "staff_admin" && (
          <>
            <li className="mb-2"><Link to="/users" className="block p-2 hover:bg-gray-700">Manajemen Staff</Link></li>
            <li className="mb-2"><Link to="/transactions" className="block p-2 hover:bg-gray-700">Transaksi</Link></li>
          </>
        )}
        
        {/* Staff & Kasir Access */}
        {(role === "staff" || role === "kasir") && (
          <>
            <li className="mb-2"><Link to="/transactions" className="block p-2 hover:bg-gray-700">Transaksi</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;