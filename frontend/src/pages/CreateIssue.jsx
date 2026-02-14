import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const CATEGORIES = [
  { value: "ROAD", label: "Road" },
  { value: "WATER", label: "Water" },
  { value: "ELECTRICITY", label: "Electricity" },
  { value: "SANITATION", label: "Sanitation" },
  { value: "OTHER", label: "Other" },
];

function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

export default function CreateIssue() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "ROAD",
    address: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocationError(null);
    setIsUploading(true);

    try {
      let lat = 0;
      let lng = 0;
      try {
        const coords = await getBrowserLocation();
        lat = coords.lat;
        lng = coords.lng;
      } catch (err) {
        const message =
          err.code === 1
            ? "Location was denied. Issue will be saved without precise location."
            : err.code === 3
              ? "Location request timed out."
              : "Could not get your location. Issue will be saved without precise location.";
        setLocationError(message);
        const useAnyway = window.confirm(
          message + " Do you want to submit anyway?"
        );
        if (!useAnyway) {
          setIsUploading(false);
          return;
        }
      }

      let imageUrl = "";
      if (imageFile) {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "civicBridge");
        const cloudName = "dk4dt7xd0";
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: data }
        );
        const fileData = await response.json();
        imageUrl = fileData.secure_url ?? "";
      }

      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        address: formData.address.trim() || undefined,
        imageUrl: imageUrl || undefined,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };

      await api.post("/issues", issueData);
      navigate("/issue-feed");
    } catch (err) {
      console.error(err);
      alert("Failed to report issue. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f2a44] via-[#163552] to-[#1b3f5e]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-white/10 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Report a civic issue
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            When you submit, we’ll use your current browser location to tag the issue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Title */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Pothole on Main Street"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
              />
            </label>

            {/* Description */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue and where it is..."
                required
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition resize-none"
              />
            </label>

            {/* Category */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Category</span>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Photo */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Photo (optional)</span>
              <div className="relative rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-6 sm:p-8 text-center transition hover:border-orange-200 hover:bg-orange-50/30">
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  {preview ? (
                    <div className="space-y-3">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-40 sm:h-48 w-full object-contain rounded-lg mx-auto bg-white/80"
                      />
                      <span className="text-sm text-orange-600 font-medium">
                        Change photo
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-600">
                        Click to upload a photo of the issue.
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Address */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Address (optional)</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 123 Main St, City"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition"
              />
              <p className="mt-1 text-xs text-slate-500">
                Add a readable address to help locate the issue.
              </p>
            </label>

            {locationError && (
              <p className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
                {locationError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full rounded-xl bg-orange-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? "Getting location & submitting…" : "Submit issue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
