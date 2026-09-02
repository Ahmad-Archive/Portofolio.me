import { useState, useEffect } from 'react';

const items = [
  { id: 1, src: "/Image/CCSE.jpg", title: "CCSE", desc: "Certificate CCSE" },
  { id: 2, src: "/Image/DicodingDev.jpg", title: "Dicoding", desc: "Certificate Dicoding Developer" },
  { id: 3, src: "/Image/HTML.jpg", title: "HTML", desc: "Certificate HTML" },
  { id: 4, src: "/Image/Python-Algorithm.png", title: "Algorithm with Python", desc: "Certificate Python Algorithm" },
  { id: 5, src: "/Image/Python-Lanjutan.jpg", title: "Python Lanjutan", desc: "Certificate Python Lanjutan" },
];

export default function GalleryCarousel() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, isPaused]);

  return (
    <div className="curved-carousel-wrapper">
      {/* Container Khusus Ruang 3D */}
      <div className="curved-carousel-container">
        {items.map((item, index) => {
          let offset = index - activeIndex;
          const half = Math.floor(items.length / 2);

          if (offset > half) {
            offset -= items.length;
          } else if (offset < -half) {
            offset += items.length;
          }

          let transformStyle = "";
          let opacity = 0;
          let zIndex = 0;

          if (offset === 0) {
            transformStyle = "translateX(0%) rotateY(0deg) scale(1)";
            opacity = 1;
            zIndex = 10;
          } else if (offset === -1) {
            transformStyle = "translateX(-85%) rotateY(25deg) scale(0.85)";
            opacity = 0.8;
            zIndex = 5;
          } else if (offset === 1) {
            transformStyle = "translateX(85%) rotateY(-25deg) scale(0.85)";
            opacity = 0.8;
            zIndex = 5;
          } else if (offset < -1) {
            transformStyle = "translateX(-150%) rotateY(35deg) scale(0.7)";
            opacity = 0;
            zIndex = 1;
          } else if (offset > 1) {
            transformStyle = "translateX(150%) rotateY(-35deg) scale(0.7)";
            opacity = 0;
            zIndex = 1;
          }

          return (
            <div
              key={item.id}
              className="curved-card"
              onClick={() => setActiveIndex(index)}
              style={{ transform: transformStyle, opacity, zIndex }}
            >
              <img src={item.src} alt={item.title} className="card-image" />
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol diletakkan di luar container 3D */}
      <div className="carousel-controls">
        <button onClick={handlePrev}>&lt;</button>
        <button onClick={handleNext}>&gt;</button>
      </div>
    </div>
  );
}
