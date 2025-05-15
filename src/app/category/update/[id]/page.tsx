"use client";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateCategory() {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [kilogram, setKilogram] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:5119/api/Categories/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch category");
        return res.json();
      })
      .then(data => {
        setName(data.name || "");
        setCreatedBy(data.createdBy || "");
        setKilogram(data.kilogram || "");
        setActive(!!data.active);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const validate = () => {
    const errors: {[key: string]: string} = {};
    if (!name.trim()) errors.name = "Category name is required.";
    else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
    if (!createdBy.trim()) errors.createdBy = "Created By is required.";
    if (!kilogram.trim()) errors.kilogram = "Weight is required.";
    else if (!/^\d+(kg)?$/.test(kilogram.trim())) errors.kilogram = "Enter a valid weight (e.g. 10kg or 10).";
    return errors;
  };

  const handleReset = () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});
    fetch(`http://localhost:5119/api/Categories/${id}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name || "");
        setCreatedBy(data.createdBy || "");
        setKilogram(data.kilogram || "");
        setActive(!!data.active);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5119/api/Categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, createdBy, kilogram, active }),
      });
      if (!res.ok) throw new Error("Failed to update category");
      setSuccess(true);
      router.push("/category/list");
    } catch (err: any) {
      setError(err.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;

  return (
    <div className="min-h-[80vh] flex justify-center items-start bg-[#f7f9fb] p-3 sm:p-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-500 rounded-t-xl px-6 py-4">
          <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">Update Category</h2>
          <Link href="/category/list">
            <button className="bg-white text-blue-700 font-semibold px-6 py-2 rounded shadow hover:bg-blue-50 transition text-base">Back to List</button>
          </Link>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8" autoComplete="off">
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <tbody>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600 w-full sm:w-1/4 min-w-[140px]">Category Name</td>
                  <td className="py-3 px-3 flex flex-col items-start gap-2 w-full">
                    <input
                      type="text"
                      className={`w-full border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                      placeholder="Enter category name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                    />
                    {fieldErrors.name && <span className="text-red-500 text-sm">{fieldErrors.name}</span>}
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600">Created By</td>
                  <td className="py-3 px-3 flex flex-col items-start gap-2 w-full">
                    <input
                      type="text"
                      className={`w-full border ${fieldErrors.createdBy ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                      placeholder="Creator's name"
                      value={createdBy}
                      onChange={(e) => setCreatedBy(e.target.value)}
                      required
                    />
                    {fieldErrors.createdBy && <span className="text-red-500 text-sm">{fieldErrors.createdBy}</span>}
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600">Weight (Kilogram)</td>
                  <td className="py-3 px-3 flex flex-col items-start gap-2 w-full">
                    <div className="flex w-full items-center gap-2">
                      <input
                        type="text"
                        className={`w-full border ${fieldErrors.kilogram ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                        placeholder="e.g. 10kg"
                        value={kilogram}
                        onChange={(e) => setKilogram(e.target.value)}
                        required
                      />
                      <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-r text-base">kg</span>
                    </div>
                    {fieldErrors.kilogram && <span className="text-red-500 text-sm">{fieldErrors.kilogram}</span>}
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600">Status</td>
                  <td className="py-3 px-3 flex items-center gap-2 w-full">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
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
          {success && (
            <div className="text-green-600 mt-3 text-base flex items-center gap-2">
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              Category updated successfully!
            </div>
          )}
          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-7 py-2 rounded transition text-base"
              disabled={saving}
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-7 py-2 rounded transition text-base flex items-center gap-2"
              disabled={saving || Object.keys(fieldErrors).length > 0}
            >
              {saving && <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>}
              {saving ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 