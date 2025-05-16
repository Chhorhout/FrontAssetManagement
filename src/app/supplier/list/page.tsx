"use client";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:5119/api/Supplier");
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await fetch(`http://localhost:5119/api/Supplier/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete supplier");
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete supplier");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-[80vh] bg-[#f7f9fb] p-3 sm:p-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#5a6ee5] rounded-t-xl px-6 py-4">
          <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">Suppliers</h2>
          <Link href="/supplier/add">
            <button className="bg-white text-[#5a6ee5] font-semibold px-6 py-2 rounded shadow hover:bg-blue-50 transition text-base">Add New Supplier</button>
          </Link>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-3 text-left font-semibold text-gray-600">Name</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600">Email</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600">Phone Number</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600">Status</th>
                <th className="py-3 px-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-3 text-black font-semibold">{supplier.name}</td>
                  <td className="py-3 px-3 text-black font-semibold">{supplier.email}</td>
                  <td className="py-3 px-3 text-black font-semibold">{supplier.phoneNumber}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${supplier.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {supplier.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <Link href={`/supplier/edit/${supplier.id}`}>
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 