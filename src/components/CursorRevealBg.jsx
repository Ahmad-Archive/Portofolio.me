import { useEffect, useRef } from "react";

export default function CursorRevealBg({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      // Update variabel CSS secara langsung tanpa re-render React
      containerRef.current.style.setProperty("--x", `${e.clientX}px`);
      containerRef.current.style.setProperty("--y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="reveal-container">
      {/* Layer 1: Background Tersembunyi (Hanya muncul di sekitar kursor) */}
      <div className="revealed-layer" />

      {/* Layer 2: Konten Website Utama (Navbar, Hero, Text, dll) */}
      <div className="main-content">{children}</div>
    </div>
  );
}
