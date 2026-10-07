import React, { useState } from "react";
import { Sliders, Eye, RefreshCw, Menu, X, Check, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  name: string;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  onReset: () => void;
  hasUnsavedChanges: boolean;
  isViewerOnly: boolean;
  onSaveToServer: () => Promise<void>;
  isSaving: boolean;
  saveSuccess: boolean | null;
  isAdmin: boolean;
  onLogin: (passcode: string) => Promise<boolean>;
  onLogout: () => void;
}

export default function Header({
  name,
  isEditMode,
  setIsEditMode,
  onReset,
  hasUnsavedChanges,
  isViewerOnly,
  onSaveToServer,
  isSaving,
  saveSuccess,
  isAdmin,
  onLogin,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const success = await onLogin(passcode);
      if (success) {
        setShowLoginModal(false);
        setPasscode("");
      } else {
        setLoginError("Incorrect passcode. Please try again.");
      }
    } catch (err) {
      setLoginError("Verification failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?view=true`;
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const menuItems = [
    { label: "About", href: "#about" },
    { label: "Videos", href: "#videos" },
    { label: "Graphic Designs", href: "#graphics" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F1117]/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div id="nav-container" className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C63FF] flex items-center justify-center font-bold text-white transition-all duration-300 group-hover:scale-110 shadow-lg shadow-[#6C63FF]/30">
            S
          </div>
          <span className="font-bold text-white tracking-wide group-hover:text-[#00D4FF] transition-all duration-300">
            {name || "Portfolio"}
          </span>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#A8B0C3] hover:text-[#6C63FF] transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Header Controls (Desktop and Mobile) */}
        <div className="flex items-center gap-3">
          
          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Admin Lock/Unlock status button */}
            {isAdmin ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/25 font-semibold hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
                title="You are logged in as owner. Click to lock/logout."
              >
                <Unlock className="w-3.5 h-3.5 text-green-400" />
                Owner Unlocked
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setLoginError("");
                  setPasscode("");
                }}
                className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-white/5 text-[#A8B0C3] hover:text-white border border-white/10 font-semibold hover:bg-white/10 transition-all duration-300 cursor-pointer"
                title="Login as Administrator to upload and edit"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Owner Login
              </button>
            )}

            {/* Copy Viewer Link button */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full transition-all border font-semibold cursor-pointer ${
                isCopied 
                  ? "bg-green-600/10 text-green-400 border-green-500/30" 
                  : "bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 border-[#00D4FF]/25 hover:scale-[1.02] active:scale-95"
              }`}
              title="Copy the public viewer-only link for clients/others"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied Link!
                </>
              ) : (
                <>
                  Copy Share Link
                </>
              )}
            </button>

            {/* Owner-only administrative controls (Save, Reset, Edit Mode) */}
            {isAdmin && (
              <>
                {isEditMode && (
                  <button
                    onClick={onSaveToServer}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border shadow-md disabled:opacity-50 cursor-pointer ${
                      saveSuccess === true
                        ? "bg-green-600 text-white border-green-600"
                        : saveSuccess === false
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-[#00D4FF] text-slate-900 border-[#00D4FF] hover:bg-[#00D4FF]/90 hover:scale-105 active:scale-95 animate-pulse"
                    }`}
                    title="Publish changes to the server so anyone can see them on the public link"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Publishing...
                      </>
                    ) : saveSuccess === true ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Published!
                      </>
                    ) : saveSuccess === false ? (
                      <>
                        Save Error
                      </>
                    ) : (
                      <>
                        Publish & Save
                      </>
                    )}
                  </button>
                )}

                {isEditMode && (
                  <button
                    id="reset-btn"
                    onClick={() => setShowResetConfirm(true)}
                    className="flex items-center gap-1 text-xs text-[#A8B0C3] hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-3 py-1.5 rounded-full transition-all border border-white/10 cursor-pointer"
                    title="Reset all customized portfolio content to defaults"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Defaults
                  </button>
                )}

                {/* Live status indicator */}
                <div className="flex items-center gap-2 mr-1">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isEditMode ? "bg-[#00D4FF]" : "bg-[#6C63FF]"} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isEditMode ? "bg-[#00D4FF]" : "bg-[#6C63FF]"}`}></span>
                  </span>
                  <span className="text-xs text-[#A8B0C3] font-mono">
                    {isEditMode ? "Edit Active" : "Live View"}
                  </span>
                </div>

                <button
                  id="toggle-edit-mode-btn"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border cursor-pointer ${
                    isEditMode
                      ? "bg-[#6C63FF] text-white border-[#6C63FF] glow-primary"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  }`}
                >
                  {isEditMode ? (
                    <>
                      <Sliders className="w-3.5 h-3.5 animate-spin-slow" />
                      Edit Mode
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      Customize Portfolio
                    </>
                  )}
                </button>
              </>
            )}

          </div>

          {/* Mobile & Tablet controls */}
          <div className="flex lg:hidden items-center gap-2">
            
            {/* Mobile Admin Lock/Unlock */}
            {isAdmin ? (
              <button
                onClick={onLogout}
                className="p-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-400"
                title="Lock Portfolio / Logout Owner"
              >
                <Unlock className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setLoginError("");
                  setPasscode("");
                }}
                className="p-2 rounded-full border border-white/10 bg-white/5 text-[#A8B0C3]"
                title="Owner Login"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Copy Share Link */}
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-full border transition-all ${
                isCopied 
                  ? "bg-green-600 text-white border-green-600" 
                  : "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/35"
              }`}
              title="Copy shareable link"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#00D4FF]" />}
            </button>

            {/* Mobile Save & Publish (Owner Only) */}
            {isAdmin && isEditMode && (
              <button
                onClick={onSaveToServer}
                disabled={isSaving}
                className={`p-2 rounded-full border transition-all ${
                  saveSuccess === true
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-[#00D4FF] text-slate-900 border-[#00D4FF]"
                }`}
                title="Publish and Save"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Mobile Toggle Edit (Owner Only) */}
            {isAdmin && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`p-2 rounded-full border transition-all ${
                  isEditMode
                    ? "bg-[#6C63FF] text-white border-[#6C63FF]"
                    : "bg-white/5 text-[#A8B0C3] border-white/10"
                }`}
                title="Toggle Edit Mode"
              >
                <Sliders className="w-4 h-4" />
              </button>
            )}
            
            {/* Hamburger menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/5 text-[#A8B0C3] hover:text-white border border-white/10 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-[#1A1D26]/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[#A8B0C3] hover:text-[#6C63FF] py-1 block transition-all"
                >
                  {item.label}
                </a>
              ))}
              
              {isAdmin ? (
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-[#A8B0C3] font-mono px-1">
                    <span>Status:</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isEditMode ? "bg-[#00D4FF]" : "bg-[#6C63FF]"}`}></span>
                      <span>{isEditMode ? "Autosave Enabled" : "Live View"}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl border transition-all ${
                      isCopied 
                        ? "bg-green-600/10 text-green-400 border-green-500/30" 
                        : "bg-white/5 text-[#00D4FF] border-white/10"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {isCopied ? "Viewer Link Copied!" : "Copy public viewer link"}
                  </button>

                  {isEditMode && (
                    <button
                      onClick={handleReset}
                      className="flex items-center justify-center gap-2 text-sm text-[#A8B0C3] hover:text-red-400 bg-white/5 py-2.5 rounded-xl border border-white/10 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset to Defaults
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 py-2.5 rounded-xl border border-red-500/20 transition-all cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    Lock Portfolio / Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMobileMenuOpen(false);
                      setLoginError("");
                      setPasscode("");
                    }}
                    className="flex items-center justify-center gap-2 text-sm text-[#00D4FF] bg-[#00D4FF]/10 py-2.5 rounded-xl border border-[#00D4FF]/20 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    Owner Login
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Dialog Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1D26] border border-white/10 p-6 rounded-[20px] max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">Reset Portfolio?</h3>
              <p className="text-[#A8B0C3] text-sm mb-6 leading-relaxed">
                This will delete all custom video uploads, image designs, and edited bio information, resetting everything to original sample data. This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-sm text-[#A8B0C3] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all hover:shadow-lg hover:shadow-red-600/20"
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Login Dialog Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1A1D26] border border-white/10 p-6 rounded-[20px] max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-[#A8B0C3] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/15 text-[#6C63FF] flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Owner Portfolio Login</h3>
                <p className="text-[#A8B0C3] text-xs mt-1 leading-relaxed">
                  Enter your secret owner passcode to enable editing, uploading, and deleting videos.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Enter owner passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0F1117] text-white border border-white/10 rounded-xl focus:border-[#6C63FF] focus:outline-none transition-all text-center tracking-widest text-lg font-mono placeholder:text-sm placeholder:tracking-normal"
                    autoFocus
                    required
                  />
                </div>

                {loginError && (
                  <p className="text-red-400 text-xs text-center font-semibold">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-[#6C63FF] hover:bg-[#6C63FF]/90 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    "Verify & Unlock"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
