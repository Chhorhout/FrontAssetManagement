"use client";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateAsset() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    serialNumber: "",
    owner: "",
    hasWarranty: false,
    warrantyStart: "",
    warrantyEnd: "",
    active: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:5119/api/assets/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch asset");
        return res.json();
      })
      .then(data => {
        setForm({
          name: data.name || "",
          serialNumber: data.serialNumber || "",
          owner: data.owner || "",
          hasWarranty: !!data.hasWarranty,
          warrantyStart: data.warrantyStart ? data.warrantyStart.slice(0, 10) : "",
          warrantyEnd: data.warrantyEnd ? data.warrantyEnd.slice(0, 10) : "",
          active: !!data.active
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const validate = () => {
    const errors: {[key: string]: string} = {};
    if (!form.name.trim()) errors.name = "Asset name is required.";
    if (!form.serialNumber.trim()) errors.serialNumber = "Serial number is required.";
    if (!form.owner.trim()) errors.owner = "Owner is required.";
    if (form.hasWarranty) {
      if (!form.warrantyStart) errors.warrantyStart = "Warranty start date is required.";
      if (!form.warrantyEnd) errors.warrantyEnd = "Warranty end date is required.";
    }
    return errors;
  };

  const handleReset = () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});
    fetch(`http://localhost:5119/api/assets/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          name: data.name || "",
          serialNumber: data.serialNumber || "",
          owner: data.owner || "",
          hasWarranty: !!data.hasWarranty,
          warrantyStart: data.warrantyStart ? data.warrantyStart.slice(0, 10) : "",
          warrantyEnd: data.warrantyEnd ? data.warrantyEnd.slice(0, 10) : "",
          active: !!data.active
        });
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
      const res = await fetch(`http://localhost:5119/api/assets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to update asset");
      setSuccess(true);
      router.push("/asset/list");
    } catch (err: any) {
      setError(err.message || "Failed to update asset");
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
          <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">Update Asset</h2>
          <Link href="/asset/list">
            <button className="bg-white text-blue-700 font-semibold px-6 py-2 rounded shadow hover:bg-blue-50 transition text-base">Back to List</button>
          </Link>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8" autoComplete="off">
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <tbody>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600 w-full sm:w-1/4 min-w-[140px]">Asset Name</td>
                  <td className="py-3 px-3 flex flex-col items-start gap-2 w-full">
                    <input
                      type="text"
                      className={`w-full border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                      placeholder="Enter asset name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    {fieldErrors.name && <span className="text-red-500 text-sm">{fieldErrors.name}</span>}
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600">Serial Number</td>
                  <td className="py-3 px-3 flex flex-col items-start gap-2 w-full">
                    <input
                      type="text"
                      className={`w-full border ${fieldErrors.serialNumber ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                      placeholder="Enter serial number"
                      value={form.serialNumber}
                      onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                      required
                    />
                    {fieldErrors.serialNumber && <span className="text-red-500 text-sm">{fieldErrors.serialNumber}</span>}
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600">Owner</td>
                  <td className="py-3 px-3 flex flex-col items-start gap-2 w-full">
                    <input
                      type="text"
                      className={`w-full border ${fieldErrors.owner ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                      placeholder="Enter owner name"
                      value={form.owner}
                      onChange={(e) => setForm({ ...form, owner: e.target.value })}
                      required
                    />
                    {fieldErrors.owner && <span className="text-red-500 text-sm">{fieldErrors.owner}</span>}
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600">Warranty</td>
                  <td className="py-3 px-3 flex flex-col items-start gap-2 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={form.hasWarranty}
                        onChange={(e) => setForm({ ...form, hasWarranty: e.target.checked })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700 text-base">Has Warranty</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <div className="flex-1">
                        <input
                          type="date"
                          className={`w-full border ${fieldErrors.warrantyStart ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                          value={form.warrantyStart}
                          onChange={(e) => setForm({ ...form, warrantyStart: e.target.value })}
                          disabled={!form.hasWarranty}
                        />
                        {fieldErrors.warrantyStart && <span className="text-red-500 text-sm">{fieldErrors.warrantyStart}</span>}
                      </div>
                      <div className="flex-1">
                        <input
                          type="date"
                          className={`w-full border ${fieldErrors.warrantyEnd ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                          value={form.warrantyEnd}
                          onChange={(e) => setForm({ ...form, warrantyEnd: e.target.value })}
                          disabled={!form.hasWarranty}
                        />
                        {fieldErrors.warrantyEnd && <span className="text-red-500 text-sm">{fieldErrors.warrantyEnd}</span>}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600">Active Status</td>
                  <td className="py-3 px-3 flex items-center gap-2 w-full">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
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
              Asset updated successfully!
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
              {saving ? "Updating..." : "Update Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 