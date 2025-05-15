"use client";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddAsset() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    serialNumber: "",
    owner: "",
    haveWarranty: false,
    warrantyStartDate: "",
    warrantyEndDate: "",
    active: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const validate = () => {
    const errors: {[key: string]: string} = {};
    if (!form.name.trim()) errors.name = "Asset name is required.";
    if (!form.serialNumber.trim()) errors.serialNumber = "Serial number is required.";
    if (!form.owner.trim()) errors.owner = "Owner is required.";
    if (form.haveWarranty) {
      if (!form.warrantyStartDate) errors.warrantyStartDate = "Warranty start date required.";
      if (!form.warrantyEndDate) errors.warrantyEndDate = "Warranty end date required.";
    }
    return errors;
  };

  const handleReset = () => {
    setForm({
      name: "",
      serialNumber: "",
      owner: "",
      haveWarranty: false,
      warrantyStartDate: "",
      warrantyEndDate: "",
      active: false
    });
    setError(null);
    setSuccess(false);
    setFieldErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5119/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to add asset");
      setSuccess(true);
      setTimeout(() => router.push("/asset/list"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to add asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-start bg-[#f7f9fb] p-3 sm:p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-500 rounded-t-xl px-6 py-4">
          <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">Add New Asset</h2>
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
                      name="name"
                      value={form.name}
                      onChange={handleChange}
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
                      name="serialNumber"
                      value={form.serialNumber}
                      onChange={handleChange}
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
                      name="owner"
                      value={form.owner}
                      onChange={handleChange}
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
                        name="haveWarranty"
                        id="haveWarranty"
                        checked={form.haveWarranty}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700 text-base">Have Warranty</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <div className="flex-1">
                        <input
                          type="date"
                          name="warrantyStartDate"
                          className={`w-full border ${fieldErrors.warrantyStartDate ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                          placeholder="mm/dd/yyyy"
                          value={form.warrantyStartDate}
                          onChange={handleChange}
                          disabled={!form.haveWarranty}
                        />
                        {fieldErrors.warrantyStartDate && <span className="text-red-500 text-sm">{fieldErrors.warrantyStartDate}</span>}
                      </div>
                      <div className="flex-1">
                        <input
                          type="date"
                          name="warrantyEndDate"
                          className={`w-full border ${fieldErrors.warrantyEndDate ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base`}
                          placeholder="mm/dd/yyyy"
                          value={form.warrantyEndDate}
                          onChange={handleChange}
                          disabled={!form.haveWarranty}
                        />
                        {fieldErrors.warrantyEndDate && <span className="text-red-500 text-sm">{fieldErrors.warrantyEndDate}</span>}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="py-3 px-3 font-semibold text-gray-600">Status</td>
                  <td className="py-3 px-3 flex items-center gap-2 w-full">
                    <input
                      type="checkbox"
                      name="active"
                      checked={form.active}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 text-base">Active Status</span>
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
              Asset added successfully!
            </div>
          )}
          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-7 py-2 rounded transition text-base"
              disabled={loading}
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-7 py-2 rounded transition text-base flex items-center gap-2"
              disabled={loading || Object.keys(fieldErrors).length > 0}
            >
              {loading && <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>}
              {loading ? "Saving..." : "Save Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 