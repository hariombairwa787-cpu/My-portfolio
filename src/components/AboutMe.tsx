import React from "react";
import { User, Phone, Mail, MapPin, Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { ProfileData } from "../types";

interface AboutMeProps {
  profile: ProfileData;
  onUpdateProfile: (updated: Partial<ProfileData>) => void;
  isEditMode: boolean;
}

export default function AboutMe({ profile, onUpdateProfile, isEditMode }: AboutMeProps) {
  const infoItems = [
    {
      key: "name" as keyof ProfileData,
      label: "Full Name",
      value: profile.name,
      icon: User,
      color: "text-[#6C63FF]",
      bg: "bg-[#6C63FF]/10",
      placeholder: "e.g. Sophia Martinez"
    },
    {
      key: "phone" as keyof ProfileData,
      label: "Phone Number",
      value: profile.phone,
      icon: Phone,
      color: "text-[#00D4FF]",
      bg: "bg-[#00D4FF]/10",
      placeholder: "e.g. +1 (555) 019-2834"
    },
    {
      key: "email" as keyof ProfileData,
      label: "Email Address",
      value: profile.email,
      icon: Mail,
      color: "text-[#6C63FF]",
      bg: "bg-[#6C63FF]/10",
      placeholder: "e.g. sophia.design@agency.com"
    },
    {
      key: "location" as keyof ProfileData,
      label: "Location",
      value: profile.location,
      icon: MapPin,
      color: "text-[#00D4FF]",
      bg: "bg-[#00D4FF]/10",
      placeholder: "e.g. Los Angeles, CA"
    },
    {
      key: "experience" as keyof ProfileData,
      label: "Experience Level",
      value: profile.experience,
      icon: Briefcase,
      color: "text-[#6C63FF]",
      bg: "bg-[#6C63FF]/10",
      placeholder: "e.g. 5+ Years of Experience"
    }
  ];

  return (
    <section id="about" className="bg-[#1A1D26] rounded-[20px] p-6 border border-white/5 space-y-5 w-full flex-grow">
      
      {/* Header */}
      <h2 className="text-sm uppercase tracking-widest font-bold text-[#A8B0C3]">
        About Me
      </h2>

      {/* Stacked list of details */}
      <div className="space-y-4">
        
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`flex items-center gap-3.5 group ${
                isEditMode ? "p-2 rounded-xl bg-white/5 ring-1 ring-[#6C63FF]/20" : ""
              }`}
            >
              {/* Icon Bubble */}
              <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Contents */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-[#A8B0C3] uppercase tracking-wider block mb-0.5">
                  {item.label}
                </span>

                {isEditMode ? (
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => onUpdateProfile({ [item.key]: e.target.value })}
                    placeholder={item.placeholder}
                    className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#6C63FF] font-sans"
                  />
                ) : (
                  <p className="text-xs sm:text-sm font-semibold text-white tracking-wide break-words">
                    {item.value || <em className="text-[#A8B0C3]/40">Not specified</em>}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* WhatsApp Custom field when in Edit Mode */}
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3.5 p-2 rounded-xl bg-white/5 ring-1 ring-[#00D4FF]/20"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-[#A8B0C3] uppercase tracking-wider block mb-0.5">
                WhatsApp Chat Number (Digits only)
              </span>
              <input
                type="text"
                value={profile.whatsappNumber}
                onChange={(e) => onUpdateProfile({ whatsappNumber: e.target.value.replace(/[^\d]/g, "") })}
                placeholder="e.g. 15550192834"
                className="w-full bg-[#0F1117] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#00D4FF] font-sans"
              />
              <span className="text-[8px] text-[#A8B0C3]/80 mt-0.5 block">
                Digits only, required for WhatsApp redirect link.
              </span>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
