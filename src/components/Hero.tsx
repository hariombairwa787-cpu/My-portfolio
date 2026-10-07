import React, { useState, useRef } from "react";
import { Camera, Edit2, Check, X, Phone, MessageSquare, Link2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProfileData } from "../types";
import { compressImage } from "../utils";

interface HeroProps {
  profile: ProfileData;
  onUpdateProfile: (updated: Partial<ProfileData>) => void;
  isEditMode: boolean;
}

export default function Hero({ profile, onUpdateProfile, isEditMode }: HeroProps) {
  // Inline editing states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (field: string, currentValue: string) => {
    if (!isEditMode) return;
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = (field: keyof ProfileData) => {
    onUpdateProfile({ [field]: tempValue.trim() });
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        onUpdateProfile({ profilePhoto: base64 });
        setShowPhotoModal(false);
      } catch (err) {
        console.error("Image upload failed", err);
        alert("Failed to process image. Please try a smaller file.");
      }
    }
  };

  const handlePhotoUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoUrlInput.trim()) {
      onUpdateProfile({ profilePhoto: photoUrlInput.trim() });
      setShowPhotoModal(false);
      setPhotoUrlInput("");
    }
  };

  const formatWhatsAppLink = (num: string) => {
    const cleanNum = num.replace(/[^\d]/g, "");
    return `https://wa.me/${cleanNum}`;
  };

  return (
    <section className="bg-[#1A1D26] rounded-[20px] p-6 sm:p-8 flex flex-col items-center text-center gap-5 border border-white/5 relative overflow-hidden w-full">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#6C63FF]/10 rounded-full blur-[60px] pointer-events-none -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center justify-center gap-5 w-full"
      >
        
        {/* Profile Picture */}
        <div className="relative group">
          <div className="w-[150px] h-[150px] rounded-full border-4 border-[#6C63FF] p-1 bg-[#1A1D26] shadow-lg shadow-[#6C63FF]/30 transition-transform duration-500 hover:scale-[1.03] overflow-hidden">
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full bg-[#1A1D26]"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </div>

          {/* Edit Picture Hover Overlay */}
          {isEditMode ? (
            <button
              onClick={() => {
                setShowPhotoModal(true);
                setPhotoUrlInput(profile.profilePhoto.startsWith("data:") ? "" : profile.profilePhoto);
              }}
              className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer border-4 border-transparent"
            >
              <Camera className="w-5 h-5 mb-1 text-[#00D4FF]" />
              <span>Change Photo</span>
            </button>
          ) : null}
        </div>

        {/* Name - 3xl/2xl Bold */}
        <div className="max-w-full px-2">
          {editingField === "name" ? (
            <div className="flex items-center gap-2 justify-center max-w-xs mx-auto">
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit("name")}
                className="bg-[#0F1117] border border-[#6C63FF] text-white text-xl font-bold px-3 py-1.5 rounded-xl text-center focus:outline-none w-full"
                autoFocus
              />
              <button
                onClick={() => saveEdit("name")}
                className="p-2 bg-[#6C63FF] text-white rounded-xl hover:bg-[#6C63FF]/80 transition-all"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="p-2 bg-white/5 text-[#A8B0C3] rounded-xl hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => startEdit("name", profile.name)}
              className={`relative group inline-block ${
                isEditMode ? "cursor-pointer border-b border-dashed border-[#6C63FF]/50 hover:border-[#6C63FF] px-2 py-0.5 rounded-lg hover:bg-white/5" : ""
              }`}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                {profile.name}
              </h1>
              {isEditMode && (
                <Edit2 className="w-3.5 h-3.5 text-[#6C63FF] absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="max-w-full px-2">
          {editingField === "title" ? (
            <div className="flex items-center gap-2 justify-center max-w-xs mx-auto">
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit("title")}
                className="bg-[#0F1117] border border-[#6C63FF] text-[#6C63FF] text-xs font-semibold px-3 py-1.5 rounded-xl text-center focus:outline-none w-full"
                autoFocus
              />
              <button
                onClick={() => saveEdit("title")}
                className="p-1.5 bg-[#6C63FF] text-white rounded-lg hover:bg-[#6C63FF]/80 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={cancelEdit}
                className="p-1.5 bg-white/5 text-[#A8B0C3] rounded-lg hover:bg-white/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => startEdit("title", profile.title)}
              className={`relative group inline-block ${
                isEditMode ? "cursor-pointer border-b border-dashed border-[#6C63FF]/50 hover:border-[#6C63FF] px-2 py-0.5 rounded-md hover:bg-white/5" : ""
              }`}
            >
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#6C63FF]">
                {profile.title}
              </p>
              {isEditMode && (
                <Edit2 className="w-3 h-3 text-[#6C63FF] absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          )}
        </div>

        {/* Short Introduction */}
        <div className="max-w-full px-2">
          {editingField === "intro" ? (
            <div className="flex flex-col gap-2 max-w-xs mx-auto">
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                rows={3}
                className="bg-[#0F1117] border border-[#6C63FF] text-white text-xs px-3 py-2 rounded-xl focus:outline-none w-full resize-none text-center"
                autoFocus
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => saveEdit("intro")}
                  className="flex items-center gap-1 px-3 py-1 bg-[#6C63FF] text-white rounded-lg text-[10px] hover:bg-[#6C63FF]/80 transition-all font-semibold"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1 px-3 py-1 bg-white/5 text-[#A8B0C3] rounded-lg text-[10px] hover:bg-white/10 transition-all"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => startEdit("intro", profile.intro)}
              className={`relative group inline-block ${
                isEditMode ? "cursor-pointer border-b border-dashed border-[#6C63FF]/50 hover:border-[#6C63FF] px-2 py-1 rounded-lg hover:bg-white/5" : ""
              }`}
            >
              <p className="text-[#A8B0C3] text-xs sm:text-sm leading-relaxed px-2">
                "{profile.intro}"
              </p>
              {isEditMode && (
                <Edit2 className="w-3 h-3 text-[#6C63FF] absolute -right-2 -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          )}
        </div>

        {/* Action Call To Actions */}
        <div className="flex gap-3 w-full mt-2">
          <a
            href={`tel:${profile.phone}`}
            className="flex-1 bg-[#6C63FF] hover:bg-[#6C63FF]/90 text-white py-3 rounded-xl font-semibold text-xs transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#6C63FF]/20 flex items-center justify-center gap-1.5 select-none"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            Call Me
          </a>
          <a
            href={formatWhatsAppLink(profile.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10 py-3 rounded-xl font-semibold text-xs transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 select-none"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-[#6C63FF]/20" />
            WhatsApp
          </a>
        </div>

      </motion.div>

      {/* Photo Change Modal */}
      <AnimatePresence>
        {showPhotoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1D26] border border-white/10 p-6 rounded-[20px] max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowPhotoModal(false)}
                className="absolute top-4 right-4 text-[#A8B0C3] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-4">Change Profile Picture</h3>
              
              {/* Option 1: Upload File */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                  Option 1: Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-[#6C63FF] bg-white/5 hover:bg-[#6C63FF]/5 p-6 rounded-2xl cursor-pointer transition-all gap-2 group"
                >
                  <Upload className="w-8 h-8 text-[#A8B0C3] group-hover:text-[#6C63FF] transition-all" />
                  <span className="text-sm font-medium text-white group-hover:text-[#6C63FF] transition-all">
                    Choose local image
                  </span>
                  <span className="text-xs text-[#A8B0C3]">
                    Auto-compressed to fit perfectly
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-white/5 flex-1"></div>
                <span className="text-xs text-[#A8B0C3]/60 uppercase tracking-widest">or</span>
                <div className="h-px bg-white/5 flex-1"></div>
              </div>

              {/* Option 2: Image URL */}
              <form onSubmit={handlePhotoUrlSubmit}>
                <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                  Option 2: Paste Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    className="flex-1 bg-[#0F1117] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#6C63FF] font-sans"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#6C63FF] hover:bg-[#6C63FF]/90 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
                  >
                    <Link2 className="w-4 h-4" />
                    Apply
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
