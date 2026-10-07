/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

import { ProfileData, VideoItem, GraphicItem } from "./types";
import { DEFAULT_PROFILE, DEFAULT_VIDEOS, DEFAULT_GRAPHICS } from "./data";

import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import MyVideos from "./components/MyVideos";
import GraphicDesign from "./components/GraphicDesign";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  // Initialize state from local storage or high-quality default data
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem("portfolio_profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_videos");
      return saved ? JSON.parse(saved) : DEFAULT_VIDEOS;
    } catch {
      return DEFAULT_VIDEOS;
    }
  });

  const [graphics, setGraphics] = useState<GraphicItem[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_graphics");
      return saved ? JSON.parse(saved) : DEFAULT_GRAPHICS;
    } catch {
      return DEFAULT_GRAPHICS;
    }
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem("portfolio_is_admin") === "true";
    } catch {
      return false;
    }
  });

  const isViewerOnly = !isAdmin;

  const handleAdminLogin = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (data.status === "success" && data.token) {
        setIsAdmin(true);
        localStorage.setItem("portfolio_is_admin", "true");
        localStorage.setItem("portfolio_admin_token", data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Admin login verification error:", err);
      return false;
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    localStorage.removeItem("portfolio_is_admin");
    localStorage.removeItem("portfolio_admin_token");
  };

  // Fetch from Express Server on Startup
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (json.status === "success" && json.data) {
          const { profile: serverProfile, videos: serverVideos, graphics: serverGraphics } = json.data;
          if (serverProfile) setProfile(serverProfile);
          if (serverVideos) setVideos(serverVideos);
          if (serverGraphics) setGraphics(serverGraphics);
        } else {
          // If the server doesn't have data, but local storage does, let's upload local storage to the server!
          const savedProfile = localStorage.getItem("portfolio_profile");
          const savedVideos = localStorage.getItem("portfolio_videos");
          const savedGraphics = localStorage.getItem("portfolio_graphics");
          
          if (savedProfile || savedVideos || savedGraphics) {
            const parsedProfile = savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;
            const parsedVideos = savedVideos ? JSON.parse(savedVideos) : DEFAULT_VIDEOS;
            const parsedGraphics = savedGraphics ? JSON.parse(savedGraphics) : DEFAULT_GRAPHICS;
            
            // Upload to server immediately so they match!
            await fetch("/api/portfolio", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                profile: parsedProfile,
                videos: parsedVideos,
                graphics: parsedGraphics
              })
            });
            console.log("Automatically synced local storage to server on initial load");
          }
        }
      } catch (error) {
        console.error("Failed to load portfolio from server:", error);
      } finally {
        setIsLoaded(true);
        setHasUnsavedChanges(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Sync state with local storage on updates
  useEffect(() => {
    localStorage.setItem("portfolio_profile", JSON.stringify(profile));
    if (isLoaded) {
      setHasUnsavedChanges(true);
    }
  }, [profile, isLoaded]);

  useEffect(() => {
    localStorage.setItem("portfolio_videos", JSON.stringify(videos));
    if (isLoaded) {
      setHasUnsavedChanges(true);
    }
  }, [videos, isLoaded]);

  useEffect(() => {
    localStorage.setItem("portfolio_graphics", JSON.stringify(graphics));
    if (isLoaded) {
      setHasUnsavedChanges(true);
    }
  }, [graphics, isLoaded]);

  // Debounced auto-save to server to keep files fully in sync in the workspace
  useEffect(() => {
    if (!isLoaded || isViewerOnly) return;

    const timer = setTimeout(async () => {
      try {
        await fetch("/api/portfolio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile,
            videos,
            graphics,
          }),
        });
        console.log("Auto-saved changes to server");
      } catch (error) {
        console.error("Auto-save to server failed:", error);
      }
    }, 1500); // 1.5 seconds debounce

    return () => clearTimeout(timer);
  }, [profile, videos, graphics, isLoaded, isViewerOnly]);

  // Handle updates
  const handleUpdateProfile = (updated: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleAddVideo = (video: VideoItem) => {
    setVideos((prev) => [video, ...prev]);
  };

  const handleDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddGraphic = (graphic: GraphicItem) => {
    setGraphics((prev) => [graphic, ...prev]);
  };

  const handleDeleteGraphic = (id: string) => {
    setGraphics((prev) => prev.filter((g) => g.id !== id));
  };

  const handleResetDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setVideos(DEFAULT_VIDEOS);
    setGraphics(DEFAULT_GRAPHICS);
    setIsEditMode(false);
    setHasUnsavedChanges(false);
  };

  // Save the full portfolio state to the Express server API
  const handleSaveToServer = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          videos,
          graphics,
        }),
      });
      const json = await res.json();
      if (json.status === "success") {
        setSaveSuccess(true);
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setSaveSuccess(false);
      }
    } catch (error) {
      console.error("Failed to save portfolio to server:", error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-[#0F1117] text-white flex flex-col font-sans selection:bg-[#6C63FF]/30 selection:text-white"
    >
      {/* Dynamic Header */}
      <Header
        name={profile.name}
        isEditMode={isEditMode && !isViewerOnly}
        setIsEditMode={(val) => !isViewerOnly && setIsEditMode(val)}
        onReset={handleResetDefaults}
        hasUnsavedChanges={hasUnsavedChanges}
        isViewerOnly={isViewerOnly}
        onSaveToServer={handleSaveToServer}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
      />

      {/* Main Single Page Layout */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Column (Sticky Details Sidebar on desktop) */}
        <aside className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 h-auto">
          {/* Hero Section */}
          <Hero
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            isEditMode={isEditMode && !isViewerOnly}
          />

          {/* About Me Section */}
          <AboutMe
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            isEditMode={isEditMode && !isViewerOnly}
          />
        </aside>

        {/* Right Column (Scrollable Main Portfolio Sections) */}
        <div className="flex-1 w-full flex flex-col gap-8">
          
          {/* My Videos Section */}
          <MyVideos
            videos={videos}
            onAddVideo={handleAddVideo}
            onDeleteVideo={handleDeleteVideo}
            isEditMode={isEditMode && !isViewerOnly}
          />

          {/* Graphic Design Section */}
          <GraphicDesign
            graphics={graphics}
            onAddGraphic={handleAddGraphic}
            onDeleteGraphic={handleDeleteGraphic}
            isEditMode={isEditMode && !isViewerOnly}
          />

          {/* Contact Section */}
          <Contact
            phone={profile.phone}
            whatsappNumber={profile.whatsappNumber}
          />

          {/* Footer inside Right column for desktop layout completeness */}
          <div className="hidden lg:block mt-2">
            <Footer name={profile.name} />
          </div>

        </div>

      </main>

      {/* Persistent Edit Mode Panel Indicator (Toast/Floater) */}
      {isEditMode && !isViewerOnly && (
        <div className="fixed bottom-6 right-6 z-40 bg-[#1A1D26] border border-[#6C63FF]/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 bg-[#00D4FF] rounded-full animate-ping"></span>
          <p className="text-xs text-white font-medium">
            Customize Mode Active • <span className="text-[#00D4FF]">Autosaved</span>
          </p>
          <button
            onClick={() => setIsEditMode(false)}
            className="text-[10px] bg-[#6C63FF] hover:bg-[#6C63FF]/80 text-white font-bold px-2 py-1 rounded-lg transition-colors ml-1"
          >
            Done
          </button>
        </div>
      )}

      {/* Footer (Visible only on mobile/tablet since it's outside the main column) */}
      <div className="block lg:hidden">
        <Footer name={profile.name} />
      </div>
    </motion.div>
  );
}
