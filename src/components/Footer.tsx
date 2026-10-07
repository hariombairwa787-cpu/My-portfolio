import React from "react";

interface FooterProps {
  name: string;
}

export default function Footer({ name }: FooterProps) {
  return (
    <footer className="py-6 text-center text-[10px] text-[#A8B0C3]/50 font-mono tracking-wider w-full">
      <p>© 2026 {name || "Your Name"}. All Rights Reserved.</p>
    </footer>
  );
}
