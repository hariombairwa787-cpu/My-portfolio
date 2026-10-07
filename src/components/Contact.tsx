import React from "react";
import { Phone, MessageSquare, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface ContactProps {
  phone: string;
  whatsappNumber: string;
}

export default function Contact({ phone, whatsappNumber }: ContactProps) {
  const formatWhatsAppLink = (num: string) => {
    const cleanNum = num.replace(/[^\d]/g, "");
    return `https://wa.me/${cleanNum}`;
  };

  return (
    <section id="contact" className="bg-[#1A1D26] rounded-[20px] p-6 sm:p-8 border border-white/5 relative overflow-hidden w-full text-center scroll-mt-24">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#6C63FF]/10 rounded-full blur-[60px] pointer-events-none -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto flex flex-col items-center gap-4 py-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6C63FF]/10 text-[#6C63FF] rounded-full text-[10px] font-semibold tracking-wider uppercase">
          <Sparkles className="w-3 h-3" /> Let's Collaborate
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
          Ready to Bring Your <span className="text-[#6C63FF]">Vision</span> to Life?
        </h2>
        
        <p className="text-[#A8B0C3] text-xs sm:text-sm leading-relaxed max-w-md mb-2">
          Contact me directly for video commissions, graphic illustrations, or branding consultations.
        </p>

        {/* Buttons - strictly Call Now and WhatsApp */}
        <div className="flex gap-3 w-full max-w-sm mt-2">
          <a
            href={`tel:${phone}`}
            className="flex-1 bg-[#6C63FF] hover:bg-[#6C63FF]/90 text-white py-3 px-4 rounded-xl font-semibold text-xs transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#6C63FF]/20 flex items-center justify-center gap-1.5 select-none"
          >
            <Phone className="w-3.5 h-3.5 fill-white" />
            Call Now
          </a>
          <a
            href={formatWhatsAppLink(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10 py-3 px-4 rounded-xl font-semibold text-xs transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5 select-none"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-[#6C63FF]/10" />
            WhatsApp
          </a>
        </div>

      </motion.div>
    </section>
  );
}
