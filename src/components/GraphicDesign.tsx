import React, { useState, useRef } from "react";
import { Plus, Trash2, X, Upload, Image as ImageIcon, Link2, Eye, Calendar, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GraphicItem } from "../types";
import { compressImage } from "../utils";

interface GraphicDesignProps {
  graphics: GraphicItem[];
  onAddGraphic: (graphic: GraphicItem) => void;
  onDeleteGraphic: (id: string) => void;
  isEditMode: boolean;
}

export default function GraphicDesign({
  graphics,
  onAddGraphic,
  onDeleteGraphic,
  isEditMode
}: GraphicDesignProps) {
  const [activeImage, setActiveImage] = useState<GraphicItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for adding a new graphic
  const [artTitle, setArtTitle] = useState("");
  const [artCategory, setArtCategory] = useState("Poster Design");
  const [artUrl, setArtUrl] = useState("");
  const [artFileBase64, setArtFileBase64] = useState("");
  const [artFileName, setArtFileName] = useState("");

  const handleArtUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setArtFileBase64(base64);
        setArtFileName(file.name);
        setArtUrl(""); // Clear URL input
        if (!artTitle) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
          setArtTitle(cleanName);
        }
      } catch (err) {
        console.error("Art compression failed", err);
      }
    }
  };

  const resetForm = () => {
    setArtTitle("");
    setArtCategory("Poster Design");
    setArtUrl("");
    setArtFileBase64("");
    setArtFileName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImageUrl = artFileBase64 || artUrl.trim();

    if (!finalImageUrl) {
      alert("Please provide either a local image file or an image link.");
      return;
    }

    const newGraphic: GraphicItem = {
      id: "g_" + Date.now(),
      title: artTitle.trim() || "Untitled Graphic",
      imageUrl: finalImageUrl,
      category: artCategory,
      uploadDate: new Date().toISOString().split("T")[0],
      isCustomUpload: !!artFileBase64
    };

    onAddGraphic(newGraphic);
    setShowAddModal(false);
    resetForm();
  };

  // Split graphics into 2 columns for a robust, deterministic masonry layout
  // When in Edit Mode, we render the "Add" card as the first item, meaning column 1 gets it
  const renderColumnItems = (colIndex: number) => {
    const colItems: React.ReactNode[] = [];

    // If Edit Mode is ON and it's Column 1, add the Upload Card first
    if (isEditMode && colIndex === 0) {
      colItems.push(
        <div
          key="add-art-card"
          onClick={() => setShowAddModal(true)}
          className="rounded-2xl bg-[#0F1117]/50 border-2 border-dashed border-[#00D4FF]/25 hover:border-[#00D4FF] p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition-all duration-300 group hover:bg-[#0F1117] mb-6"
        >
          <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-sm mb-1 group-hover:text-[#00D4FF] transition-all">
            Upload New Poster
          </h4>
          <p className="text-[#A8B0C3] text-[11px] max-w-xs leading-relaxed">
            Upload custom vectors, brand advertisements or digital sketches.
          </p>
        </div>
      );
    }

    // Distribute graphics across the 2 columns
    graphics.forEach((item, idx) => {
      // Adjust distribution so that we balance them beautifully
      const targetCol = idx % 2;
      if (targetCol === colIndex) {
        colItems.push(
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl bg-[#2A2E39] overflow-hidden border border-white/5 shadow-md group hover:border-white/10 hover:shadow-lg transition-all duration-300 relative mb-6 flex flex-col"
          >
            {/* Image Box */}
            <div
              onClick={() => setActiveImage(item)}
              className="relative overflow-hidden cursor-zoom-in bg-black/30"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Category Tag */}
              <span className="absolute bottom-3 left-3 text-[9px] font-bold tracking-wider uppercase text-white bg-[#00D4FF] px-2.5 py-0.5 rounded-full shadow-sm text-slate-900">
                {item.category}
              </span>
            </div>

            {/* Title & Date Details */}
            <div className="p-4">
              <h4 className="text-white font-bold text-sm leading-snug hover:text-[#00D4FF] cursor-pointer transition-colors" onClick={() => setActiveImage(item)}>
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-[#A8B0C3] font-mono mt-3 pt-3 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#6C63FF]" />
                  {item.uploadDate}
                </span>
                <span className="text-[#00D4FF] font-sans font-semibold text-[10px] tracking-wider flex items-center gap-1 hover:underline cursor-pointer" onClick={() => setActiveImage(item)}>
                  <Eye className="w-3 h-3" /> View Art
                </span>
              </div>
            </div>

            {/* Trash Button for Custom deletion */}
            {isEditMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGraphic(item.id);
                }}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-red-600 rounded-full text-white transition-all border border-white/10 hover:border-red-600"
                title="Delete Graphic"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        );
      }
    });

    return colItems;
  };

  return (
    <section id="graphics" className="bg-[#1A1D26] rounded-[20px] p-6 sm:p-8 border border-white/5 space-y-6 scroll-mt-24">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
          <ImageIcon className="w-5 h-5 text-[#00D4FF]" />
          Graphic Design
        </h2>
      </div>

      {/* Masonry-like 2 Column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col">{renderColumnItems(0)}</div>
        <div className="flex flex-col">{renderColumnItems(1)}</div>
      </div>

      {/* Lightbox Image Zoom Preview Modal */}
      <AnimatePresence>
        {activeImage && (
          <div
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-black border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-white/10 rounded-full text-white transition-all border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="w-full h-auto max-h-[85vh] object-contain"
                referrerPolicy="no-referrer"
              />
              
              {/* Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-left">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/20 px-2.5 py-1 rounded-full">
                  {activeImage.category}
                </span>
                <h4 className="text-white font-bold text-lg mt-2 leading-snug">
                  {activeImage.title}
                </h4>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Graphic Design Art Dialog Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1D26] border border-white/10 p-6 rounded-[20px] max-w-md w-full shadow-2xl relative my-8"
            >
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="absolute top-4 right-4 text-[#A8B0C3] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-6">Upload Poster / Graphic</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                    Art Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimal Cyberpunk Brand Cover"
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D4FF] font-sans"
                  />
                </div>

                {/* Category Selectors */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                    Category Tag
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Poster Design", "Branding", "Typography", "Cover Art"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setArtCategory(cat)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          artCategory === cat
                            ? "bg-[#00D4FF] text-slate-900 border-[#00D4FF]"
                            : "bg-[#0F1117] text-[#A8B0C3] border-white/5 hover:border-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* File Upload Image */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                    Art Content
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArtUpload}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full flex items-center justify-center gap-2 border border-dashed rounded-xl py-3 text-xs font-medium transition-all ${
                        artFileBase64
                          ? "border-[#00D4FF] bg-[#00D4FF]/5 text-[#00D4FF]"
                          : "border-white/10 bg-[#0F1117] text-[#A8B0C3] hover:border-[#6C63FF]/50"
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      {artFileBase64 ? `Selected: ${artFileName.substring(0, 20)}...` : "Select Local Image File (.png, .jpg)"}
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="h-px bg-white/5 flex-1"></div>
                      <span className="text-[10px] text-[#A8B0C3]/50 uppercase font-mono">or</span>
                      <div className="h-px bg-white/5 flex-1"></div>
                    </div>

                    <div className="relative">
                      <Link2 className="w-4 h-4 text-[#A8B0C3] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        placeholder="Or paste artwork image URL"
                        disabled={!!artFileBase64}
                        value={artUrl}
                        onChange={(e) => setArtUrl(e.target.value)}
                        className="w-full bg-[#0F1117] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D4FF] disabled:opacity-40"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4 border-t border-white/5 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm text-[#A8B0C3] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm text-slate-900 bg-[#00D4FF] hover:bg-[#00D4FF]/90 rounded-xl font-semibold transition-all shadow-lg shadow-[#00D4FF]/20"
                  >
                    Add Artwork
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
