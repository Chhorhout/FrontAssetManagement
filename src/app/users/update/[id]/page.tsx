"use client";
import { EnvelopeIcon, KeyIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateUser() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    active: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5119/api/users/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "",
          role: data.role || "",
          active: data.active || false
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const validate = () => {
    const errors: {[key: string]: string} = {};
    if (!form.name.trim()) errors.name = "User name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = "Invalid email format.";
    if (!form.role.trim()) errors.role = "Role is required.";
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    router.push("/users/list");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const res = await fetch(`http://localhost:5119/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update user");
      setSuccess(true);
      setTimeout(() => router.push("/users/list"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-[80vh] flex justify-center items-start bg-[#f7f9fb] p-3 sm:p-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#5a6ee5] rounded-t-xl px-6 py-4">
          <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">Update User</h2>
          <Link href="/users/list">
            <button className="bg-white text-[#5a6ee5] font-semibold px-6 py-2 rounded shadow hover:bg-blue-50 transition text-base">Back to List</button>
          </Link>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8" autoComplete="off">
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <tbody>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-100 w-full sm:w-1/4 min-w-[180px]">User Name</td>
                  <td className="py-3 px-3 flex items-center gap-3 w-full">
                    <span className="bg-gray-200 rounded p-2 flex items-center"><UserIcon className="h-5 w-5 text-gray-400" /></span>
                    <input
                      type="text"
                      className={`w-full border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                      placeholder="Enter user name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-100">Email Address</td>
                  <td className="py-3 px-3 flex items-center gap-3 w-full">
                    <span className="bg-gray-200 rounded p-2 flex items-center"><EnvelopeIcon className="h-5 w-5 text-gray-400" /></span>
                    <input
                      type="email"
                      className={`w-full border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                      placeholder="Enter email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-100">Password</td>
                  <td className="py-3 px-3 flex items-center gap-3 w-full">
                    <span className="bg-gray-200 rounded p-2 flex items-center"><KeyIcon className="h-5 w-5 text-gray-400" /></span>
                    <input
                      type="password"
                      className={`w-full border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                      placeholder="Enter password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-100">User Role</td>
                  <td className="py-3 px-3 flex items-center gap-3 w-full">
                    <span className="bg-gray-200 rounded p-2 flex items-center"><UserGroupIcon className="h-5 w-5 text-gray-400" /></span>
                    <input
                      type="text"
                      className={`w-full border ${fieldErrors.role ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                      placeholder="Enter role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600 bg-gray-100">Status</td>
                  <td className="py-3 px-3 flex items-center gap-3 w-full">
                    <input
                      type="checkbox"
                      name="active"
                      checked={form.active}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 text-base">Active</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Error/Success */}
          {error && <div className="text-red-600 mt-3 text-base">{error}</div>}
          {success && <div className="text-green-600 mt-3 text-base">User updated successfully!</div>}
          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-7 py-2 rounded transition text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-7 py-2 rounded transition text-base"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 