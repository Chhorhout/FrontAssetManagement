"use client";
import { PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  active: boolean;
}

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchSuppliers(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchSuppliers = async (pageNum = 1) => {
    setLoading(true);
    try {
      const url = new URL("http://localhost:5119/api/Supplier");
      url.searchParams.append("page", pageNum.toString());
      // Optionally add pageSize if your API supports it
      // url.searchParams.append("pageSize", pageSize.toString());
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      setTotalPages(res.headers.get('X-Total-Pages') ? parseInt(res.headers.get('X-Total-Pages')!) : 1);
      setPage(res.headers.get('X-Current-Page') ? parseInt(res.headers.get('X-Current-Page')!) : pageNum);
      setPageSize(res.headers.get('X-Page-Size') ? parseInt(res.headers.get('X-Page-Size')!) : 10);
      setTotalCount(res.headers.get('X-Total-Count') ? parseInt(res.headers.get('X-Total-Count')!) : 0);
      const data = await res.json();
      setSuppliers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

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
        const res = await fetch(`http://localhost:5119/api/Supplier/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete supplier");
        Swal.fire("Deleted!", "The supplier has been deleted.", "success");
        setSuppliers(suppliers.filter(s => s.id !== id));
      } catch (err: any) {
        Swal.fire("Error", err.message || "Failed to delete supplier", "error");
      }
    }
  };

  // Filter suppliers by search term
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <span className="text-xl font-semibold text-blue-900">Supplier List</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-full sm:w-64"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            />
            <Link href="/supplier/add">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition w-full sm:w-auto">
                + Add New Supplier
              </button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full text-base">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Email</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Phone Number</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-6 text-center">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="py-6 text-center text-red-600">{error}</td></tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No suppliers found.</td></tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-t hover:bg-blue-50 transition">
                    <td className="py-3 px-4 font-medium text-blue-900">
                      {supplier.name}
                    </td>
                    <td className="py-3 px-4 text-black">
                      {supplier.email}
                    </td>
                    <td className="py-3 px-4 text-black">
                      {supplier.phoneNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${supplier.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {supplier.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/supplier/edit/${supplier.id}`}>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded" title="Edit">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </Link>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          title="Delete"
                          onClick={() => handleDelete(supplier.id)}
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
        {/* Pagination Controls */}
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