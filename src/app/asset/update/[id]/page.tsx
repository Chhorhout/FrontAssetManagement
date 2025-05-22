"use client";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from 'react';
import Select, { StylesConfig } from 'react-select';

export default function UpdateAsset() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    id: "",
    name: "",
    serialNumber: "",
    active: false,
    haveWarranty: false,
    warrantyStartDate: "",
    warrantyEndDate: "",
    categoryId: "",
    supplierId: "",
    location: "",
    imageUrl: ""
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch asset, categories, suppliers
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch("http://localhost:5119/api/categories").then(res => res.json()),
      fetch("http://localhost:5119/api/supplier").then(res => res.json()),
      fetch(`http://localhost:5119/api/assets/${id}`).then(res => res.json())
    ])
    .then(([catData, supData, assetData]) => {
      setCategories(catData);
      setSuppliers(supData);
      setForm({
        id: assetData.id || "",
        name: assetData.name || "",
        serialNumber: assetData.serialNumber || "",
        active: !!assetData.active,
        haveWarranty: !!assetData.haveWarranty,
        warrantyStartDate: assetData.warrantyStartDate ? assetData.warrantyStartDate.slice(0, 10) : null,
        warrantyEndDate: assetData.warrantyEndDate ? assetData.warrantyEndDate.slice(0, 10) : null,
        categoryId: assetData.categoryId ? String(assetData.categoryId) : "",
        supplierId: assetData.supplierId ? String(assetData.supplierId) : "",
        location: assetData.location || "",
        imageUrl: assetData.imageUrl || ""
      });
      setImagePreview(assetData.imageUrl || null);
      setImageUrlInput(assetData.imageUrl || "");
      setLoading(false);
    })
    .catch(err => {
      setError("Failed to load data");
      setLoading(false);
    });
  }, [id]);

  const validate = () => {
    const errors: {[key: string]: string} = {};
    if (!form.name.trim()) errors.name = "Asset name is required.";
    if (!form.serialNumber.trim()) errors.serialNumber = "Serial number is required.";
    if (!form.categoryId) errors.categoryId = "Category is required.";
    if (!form.supplierId) errors.supplierId = "Supplier is required.";
    if (!form.location.trim()) errors.location = "Location is required.";
    if (form.haveWarranty) {
      if (!form.warrantyStartDate) errors.warrantyStartDate = "Warranty start date required.";
      if (!form.warrantyEndDate) errors.warrantyEndDate = "Warranty end date required.";
    }
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
      setTimeout(() => router.push("/asset/list"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to update asset");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});
    fetch(`http://localhost:5119/api/assets/${id}`)
      .then(res => res.json())
      .then(assetData => {
        setForm({
          id: assetData.id || "",
          name: assetData.name || "",
          serialNumber: assetData.serialNumber || "",
          active: !!assetData.active,
          haveWarranty: !!assetData.haveWarranty,
          warrantyStartDate: assetData.warrantyStartDate ? assetData.warrantyStartDate.slice(0, 10) : null,
          warrantyEndDate: assetData.warrantyEndDate ? assetData.warrantyEndDate.slice(0, 10) : null,
          categoryId: assetData.categoryId ? String(assetData.categoryId) : "",
          supplierId: assetData.supplierId ? String(assetData.supplierId) : "",
          location: assetData.location || "",
          imageUrl: assetData.imageUrl || ""
        });
        setImagePreview(assetData.imageUrl || null);
        setImageUrlInput(assetData.imageUrl || "");
        setLoading(false);
      });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:5119/api/image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      setImageUrlInput(data.fileUrl);
      setImagePreview(data.fileUrl);
      setForm(prev => ({ ...prev, imageUrl: data.fileUrl }));
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      handleImageUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      handleImageUpload(file);
    }
  };

  // react-select options
  const categoryOptions = categories.map(cat => ({
    value: String(cat.id),
    label: cat.name
  }));
  const supplierOptions = suppliers.map(sup => ({
    value: String(sup.id),
    label: sup.name
  }));

  const customSelectStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      color: 'black',
      minHeight: '44px',
      borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px #2563eb33' : provided.boxShadow,
      '&:hover': { borderColor: '#2563eb' }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
    }),
    input: (provided) => ({
      ...provided,
      color: 'black',
    }),
    option: (provided, state) => ({
      ...provided,
      color: 'black',
      backgroundColor: state.isSelected
        ? '#e5e7eb'
        : state.isFocused
        ? '#f3f4f6'
        : 'white',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;

  return (
    <div className="min-h-[80vh] flex justify-center items-start bg-[#f7f9fb] p-3 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-500 rounded-t-xl px-6 py-4">
          <h2 className="text-2xl font-semibold text-white mb-2 sm:mb-0">Update Asset</h2>
          <Link href="/asset/list">
            <button className="bg-white text-blue-700 font-semibold px-6 py-2 rounded shadow hover:bg-blue-50 transition text-base">Back to List</button>
          </Link>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6" autoComplete="off">
          {/* Asset Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/3 font-semibold text-gray-600">Asset Name</label>
            <div className="flex-1">
              <input
                type="text"
                className={`w-full border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                placeholder="Enter asset name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              {fieldErrors.name && <span className="text-red-500 text-sm">{fieldErrors.name}</span>}
            </div>
          </div>
          {/* Serial Number */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/3 font-semibold text-gray-600">Serial Number</label>
            <div className="flex-1">
              <input
                type="text"
                className={`w-full border ${fieldErrors.serialNumber ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                placeholder="Enter serial number"
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                required
              />
              {fieldErrors.serialNumber && <span className="text-red-500 text-sm">{fieldErrors.serialNumber}</span>}
            </div>
          </div>
          {/* Warranty */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/3 font-semibold text-gray-600">Warranty</label>
            <div className="flex-1">
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
                <input
                  type="date"
                  name="warrantyStartDate"
                  className={`flex-1 border ${fieldErrors.warrantyStartDate ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                  placeholder="mm/dd/yyyy"
                  value={form.warrantyStartDate}
                  onChange={handleChange}
                  disabled={!form.haveWarranty}
                />
                <input
                  type="date"
                  name="warrantyEndDate"
                  className={`flex-1 border ${fieldErrors.warrantyEndDate ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                  placeholder="mm/dd/yyyy"
                  value={form.warrantyEndDate}
                  onChange={handleChange}
                  disabled={!form.haveWarranty}
                />
              </div>
              {fieldErrors.warrantyStartDate && <span className="text-red-500 text-sm">{fieldErrors.warrantyStartDate}</span>}
              {fieldErrors.warrantyEndDate && <span className="text-red-500 text-sm">{fieldErrors.warrantyEndDate}</span>}
            </div>
          </div>
          {/* Category */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/3 font-semibold text-gray-600">Category</label>
            <div className="flex-1">
              <Select
                className="w-full"
                classNamePrefix="react-select"
                options={categoryOptions}
                value={categoryOptions.find(opt => opt.value === String(form.categoryId)) || null}
                onChange={option => {
                  setForm(prev => ({
                    ...prev,
                    categoryId: option && typeof option === 'object' && 'value' in option ? (option as { value: string }).value : ""
                  }));
                }}
                placeholder="Search or select category"
                isClearable
                styles={customSelectStyles}
              />
              {fieldErrors.categoryId && <span className="text-red-500 text-sm">{fieldErrors.categoryId}</span>}
            </div>
          </div>
          {/* Supplier */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/3 font-semibold text-gray-600">Supplier</label>
            <div className="flex-1">
              <Select
                className="w-full"
                classNamePrefix="react-select"
                options={supplierOptions}
                value={supplierOptions.find(opt => opt.value === String(form.supplierId)) || null}
                onChange={option => {
                  setForm(prev => ({
                    ...prev,
                    supplierId: option && typeof option === 'object' && 'value' in option ? (option as { value: string }).value : ""
                  }));
                }}
                placeholder="Search or select supplier"
                isClearable
                styles={customSelectStyles}
              />
              {fieldErrors.supplierId && <span className="text-red-500 text-sm">{fieldErrors.supplierId}</span>}
            </div>
          </div>
          {/* Location */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/3 font-semibold text-gray-600">Location</label>
            <div className="flex-1">
              <input
                type="text"
                className={`w-full border ${fieldErrors.location ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black`}
                placeholder="Enter location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
              {fieldErrors.location && <span className="text-red-500 text-sm">{fieldErrors.location}</span>}
            </div>
          </div>
          {/* Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/3 font-semibold text-gray-600">Status</label>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex-1 mt-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
                ${form.active === true ? "bg-green-100 text-green-800" :
                  form.active === false ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"}`}>
                {form.active === true ? "Active" : form.active === false ? "Inactive" : "Unknown"}
              </span>
            </div>
          </div>
          {/* Image Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="sm:w-1/3 font-semibold text-gray-600">Image</label>
            <div className="flex-1">
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <span className="text-gray-500">Uploading...</span>
                ) : imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="mx-auto h-24 object-contain rounded" />
                ) : (
                  <span className="text-gray-500">Drag & drop an image here, or click to select</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {fieldErrors.imageUrl && <span className="text-red-500 text-sm">{fieldErrors.imageUrl}</span>}
            </div>
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
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-7 py-2 rounded transition"
              disabled={saving}
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-7 py-2 rounded transition flex items-center gap-2"
              disabled={saving || Object.keys(fieldErrors).length > 0}
            >
              {saving ? "Updating..." : "Update Asset"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 