"use client";
import { CalendarIcon, PencilSquareIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active?: boolean;
  createdAt?: string;
}

function formatShortDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US");
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch users with server-side pagination and search
  const fetchUsers = (pageNum = 1, searchTerm = "", searchBy = "") => {
    setLoading(true);
    const url = new URL("http://localhost:5119/api/users");
    url.searchParams.append("page", pageNum.toString());
    if (searchTerm) url.searchParams.append("searchTerm", searchTerm);
    if (searchBy) url.searchParams.append("searchBy", searchBy);

    fetch(url.toString())
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        const totalPagesHeader = res.headers.get('X-Total-Pages');
        const currentPageHeader = res.headers.get('X-Current-Page');
        const pageSizeHeader = res.headers.get('X-Page-Size');
        const totalCountHeader = res.headers.get('X-Total-Count');
        setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);
        setPage(currentPageHeader ? parseInt(currentPageHeader) : pageNum);
        setPageSize(pageSizeHeader ? parseInt(pageSizeHeader) : 5);
        setTotalCount(totalCountHeader ? parseInt(totalCountHeader) : 0);
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers(page, searchTerm, searchBy);
    // eslint-disable-next-line
  }, [page, searchTerm, searchBy]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        // Call the API to delete the user
        const res = await fetch(`http://localhost:5119/api/users/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete user");
        // Refresh the user list from backend
        fetchUsers(page, searchTerm, searchBy);
        Swal.fire("Deleted!", "The user has been deleted.", "success");
      } catch (err: any) {
        Swal.fire("Error", err.message || "Failed to delete user", "error");
      }
    }
  };

  return (
    <div className="p-2 sm:p-8 flex justify-center items-start min-h-[80vh] bg-[#f7f9fb]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-semibold text-blue-900">User List</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-full sm:w-64"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            />
            <select
              className="border border-gray-300 rounded px-2 py-2 text-black"
              value={searchBy}
              onChange={e => { setSearchBy(e.target.value); setPage(1); }}
            >
              <option value="">All Fields</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
              <option value="active">Status</option>
            </select>
            <Link href="/users/add">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition w-full sm:w-auto">
                + Add New User
              </button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full text-base">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">User Info</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Role</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Created</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-6 text-center">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="py-6 text-center text-red-600">{error}</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-blue-50 transition">
                    {/* User Info */}
                    <td className="py-3 px-4 flex items-center gap-2 font-medium text-blue-900">
                      <UserIcon className="h-5 w-5 text-blue-400" />
                      <div>
                        <div className="font-semibold text-blue-900 text-base">{user.name}</div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <span className="material-icons text-base">mail</span>
                          {user.email}
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-cyan-200 text-cyan-800 px-2 py-1 rounded text-xs font-semibold">
                        <UserIcon className="h-4 w-4" /> {user.role}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
                        ${user.active === true ? "bg-green-100 text-green-800" :
                          user.active === false ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"}`}>
                        {user.active === true ? "Active" : user.active === false ? "Inactive" : "Unknown"}
                      </span>
                    </td>
                    {/* Created */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800`}>
                        <CalendarIcon className="h-4 w-4" />
                        {formatShortDate(user.createdAt || "")}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/users/update/${user.id}`}>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded" title="Edit">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                        </Link>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          title="Delete"
                          onClick={() => handleDelete(user.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Page navigation example" className="mt-6 flex justify-end">
            <ul className="pagination flex gap-1">
              <li className={`page-item ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}>
                <a
                  className="page-link px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setPage(page - 1)}
                  tabIndex={page === 1 ? -1 : 0}
                  aria-disabled={page === 1}
                >
                  Previous
                </a>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? 'font-bold' : ''}`}>
                  <a
                    className={`page-link px-3 py-1 rounded border border-gray-300 cursor-pointer ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </a>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}>
                <a
                  className="page-link px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setPage(page + 1)}
                  tabIndex={page === totalPages ? -1 : 0}
                  aria-disabled={page === totalPages}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        )}
      </motion.div>
    </div>
  );
} 