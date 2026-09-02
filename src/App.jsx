import { useState, useEffect, useRef } from "react";
import CursorRevealBg from "./components/CursorRevealBg";
import GalleryCarousel from "./components/GalleryCarousel";
import "@fontsource/plus-jakarta-sans"
import "@fontsource-variable/inter/wght.css"

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --divider: #262626;
    --background: #0a0a0a;
    --gray-light: #a1a1aa;
    --card-bg: #171717;
    --gray: #54545a;
    --primary-text: #f5f0ff;
    --text-muted: #71717a;
    --glass: rgba(255,255,255,0.06);
    --glass-border: #192126;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--background);
    color: var(--primary-text);
    overflow-x: hidden;
  }


  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--background); }
  ::-webkit-scrollbar-thumb { background: var(--divider); border-radius: 3px; }

  /* LAPISAN YANG TERBONGKAR SAAT KURSOR LEWAT */
  .revealed-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    /* Ubah tampilan background ini sesuai keinginanmu:
       Bisa warna gradasi terang, pattern grid, atau gambar */
    background: radial-gradient(
      circle at center,
      rgba(124, 58, 237, 0.4) 0%,
      rgba(59, 130, 246, 0.3) 90%,
      transparent 100%
    );
    background-image: linear-gradient(rgba(235,237,236,0.1) 2px, transparent 2px),
                      linear-gradient(90deg, rgba(235,237,236,0.1) 2px, transparent 2px);
    background-size: 60px 60px;
    mask-image: radial-gradient(
      200px circle at var(--x, -500px) var(--y, -500px),
      black 0%,
      transparent 100%
    );
    -webkit-mask-image: radial-gradient(
      200px circle at var(--x, -500px) var(--y, -500px),
      black 0%,
      transparent 100%
    );
    will-change: mask-image;
  }

  .main-content {
    position: relative;
    z-index: 2; /* Mengapung di atas layer background */
  }

  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
  }
  .bg-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #889283, transparent);
    top: -150px; right: -100px;
    animation: floatOrb 7s ease-in-out infinite;
  }
  .bg-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #f9f9f9, transparent);
    bottom: 20%; left: -100px;
    animation: floatOrb 10s ease-in-out infinite reverse;
  }
  @keyframes floatOrb {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(30px); }
  }

  .navbar {
    position: fixed;
    top: 16px; left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    width: 100%;
    padding: 0 16px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: width 0.7s ease, border-radius 0.7s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s ease,
    box-shadow 0.5s ease, backdrop-filter 0.5s ease;
    background: transparent;
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    box-shadow: 0 0 0 rgba(0,0,0,0.0);
  }
  .navbar.scrolled {
    background: var(--background);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    box-shadow: 0 4px 30px rgba(245,240,255,0.15);
    border-radius: 25px;
    width: 70%;
    margin: 0 auto;
  }

  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--gray-light);
    cursor: pointer;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: width 0.7s ease;
  }
  .navbar.scrolled .nav-logo {
    color: var(--primary-text);
  }
  .nav-logo span {
    background: linear-gradient(135deg, var(--primary-text), var(--gray-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .nav-logo-img {
    width: 24px;
    height: 24px;
  }
  .navbar.scrolled .nav-logo span {
    background: linear-gradient(135deg, var(--primary-text), #a3a9b0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: color 0.3s ease;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.6; }
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    list-style: none;
  }
  .nav-links li a {
    color: var(--primary-text);
    text-decoration: none;
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: color 0.3s ease;
    position: relative;
  }
  .navbar.scrolled .nav-links li a {
    color: var(--primary-text);
    transition: color 0.3s ease;
  }
  .nav-links li a::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: linear-gradient(90deg, var(--primary-text), var(--gray));
    transition: width 0.3s ease;
  }
  .nav-links li a:hover { color: var(--gray); }
  .nav-links li a:hover::after { width: 100%; }
  .nav-links li a.active { color: var(--gray-light); }
  .nav-links li a.active::after { width: 100%; }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 5px;
    background: none;
    border: none;
  }
  .hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--gray-light);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  .navbar.scrolled .hamburger span { background: var(--gray-light); }
  .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

  .mobile-menu {
    position: fixed;
    top: 70px; left: 0; right: 0;
    background: var(--background);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    padding: 1.5rem 5%;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    z-index: 99;
    transform: translateY(-130%);
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .mobile-menu.open {
    transform: translateY(5%);
    border-radius: 18px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  .mobile-menu a {
    color: var(--primary-text);
    text-decoration: none;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--glass-border);
    transition: color 0.3s;
  }
  .mobile-menu a:hover { color: var(--gray); }
  .mobile-menu .navbar.scrolled .nav-logo {
    overflow: hidden;
  }

  section {
    position: relative;
    z-index: 1;
  }

  #home {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 100px 8% 60px;
  }
  .hero-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  .hero-content { flex: 1; max-width: 600px; }

  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.2rem;
    animation: fadeInUp 0.8s 0.1s ease both;
  }
  .hero-title .line2 {
    display: block;
    background: linear-gradient(180deg, #fff 0%, #a1a1a1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }
  .hero-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    color: var(--gray-light);
    line-height: 1.7;
    margin-bottom: 2.5rem;
    max-width: 480px;
    animation: fadeInUp 0.8s 0.2s ease both;
  }
  .hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    animation: fadeInUp 0.8s 0.3s ease both;
  }
  .btn-primary {
    padding: 14px 32px;
    background: linear-gradient(135deg, var(--gray), var(--background));
    border: none;
    border-radius: 50px;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 30px rgba(244, 246, 249, 0.2);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(244, 246, 249, 0.4);
  }
  .btn-outline {
    padding: 14px 32px;
    background: transparent;
    border: 1px solid var(--gray);
    border-radius: 50px;
    color: var(--white-snow);
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
  }
  .btn-outline:hover {
    border-color: var(--white-snow);
    background: var(--background);
    transform: translateY(-2px);
  }

  .hero-visual {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 420px;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
  }
  .avatar-frame {
    position: absolute;
    width: 80%;
    height: 80%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    border-radius: 50%;
    filter: blur(45px);
    z-index: 1;
  }
  .avatar {
    position: relative;
    z-index: 2;
    width: 100%;
    height: auto;
    object-fit: contain;
    transform: scaleX(-1);
    filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.8));
    animation: floatProfile 6s ease-in-out infinite;
  }
  @keyframes floatProfile {
    0%, 100% { transform: translateY(0px) scaleX(-1); }
    50% { transform: translateY(-12px) scaleX(-1); }
  }

  .stat-card {
    background: rgba(26,5,51,0.9);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 10px 16px;
    backdrop-filter: blur(12px);
    font-size: 0.75rem;
    white-space: nowrap;
  }
  .stat-card strong {
    display: block;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.1rem;
    color: var(--gray-light);
  }
  .stat-card-left { right: calc(100% + 20px); top: 20%; }
  .stat-card-right { left: calc(100% + 20px); top: 55%; }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .section-label {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gray-light);
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::before {
    content: '';
    width: 30px; height: 1px;
    background: var(--gray-light);
    flex-shrink: 0;
  }
  .section-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 1rem;
  }
  .section-title .accent {
    background: linear-gradient(180deg, #fff 0%, #a1a1a1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  #about {
    padding: 100px 8%;
  }
  .about-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  .about-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .about-card {
    background: var(--card-bg);
    border: 1px solid var(--gray);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
  }
  .about-card:hover {
    transform: translateY(-4px);
    border-color: var(--primary-text);
    box-shadow: 0 0 30px rgba(245,240,255,0.2);
  }
  .about-card:nth-child(3) { grid-column: span 2; }
  .card-icon {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
  .card-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--primary-text);
    margin-bottom: 0.4rem;
  }
  .card-text {
    font-size: 0.9rem;
    color: var(--gray-light);
    line-height: 1.6;
  }
  .about-text p {
    color: var(--gray-light);
    line-height: 1.8;
    margin-bottom: 1.2rem;
    font-size: 1rem;
  }

  .section-divider {
    max-width: 1200px;
    margin: 0 auto;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gray), transparent);
  }

  #gallery {
    padding: 100px 8%;
  }
  .curved-carousel-wrapper {
    width: 100%;
    padding: 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* KUNCI PERSPEKTIF 3D */
  .curved-carousel-container {
    position: relative;
    width: 100%;
    max-width: 1000px;
    height: 360px; /* Tinggi kontainer carousel */
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1200px; /* ruang kedalaman 3D */
    transform-style: preserve-3d;
  }

  /* ELEMEN KARTU */
  .curved-card {
    position: absolute;
    width: 560px;
    height: 320px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    background-color: #1a1a1a;

    /* Transisi halus saat bergeser */
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
  }

  /* GAMBAR SERTIFIKAT */
  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Menyesuaikan gambar secara rapi ke dalam kartu */
    display: block;
  }

  /* TEKS OVERLAY DI ATAS GAMBAR */
  .card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
    color: #ffffff;
    z-index: 2;
  }

  .card-content h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .card-content p {
    margin: 4px 0 0 0;
    font-size: 0.85rem;
    opacity: 0.8;
  }

  /* TOMBOL NAVIGASI */
  .carousel-controls {
    margin-top: 30px;
    display: flex;
    gap: 16px;
    z-index: 20;
  }

  .carousel-controls button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #171717;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
  }

  .carousel-controls button:hover {
    background-color: #333333;
  }

  #skills {
    padding: 100px 8%;
  }
  .skills-inner {
    max-width: 1200px;
    margin: 0 auto;
  }
  .skills-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .skill-category {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }
  .skill-category:hover {
    border-color: var(--gray);
    box-shadow: 0 0 40px rgba(244, 246, 249, 0.08);
    transform: translateY(-4px);
  }
  .skill-cat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 1.5rem;
  }
  .skill-cat-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--divider), var(--background));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  .skill-cat-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .skill-item {
    margin-bottom: 1rem;
  }
  .skill-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .skill-name {
    font-size: 0.85rem;
    color: var(--primary-text);
    font-weight: 500;
  }
  .skill-percent {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    color: var(--gray-light);
  }
  .skill-bar {
    height: 4px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  .skill-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--divider), var(--text-muted), var(--primary-text));
    transition: width 1.5s cubic-bezier(0.23, 1, 0.32, 1);
    width: 0;
    box-shadow: 0 0 8px rgba(168,85,247,0.6);
  }
  .skill-fill.animated { width: var(--target-width); }

  #contact {
    padding: 100px 8% 80px;
  }
  .contact-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 4rem;
    align-items: start;
  }
  .contact-info p {
    color: var(--text-muted);
    line-height: 1.7;
    margin: 1rem 0 2rem;
  }
  .contact-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .contact-link {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
    padding: 12px 16px;
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    background: var(--glass);
    backdrop-filter: blur(8px);
  }
  .contact-link:hover { color: var(--primary-text); border-color: var(--gray-light); }
  .link-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: rgba(124,58,237,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .contact-works {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 2.5rem;
    backdrop-filter: blur(8px);
    margin-top: auto;
  }
  .contact-works-inner {
    display: grid;
    gap: 1rem;
  }
  .contact-works-inner h4 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--primary-text);
    margin-bottom: 1rem;
  }
  .work-steps {
    list-style: number;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--gray-light);
    margin-bottom: 8px;
  }
  .work-steps li {
    margin-bottom: 8px;
    line-height: 1.4;
    list-style-position: inside;
  }
  .contact-works:hover {
    box-shadow: 0 0 20px rgba(244, 246, 249, 0.29);
    transform: translateY(-2px);
    border: 1px solid var(--gray-light);
    transition: all 0.3s ease;
  }
  .work-steps li:hover {
    color: var(--primary-text);
  }

  footer {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 2rem;
    border-top: 1px solid var(--glass-border);
    color: var(--text-muted);
    font-size: 0.85rem;
  }
  footer span { color: var(--gray-light); }

  @media (max-width: 1024px) {
    .hero-inner { flex-direction: column; text-align: center; }
    .hero-subtitle, .hero-cta { margin-left: auto; margin-right: auto; }
    .hero-cta { justify-content: center; }
    .about-inner { grid-template-columns: 1fr; gap: 3rem; }
    .contact-inner { grid-template-columns: 1fr; }
    .stat-card-left, .stat-card-right { display: none; }
  }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .hero-inner { padding-top: 2rem; }
    .avatar-frame { width: 220px; height: 220px; }
    .curved-carousel-container { height: 260px; perspective: 700px; }
    .curved-card { height: 340px; width: 78vw; max-width: 310px; border-radius: 12px; }
    .card-content { padding: 12px 14px; }
    .card-content h3 { font-size: 1rem; }
    .card-content p { font-size: 0.75rem; }
    .card-controls { margin-top: 20px; gap: 12px; }
    .card-controls button { width: 38px; height: 38px; font-size: 1rem; }
    .form-row { grid-template-columns: 1fr; }
    .skills-header { flex-direction: column; align-items: flex-start; }
    .about-cards { grid-template-columns: 1fr; }
    .about-card:nth-child(3) { grid-column: span 1; }
  }

  @media (max-width: 480px) {
    #home, #about, #gallery, #skills, #contact { padding-left: 5%; padding-right: 5%; }
    .avatar-frame { width: 180px; height: 180px; }
    .curved-carousel-container { height: 230px; perspective: 550px; }
    .curved-card { height: 175px; width: 82vw; max-width: 270px; }
    .card-content { font-size: 1.8rem; }
    .contact-form { padding: 1.5rem; }
  }

  .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;

const skillCategories = [
  {
    icon: "⚡", name: "Frontend",
    skills: [
      { name: "React / Next.js", level: 32 },
      { name: "TypeScript", level: 5 },
      { name: "CSS / Tailwind", level: 70 },
    ]
  },
  {
    icon: "🛠", name: "Backend",
    skills: [
      { name: "Node.js", level: 20 },
      { name: "Python / Django", level: 65 },
      { name: "REST / GraphQL", level: 0 },
    ]
  },
  {
    icon: "🎨", name: "Design",
    skills: [
      { name: "Figma", level: 10 },
      { name: "UI/UX Principles", level: 25 },
      { name: "Motion Design", level: 0 },
    ]
  },
];

const navItems = ["Home", "About", "Skills", "Gallery", "Contact"];

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navItems.map(n => n.toLowerCase());
      for (const sec of sections.reverse()) {
        const el = document.getElementById(sec);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sec); break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (entry.target === skillsRef.current) setSkillsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
    if (skillsRef.current) observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <CursorRevealBg />
      <style>{style}</style>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <img src="/Logo.svg" alt="Logo" className="nav-logo-img" />
          <span>Ahmad</span>Dev
        </div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className={activeSection === item.toLowerCase() ? "active" : ""}
                onClick={e => { e.preventDefault(); scrollTo(item.toLowerCase()); }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navItems.map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={e => { e.preventDefault(); scrollTo(item.toLowerCase()); }}
          >
            {item}
          </a>
        ))}
      </div>

      <section id="home">
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              Hi I'm<br />
              <span className="line2">Ahmad Wildan</span><br />
              Developer
            </h1>
            <p className="hero-subtitle">
              Saya adalah calon software engineer yang bersemangat untuk menciptakan solusi digital yang bermakna.
            </p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => scrollTo("contact")}>
                Get in Touch
              </button>
              <button className="btn-outline" onClick={() => scrollTo("skills")}>
                View Skills
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="avatar-frame" />
            <img src="/Image/Ahmad.png" alt="avatar" className="avatar" />
          </div>
        </div>
      </section>

      <section id="about">
        <div className="section-divider" />
        <div className="about-inner fade-in" style={{ paddingTop: "4rem" }}>
          <div>
            <p className="section-label">About Me</p>
            <h2 className="section-title">
              Passionate about <span className="accent">beautiful</span> software
            </h2>
            <div className="about-text">
              <p>
                Saya bermimpi menjadi Software Engineer. Saya percaya bahwa perangkat lunak yang hebat adalah perangkat lunak yang baik secara teknis dan menarik secara visual.
              </p>
              <p>
                Ketika saya tidak sedang coding, saya sering mengeksplor teknologi baru, membaca artikel teknologi, atau menulis blog tentang pengalaman dan pengetahuan saya.
              </p>
            </div>
          </div>
          <div className="about-cards">
            <div className="about-card">
              <div className="card-icon">🌍</div>
              <div className="card-title">Location</div>
              <p className="card-text">Tinggal Malang, Indonesia. Bersedia untuk bekerja remote.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">🎓</div>
              <div className="card-title">Education</div>
              <p className="card-text">Mahasiswa Teknik Informatika di STT STIKMA Malang.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">🎯</div>
              <div className="card-title">Mission</div>
              <p className="card-text">Terus memperbaiki diri dan menciptakan solusi digital yang bermakna.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="section-divider" />
        <div className="skills-inner">
          <div ref={skillsRef} className="skills-header fade-in" style={{ paddingTop: "2rem" }}>
            <div>
              <p className="section-label">Expertise</p>
              <h2 className="section-title">
                My <span className="accent">Skills</span>
              </h2>
            </div>
          </div>
          <div className="skills-grid">
            {skillCategories.map((cat, ci) => (
              <div className="skill-category fade-in" key={ci}>
                <div className="skill-cat-header">
                  <div className="skill-cat-icon">{cat.icon}</div>
                  <div className="skill-cat-name">{cat.name}</div>
                </div>
                {cat.skills.map((skill, si) => (
                  <div className="skill-item" key={si}>
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className={`skill-fill ${skillsVisible ? "animated" : ""}`}
                        style={{
                          "--target-width": `${skill.level}%`,
                          transitionDelay: `${ci * 0.1 + si * 0.15}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery">
        <div className="section-divider" />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 8% 0" }}>
          <div className="fade-in">
            <p className="section-label">Portfolio</p>
            <h2 className="section-title">
              <span className="accent">Gallery</span>
            </h2>
          </div>
        </div>
        <GalleryCarousel />
      </section>

      <section id="contact">
        <div className="section-divider" />
        <div className="contact-inner" style={{ paddingTop: "2rem" }}>
          <div className="fade-in">
            <p className="section-label">Let's Talk</p>
            <h2 className="section-title">
              Get in <span className="accent">Touch</span>
            </h2>
            <p style={{ color: "var(--gray-light)", lineHeight: 1.7, margin: "1rem 0 2rem", fontSize: "0.95rem" }}>
              Silahkan hubungi saya jika anda ingin berkolaborasi atau memiliki proyek.
            </p>
            <div className="contact-links">
              {[
                { icon: "📧", label: "ahmadwildansyaroni@gmail.com", href: "mailto:ahmadwildansyaroni@gmail.com" },
                { icon: "💼", label: "linkedin.com/in/Wildan Syaroni", href: "https://www.linkedin.com/in/wildan-syaroni-6a8b55266/" },
                { icon: "📷", label: "instagram.com/_ahmadwil", href: "https://www.instagram.com/_ahmadwil/" },
                { icon: "🐙", label: "github.com/Ahmad-Archive", href: "https://github.com/Ahmad-Archive" },
              ].map((link, i) => (
                <a key={i} href={link.href} className="contact-link">
                  <div className="link-icon">{link.icon}</div>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="contact-works">
            <div className="contact-works-inner">
              <h4>How I Work</h4>
              <ul className="work-steps">
                <li><strong>Discovery:</strong> Diskusi kebutuhan proyek dan tujuan bisnis.</li>
                <li><strong>Architecture:</strong> Penyusunan struktur kode dan antarmuka UI.</li>
                <li><strong>Development:</strong> Pengodingan dengan standar bersih dan teruji.</li>
                <li><strong>Delivery:</strong> Peluncuran aplikasi dan optimasi performa.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 Portfolio. Made with <span>Ahmad Wildan</span>.</p>
      </footer>
    </>
  );
}
