import React, { useState, useRef } from "react";
import { Play, Plus, Trash2, X, Upload, Video, Link2, Eye, Calendar, Sparkles, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoItem } from "../types";
import { parseVideoUrl, compressImage } from "../utils";

interface MyVideosProps {
  videos: VideoItem[];
  onAddVideo: (video: VideoItem) => void;
  onDeleteVideo: (id: string) => void;
  isEditMode: boolean;
}

export default function MyVideos({
  videos,
  onAddVideo,
  onDeleteVideo,
  isEditMode
}: MyVideosProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Form states for adding a new video
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("AI Cinema");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState("");
  
  const [coverUrl, setCoverUrl] = useState("");
  const [coverBase64, setCoverBase64] = useState("");
  const [coverFileName, setCoverFileName] = useState("");

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoFileName(file.name);
      setVideoUrl(""); // clear link if file chosen
      if (!videoTitle) {
        // Auto-fill title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setVideoTitle(cleanName);
      }
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setCoverBase64(base64);
        setCoverFileName(file.name);
        setCoverUrl(""); // clear link if file uploaded
      } catch (err) {
        console.error("Cover upload failed", err);
      }
    }
  };

  const resetForm = () => {
    setVideoTitle("");
    setVideoCategory("AI Cinema");
    setVideoUrl("");
    setVideoFile(null);
    setVideoFileName("");
    setCoverUrl("");
    setCoverBase64("");
    setCoverFileName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalVideoUrl = videoUrl.trim();
    let finalCoverUrl = coverUrl.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600";

    // If local video uploaded
    if (videoFile) {
      finalVideoUrl = URL.createObjectURL(videoFile);
    }

    // If local cover image uploaded
    if (coverBase64) {
      finalCoverUrl = coverBase64;
    }

    if (!finalVideoUrl) {
      alert("Please provide either a video file or a link.");
      return;
    }

    const newVideo: VideoItem = {
      id: "v_" + Date.now(),
      title: videoTitle.trim() || "Untitled Project",
      thumbnailUrl: finalCoverUrl,
      videoUrl: finalVideoUrl,
      category: videoCategory,
      uploadDate: new Date().toISOString().split("T")[0],
      isCustomUpload: !!videoFile
    };

    onAddVideo(newVideo);
    setShowAddModal(false);
    resetForm();
  };

  return (
    <section id="videos" className="bg-[#1A1D26] rounded-[20px] p-6 sm:p-8 border border-white/5 space-y-6 scroll-mt-24">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
          <Video className="w-5 h-5 text-[#6C63FF]" />
          My Videos
        </h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* ADD VIDEO CARD (Visible only in Edit Mode) */}
        {isEditMode && (
          <div
            onClick={() => setShowAddModal(true)}
            className="rounded-2xl bg-[#0F1117]/50 border-2 border-dashed border-[#6C63FF]/25 hover:border-[#6C63FF] p-6 flex flex-col items-center justify-center text-center cursor-pointer aspect-[9/16] w-full transition-all duration-300 group hover:bg-[#0F1117]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1 group-hover:text-[#6C63FF] transition-all">
              Upload New Video
            </h3>
            <p className="text-[#A8B0C3] text-[10px] max-w-xs leading-relaxed">
              Choose an MP4 file, paste a YouTube/Vimeo link, and custom-tag your project.
            </p>
          </div>
        )}

        {(() => {
          // In Edit Mode, always show all videos so it's easy to manage.
          // Otherwise, respect the showAll toggle.
          const displayedVideos = (isEditMode || showAll) ? videos : videos.slice(0, 4);
          
          return displayedVideos.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-[#2A2E39] overflow-hidden border border-white/5 shadow-md group hover:border-white/10 hover:shadow-lg transition-all duration-300 relative flex flex-col"
            >
              {/* Thumbnail Box */}
              <div
                onClick={() => setActiveVideo(item)}
                className="relative aspect-[9/16] w-full overflow-hidden cursor-pointer bg-black/30"
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                
                {/* Overlay with play button */}
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105 group-hover:bg-[#6C63FF] group-hover:border-[#6C63FF] shadow-md">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Category Tag */}
                <span className="absolute bottom-3 left-3 text-[9px] font-bold tracking-wider uppercase text-white bg-[#6C63FF] px-2.5 py-0.5 rounded-full shadow-sm">
                  {item.category}
                </span>

                {/* Dynamic local video indicator */}
                {item.isCustomUpload && (
                  <span className="absolute top-3 left-3 text-[8px] font-semibold text-white bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#00D4FF]" />
                    Active Session File
                  </span>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-bold text-sm leading-snug hover:text-[#6C63FF] cursor-pointer transition-colors" onClick={() => setActiveVideo(item)}>
                    {item.title}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-[#A8B0C3] font-mono mt-3 pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#6C63FF]" />
                    {item.uploadDate}
                  </span>
                  <span className="text-[#6C63FF] font-sans font-semibold text-[10px] tracking-wider flex items-center gap-1 hover:underline cursor-pointer" onClick={() => setActiveVideo(item)}>
                    <Eye className="w-3 h-3" /> Preview Project
                  </span>
                </div>
              </div>

              {/* Trash Button for Edit Mode */}
              {isEditMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVideo(item.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-red-600 rounded-full text-white transition-all border border-white/10 hover:border-red-600 cursor-pointer"
                  title="Delete Video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          ));
        })()}

      </div>

      {/* See More Toggle Button (Visible if there are more than 4 videos and not in Edit Mode where all are shown) */}
      {!isEditMode && videos.length > 4 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6C63FF]/15 text-white border border-[#6C63FF]/30 hover:bg-[#6C63FF] hover:border-[#6C63FF] transition-all duration-300 font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer hover:scale-105 active:scale-95"
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4 text-[#00D4FF]" />
              </>
            ) : (
              <>
                See More ({videos.length - 4} More Projects)
                <ChevronDown className="w-4 h-4 text-[#00D4FF]" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Cinematic Video Lightbox Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm aspect-[9/16] max-h-[90vh] md:max-h-[85vh] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-between items-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-white/10 rounded-full text-white transition-all border border-white/10 cursor-pointer"
                title="Close Player"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Dynamic Player Screen */}
              <div className="w-full flex-grow relative flex items-center justify-center bg-[#0F1117]">
                {(() => {
                  const parsed = parseVideoUrl(activeVideo.videoUrl);
                  
                  if (parsed.type === "youtube" || parsed.type === "vimeo") {
                    return (
                      <iframe
                        src={parsed.embedUrl}
                        title={activeVideo.title}
                        className="w-full h-full border-0 aspect-[9/16]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    );
                  } else {
                    return (
                      <video
                        src={activeVideo.videoUrl}
                        controls
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                      ></video>
                    );
                  }
                })()}
              </div>

              {/* Footer with Project Title & Direct Link Fallback (Resolves CORS and Browser policies) */}
              <div className="w-full p-4 bg-[#1A1D26] border-t border-white/10 flex items-center justify-between gap-3">
                <div className="truncate flex-grow">
                  <p className="text-white text-xs font-bold truncate leading-tight">
                    {activeVideo.title}
                  </p>
                  <p className="text-[#A8B0C3] text-[9px] font-mono mt-0.5">
                    Category: {activeVideo.category}
                  </p>
                </div>
                <a
                  href={activeVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-[#6C63FF]/15 hover:border-[#6C63FF]/30 text-white hover:text-[#00D4FF] text-[10px] font-semibold transition-all shrink-0"
                  title="If video takes too long to load, click to open it directly in a new tab"
                >
                  Open Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Video Dialog Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1D26] border border-white/10 p-6 rounded-[20px] max-w-lg w-full shadow-2xl relative my-8"
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

              <h3 className="text-lg font-bold text-white mb-6">Add Showcase Video</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neo-Tokyo Commercial Edit"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6C63FF] font-sans"
                  />
                </div>

                {/* Category selectors */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                    Category Tag
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["AI Cinema", "Video Edit", "Commercial", "3D Motion"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setVideoCategory(cat)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          videoCategory === cat
                            ? "bg-[#6C63FF] text-white border-[#6C63FF]"
                            : "bg-[#0F1117] text-[#A8B0C3] border-white/5 hover:border-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Source */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                    Video Content
                  </label>
                  <div className="space-y-3">
                    
                    {/* Choose Local Video File */}
                    <div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full flex items-center justify-center gap-2 border border-dashed rounded-xl py-3 text-xs font-medium transition-all ${
                          videoFile
                            ? "border-[#00D4FF] bg-[#00D4FF]/5 text-[#00D4FF]"
                            : "border-white/10 bg-[#0F1117] text-[#A8B0C3] hover:border-[#6C63FF]/50"
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {videoFile ? `Selected: ${videoFileName.substring(0, 25)}...` : "Select Local Video File (.mp4, .webm)"}
                      </button>
                    </div>

                    {/* Or URL link */}
                    <div className="flex items-center gap-2">
                      <div className="h-px bg-white/5 flex-1"></div>
                      <span className="text-[10px] text-[#A8B0C3]/50 uppercase font-mono">or</span>
                      <div className="h-px bg-white/5 flex-1"></div>
                    </div>

                    <div>
                      <div className="relative">
                        <Link2 className="w-4 h-4 text-[#A8B0C3] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          placeholder="Paste YouTube, Vimeo or Direct MP4 link"
                          disabled={!!videoFile}
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="w-full bg-[#0F1117] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6C63FF] disabled:opacity-40"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Poster Image */}
                <div>
                  <label className="block text-xs font-semibold text-[#A8B0C3] uppercase tracking-wider mb-2">
                    Cover Thumbnail Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      ref={coverInputRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className={`w-full flex items-center justify-center gap-2 border border-dashed rounded-xl py-2.5 text-xs font-medium transition-all ${
                        coverBase64
                          ? "border-[#00D4FF] bg-[#00D4FF]/5 text-[#00D4FF]"
                          : "border-white/10 bg-[#0F1117] text-[#A8B0C3] hover:border-[#6C63FF]/50"
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      {coverBase64 ? `Selected Cover Image` : "Upload Custom Cover Image"}
                    </button>

                    <input
                      type="url"
                      placeholder="Or paste cover image URL"
                      disabled={!!coverBase64}
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className="w-full bg-[#0F1117] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#6C63FF] disabled:opacity-40"
                    />
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
                    className="px-5 py-2 text-sm text-white bg-[#6C63FF] hover:bg-[#6C63FF]/90 rounded-xl font-semibold transition-all shadow-lg shadow-[#6C63FF]/20"
                  >
                    Add to Portfolio
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
