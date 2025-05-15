"use client";
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon, PencilSquareIcon, ScaleIcon, TagIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

interface Category {
  id: string;
  name: string;
  createdBy: string;
  active: boolean;
  kilogram: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Category>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch categories with server-side pagination
  const fetchCategories = (pageNum = 1) => {
    setLoading(true);
    console.log('Fetching categories for page:', pageNum);
    fetch(`http://localhost:5119/api/Categories?page=${pageNum}`)
      .then(async (res) => {
        console.log('API Response status:', res.status);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const totalPagesHeader = res.headers.get('X-Total-Pages');
        const currentPageHeader = res.headers.get('X-Current-Page');
        const pageSizeHeader = res.headers.get('X-Page-Size');
        const totalCountHeader = res.headers.get('X-Total-Count');
        setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);
        setPage(currentPageHeader ? parseInt(currentPageHeader) : pageNum);
        setPageSize(pageSizeHeader ? parseInt(pageSizeHeader) : 5);
        setTotalCount(totalCountHeader ? parseInt(totalCountHeader) : 0);
        console.log('Total pages from header:', totalPagesHeader);
        const data = await res.json();
        console.log('Fetched categories:', data);
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories(page);
    // eslint-disable-next-line
  }, [page]);

  // Filter (client-side, after server-side pagination)
  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // Sort (client-side, after server-side pagination)
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (col: keyof Category) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  // Delete handler
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
        const res = await fetch(`http://localhost:5119/api/Categories/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete category");
        Swal.fire("Deleted!", "The category has been deleted.", "success");
        fetchCategories(page);
      } catch (err: any) {
        Swal.fire("Error", err.message || "Failed to delete category", "error");
      }
    }
  };

  return (
    <div className="p-2 sm:p-8 flex justify-center items-start min-h-[80vh] bg-[#f7f9fb]">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <TagIcon className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-semibold text-blue-900">Category List</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name..."
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-full sm:w-64"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            <Link href="/category/add">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition w-full sm:w-auto">
                + Add New Category
              </button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full text-base">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Name {sortBy === 'name' ? (sortDir === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />) : <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />}</div>
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('createdBy')}>
                  <div className="flex items-center gap-1">Created By {sortBy === 'createdBy' ? (sortDir === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />) : <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />}</div>
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('kilogram')}>
                  <div className="flex items-center gap-1">Weight {sortBy === 'kilogram' ? (sortDir === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />) : <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />}</div>
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-6 text-center">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="py-6 text-center text-red-600">{error}</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-gray-400">No categories found.</td></tr>
              ) : (
                sorted.map((cat) => (
                  <tr key={cat.id} className="border-t hover:bg-blue-50 transition">
                    <td className="py-3 px-4 flex items-center gap-2 font-medium text-blue-900">
                      <TagIcon className="h-5 w-5 text-blue-400" />
                      {cat.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-cyan-200 text-cyan-800 px-2 py-1 rounded text-xs font-semibold">
                        <UserIcon className="h-4 w-4" /> {cat.createdBy}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        <ScaleIcon className="h-4 w-4" /> {cat.kilogram}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/category/update/${cat.id}`}>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded" title="Edit">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                        </Link>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          title="Delete"
                          onClick={() => handleDelete(cat.id)}
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
      </div>
    </div>
  );
} 