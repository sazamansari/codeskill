"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, ShieldOff, Search, Loader2 } from "lucide-react";
import { adminUsersAPI } from "@/config/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adminsOnly, setAdminsOnly] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminUsersAPI.getAll(search, adminsOnly);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, adminsOnly]);

  const handlePromote = async (userId: string) => {
    setActionLoading(userId);
    try {
      const res = await adminUsersAPI.promote(userId);
      toast.success(res.data.message);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (userId: string) => {
    if (!confirm("Are you sure you want to remove admin access for this user?")) return;
    setActionLoading(userId);
    try {
      const res = await adminUsersAPI.demote(userId);
      toast.success(res.data.message);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to demote user");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-8 font-sans max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
        <p className="text-gray-500 text-sm mt-1">Search users and manage administrative privileges.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="adminsOnly"
              checked={adminsOnly}
              onChange={(e) => setAdminsOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <label htmlFor="adminsOnly" className="text-sm text-gray-700 cursor-pointer select-none">
              Show Admins Only
            </label>
          </div>
        </div>

        {/* User List */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ShieldOff className="w-12 h-12 text-gray-300 mb-4" />
              <p>No users found matching your search.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {u.isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <ShieldCheck className="w-3.5 h-3.5" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {actionLoading === u._id ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin ml-auto" />
                      ) : u.isAdmin ? (
                        <button
                          disabled={currentUser?.id === u._id}
                          onClick={() => handleDemote(u._id)}
                          className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                            currentUser?.id === u._id
                              ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                              : "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
                          }`}
                          title={currentUser?.id === u._id ? "You cannot demote yourself" : "Remove admin access"}
                        >
                          Demote
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePromote(u._id)}
                          className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Promote to Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
