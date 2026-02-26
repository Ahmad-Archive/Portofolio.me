import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --purple-deep: #1a0533;
    --purple-mid: #3b0764;
    --purple-core: #7c3aed;
    --purple-bright: #a855f7;
    --purple-light: #d8b4fe;
    --purple-glow: #c084fc;
    --white: #ffffff;
    --white-soft: #f5f0ff;
    --text-muted: #c4b5d4;
    --glass: rgba(255,255,255,0.06);
    --glass-border: rgba(168,85,247,0.25);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--purple-deep);
    color: var(--white);
    overflow-x: hidden;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--purple-deep); }
  ::-webkit-scrollbar-thumb { background: var(--purple-core); border-radius: 3px; }

  /* BACKGROUND GRID */
  .bg-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(124,58,237,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
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
    background: radial-gradient(circle, #7c3aed, transparent);
    top: -150px; right: -100px;
    animation: floatOrb 8s ease-in-out infinite;
  }
  .bg-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #a855f7, transparent);
    bottom: 20%; left: -100px;
    animation: floatOrb 10s ease-in-out infinite reverse;
  }
  @keyframes floatOrb {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(30px); }
  }

  .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 0 5%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.4s ease;
  }
  .navbar.scrolled {
    background: rgba(26, 5, 51, 0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    box-shadow: 0 4px 30px rgba(124,58,237,0.15);
  }

  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--white);
    cursor: pointer;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .nav-logo span {
    background: linear-gradient(135deg, var(--purple-core), var(--purple-bright));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .logo-dot {
    width: 8px; height: 8px;
    background: var(--purple-bright);
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s infinite;
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
    color: var(--text-muted);
    text-decoration: none;
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    transition: color 0.3s ease;
    position: relative;
  }
  .nav-links li a::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: linear-gradient(90deg, var(--purple-core), var(--purple-bright));
    transition: width 0.3s ease;
  }
  .nav-links li a:hover { color: var(--white); }
  .nav-links li a:hover::after { width: 100%; }
  .nav-links li a.active { color: var(--purple-light); }
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
    background: var(--white);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

  .mobile-menu {
    position: fixed;
    top: 70px; left: 0; right: 0;
    background: rgba(26,5,51,0.97);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--glass-border);
    padding: 1.5rem 5%;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    z-index: 99;
    transform: translateY(-120%);
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .mobile-menu.open { transform: translateY(0); }
  .mobile-menu a {
    color: var(--text-muted);
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
  .mobile-menu a:hover { color: var(--purple-light); }

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
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 50px;
    padding: 6px 16px;
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--purple-light);
    margin-bottom: 1.5rem;
    animation: fadeInUp 0.8s ease both;
  }
  .badge-dot {
    width: 6px; height: 6px;
    background: var(--purple-bright);
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

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
    background: linear-gradient(135deg, var(--purple-core), var(--purple-bright), var(--purple-glow));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .hero-subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
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
    background: linear-gradient(135deg, var(--purple-core), var(--purple-bright));
    border: none;
    border-radius: 50px;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 30px rgba(124,58,237,0.4);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 50px rgba(124,58,237,0.6);
  }
  .btn-outline {
    padding: 14px 32px;
    background: transparent;
    border: 1px solid var(--glass-border);
    border-radius: 50px;
    color: var(--purple-light);
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
  }
  .btn-outline:hover {
    border-color: var(--purple-core);
    background: rgba(124,58,237,0.1);
    transform: translateY(-2px);
  }

  .hero-visual {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeInRight 1s 0.4s ease both;
  }
  .avatar-frame {
    position: relative;
    width: 320px; height: 320px;
  }
  .avatar-ring {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    border: 1px solid transparent;
    background: linear-gradient(135deg, var(--purple-core), transparent 60%) border-box;
    animation: spinRing 6s linear infinite;
  }
  .avatar-ring-2 {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 1px dashed rgba(168,85,247,0.3);
    animation: spinRing 10s linear infinite reverse;
  }
  @keyframes spinRing {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .avatar-inner {
    width: 100%; height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--purple-mid), var(--purple-core));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 5rem;
    font-weight: 700;
    box-shadow: 0 0 60px rgba(124,58,237,0.5), inset 0 0 40px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
  }
  .avatar-inner::before {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: conic-gradient(transparent, rgba(168,85,247,0.1), transparent 30%);
    animation: spinRing 4s linear infinite;
  }
  .avatar-stats {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 8px;
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
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    color: var(--purple-light);
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
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--purple-bright);
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::before {
    content: '';
    width: 30px; height: 1px;
    background: var(--purple-core);
    flex-shrink: 0;
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 1rem;
  }
  .section-title .accent {
    background: linear-gradient(135deg, var(--purple-core), var(--purple-bright));
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
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
  }
  .about-card:hover {
    transform: translateY(-4px);
    border-color: var(--purple-core);
    box-shadow: 0 0 30px rgba(124,58,237,0.2);
  }
  .about-card:first-child { grid-column: span 2; }
  .card-icon {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--purple-light);
    margin-bottom: 0.4rem;
  }
  .card-text {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.6;
  }
  .about-text p {
    color: var(--text-muted);
    line-height: 1.8;
    margin-bottom: 1.2rem;
    font-size: 1rem;
  }

  .section-divider {
    max-width: 1200px;
    margin: 0 auto;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--glass-border), transparent);
  }

  #image {
    padding: 100px 8%;
  }
  .slider-container {
    max-width: 800px;
    margin: 3rem auto 0;
    position: relative;
  }
  .slider-track-wrapper {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
  }
  .slider-track {
    display: flex;
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .slide {
    min-width: 100%;
    height: 500px;
    position: relative;
    overflow: hidden;
  }
  .slide-bg {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .slide-1 .slide-bg {
    background: linear-gradient(135deg, #1a0533 0%, #3b0764 50%, #7c3aed 100%);
  }
  .slide-2 .slide-bg {
    background: linear-gradient(135deg, #0f0527 0%, #4c1d95 40%, #6d28d9 100%);
  }
  .slide-3 .slide-bg {
    background: linear-gradient(135deg, #1e0245 0%, #7e22ce 50%, #a855f7 100%);
  }
  .slide-4 .slide-bg {
    background: linear-gradient(135deg, #120230 0%, #5b21b6 50%, #8b5cf6 100%);
  }
  .slide-5 .slide-bg {
    background: linear-gradient(135deg, #160338 0%, #4a044e 50%, #9333ea 100%);
  }

  .slide-geometric {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .geo-circle {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .slide-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
  }
  .slide-emoji { font-size: 4rem; margin-bottom: 1rem; }
  .slide-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }
  .slide-desc {
    font-size: 1rem;
    color: var(--purple-light);
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .slide-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(26,5,51,0.7) 0%, transparent 50%);
    z-index: 1;
  }

  .slider-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .slider-btn {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
  }
  .slider-btn:hover {
    background: var(--purple-core);
    border-color: var(--purple-core);
    box-shadow: 0 0 20px rgba(124,58,237,0.4);
  }
  .slider-dots {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
  }
  .dot.active {
    width: 24px;
    border-radius: 4px;
    background: var(--purple-bright);
  }
  .slide-counter {
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    color: var(--text-muted);
    letter-spacing: 2px;
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
    border-color: var(--purple-core);
    box-shadow: 0 0 40px rgba(124,58,237,0.15);
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
    background: linear-gradient(135deg, var(--purple-core), var(--purple-bright));
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
    color: var(--text-muted);
    font-weight: 500;
  }
  .skill-percent {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    color: var(--purple-light);
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
    background: linear-gradient(90deg, var(--purple-core), var(--purple-bright));
    transition: width 1.5s cubic-bezier(0.23, 1, 0.32, 1);
    width: 0;
    box-shadow: 0 0 8px rgba(168,85,247,0.6);
  }
  .skill-fill.animated { width: var(--target-width); }

  .upload-zone {
    border: 2px dashed var(--glass-border);
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--glass);
    backdrop-filter: blur(8px);
    position: relative;
  }
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--purple-core);
    background: rgba(124,58,237,0.08);
    box-shadow: 0 0 30px rgba(124,58,237,0.15);
  }
  .upload-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  .upload-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--purple-light);
    margin-bottom: 0.4rem;
  }
  .upload-hint {
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  .upload-hint span {
    color: var(--purple-bright);
    font-weight: 600;
  }
  .upload-formats {
    margin-top: 0.8rem;
    font-size: 0.75rem;
    color: rgba(196,181,212,0.5);
    letter-spacing: 1px;
    font-family: 'Syne', sans-serif;
    text-transform: uppercase;
  }

  .gallery-thumbs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 1.5rem;
    justify-content: center;
  }
  .thumb-item {
    position: relative;
    width: 72px;
    height: 72px;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.25s ease;
    flex-shrink: 0;
  }
  .thumb-item.active {
    border-color: var(--purple-bright);
    box-shadow: 0 0 14px rgba(168,85,247,0.5);
  }
  .thumb-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .thumb-delete {
    position: absolute;
    top: 3px; right: 3px;
    width: 20px; height: 20px;
    background: rgba(0,0,0,0.75);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 0.65rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    line-height: 1;
  }
  .thumb-item:hover .thumb-delete { opacity: 1; }

  .slide-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .slide-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(26,5,51,0.75) 0%, rgba(26,5,51,0.1) 60%, transparent 100%);
    z-index: 1;
  }
  .slide-img-caption {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    text-align: center;
    width: 90%;
  }
  .slide-img-caption h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 700;
    text-shadow: 0 2px 12px rgba(0,0,0,0.4);
    margin-bottom: 0.3rem;
  }
  .slide-img-caption p {
    font-size: 0.9rem;
    color: var(--purple-light);
  }

  .caption-edit-bar {
    display: flex;
    gap: 0.8rem;
    margin-top: 1.2rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .caption-input {
    flex: 1;
    min-width: 180px;
    padding: 10px 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    outline: none;
    transition: border-color 0.3s;
  }
  .caption-input:focus { border-color: var(--purple-core); }
  .caption-input::placeholder { color: rgba(196,181,212,0.35); }
  .caption-save-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, var(--purple-core), var(--purple-bright));
    border: none;
    border-radius: 10px;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  .caption-save-btn:hover { opacity: 0.85; transform: translateY(-1px); }

  .empty-slide {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--purple-deep), var(--purple-mid));
    gap: 1rem;
    color: var(--text-muted);
    font-size: 1rem;
  }
  .empty-slide-icon { font-size: 3.5rem; opacity: 0.5; }

  .upload-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(124,58,237,0.2);
    border: 1px solid rgba(124,58,237,0.3);
    border-radius: 50px;
    padding: 4px 12px;
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    color: var(--purple-light);
    letter-spacing: 1px;
    margin-left: auto;
  }

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
    transition: color 0.3s;
    padding: 12px 16px;
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    background: var(--glass);
    backdrop-filter: blur(8px);
  }
  .contact-link:hover { color: var(--purple-light); border-color: var(--purple-core); }
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

  .contact-form {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 2.5rem;
    backdrop-filter: blur(8px);
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--purple-light);
    margin-bottom: 8px;
  }
  .form-control {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.3s ease;
    resize: none;
  }
  .form-control:focus { border-color: var(--purple-core); box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
  .form-control::placeholder { color: rgba(196,181,212,0.4); }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, var(--purple-core), var(--purple-bright));
    border: none;
    border-radius: 12px;
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(124,58,237,0.3);
    margin-top: 0.5rem;
  }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(124,58,237,0.5); }

  footer {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 2rem;
    border-top: 1px solid var(--glass-border);
    color: var(--text-muted);
    font-size: 0.85rem;
  }
  footer span { color: var(--purple-bright); }

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
    .slide { height: 380px; }
    .form-row { grid-template-columns: 1fr; }
    .skills-header { flex-direction: column; align-items: flex-start; }
    .about-cards { grid-template-columns: 1fr; }
    .about-card:first-child { grid-column: span 1; }
  }

  @media (max-width: 480px) {
    #home, #about, #image, #skills, #contact { padding-left: 5%; padding-right: 5%; }
    .avatar-frame { width: 180px; height: 180px; }
    .slide { height: 300px; }
    .slide-title { font-size: 1.8rem; }
    .contact-form { padding: 1.5rem; }
  }

  .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;

const slides = [
  { id: 1, src: "/public/Image/CCSE.jpg", title: "CCSE", desc: "Certificate CCSE" },
  { id: 2, src: "/public/Image/DicodingDev.jpg", title: "Dicoding", desc: "Certificate Dicoding Developer" },
  { id: 3, src: "/public/Image/HTML.jpg", title: "HTML", desc: "Certificate HTML" },
  { id: 4, src: "/public/Image/Python-Algorithm.png", title: "Algorithm with Python", desc: "Certificate Python Algorithm" },
  { id: 5, src: "/Image/Python-Lanjutan.jpg", title: "Python Lanjutan", desc: "Certificate Python Lanjutan" },
];

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

const navItems = ["Home", "About", "Image", "Skills", "Contact"];

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const skillsRef = useRef(null);
  const autoplayRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
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

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setSlideIndex(i => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(autoplayRef.current);
  }, []);

  const goSlide = (dir) => {
    clearInterval(autoplayRef.current);
    setSlideIndex(i => (i + dir + slides.length) % slides.length);
    autoplayRef.current = setInterval(() => {
      setSlideIndex(i => (i + 1) % slides.length);
    }, 4000);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{style}</style>
      <div className="bg-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <span>Port</span>folio<div className="logo-dot" />
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
            <div className="hero-badge">
              <div className="badge-dot" />
              Available for Work
            </div>
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
                Let's Collaborate
              </button>
              <button className="btn-outline" onClick={() => scrollTo("skills")}>
                View Skills
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="avatar-frame">
              <div className="avatar-ring" />
              <div className="avatar-ring-2" />
              <div className="avatar-inner">✦</div>
              <div className="avatar-stats">
                <div className="stat-card stat-card-left">
                  <strong>Coming Soon</strong>
                  Projects Done
                </div>
                <div className="stat-card stat-card-right">
                  <strong>Coming Soon</strong>
                  Client Rating
                </div>
              </div>
            </div>
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
              <div className="card-icon">🎯</div>
              <div className="card-title">Mission</div>
              <p className="card-text">Terus memperbaiki diri dan menciptakan solusi digital yang bermakna.</p>
            </div>
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
          </div>
        </div>
      </section>

      <section id="image">
        <div className="section-divider" />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 8% 0" }}>
          <div className="fade-in">
            <p className="section-label">Portfolio</p>
            <h2 className="section-title">
              Work <span className="accent">Gallery</span>
            </h2>
          </div>
        </div>
        <div className="slider-container fade-in">
          {/* SLIDE UTAMA */}
          <div className="slider-track-wrapper">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="slide">
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img
                      src={slide.src}
                      alt={slide.title}
                      className="slide-img"
                    />
                    <div className="slide-img-overlay" />
                    <div className="slide-img-caption">
                      <h3>{slide.title}</h3>
                      {slide.desc && <p>{slide.desc}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="slider-controls">
            <button className="slider-btn" onClick={() => goSlide(-1)}>←</button>
            <div className="slider-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === slideIndex ? "active" : ""}`}
                  onClick={() => { clearInterval(autoplayRef.current); setSlideIndex(i); }}
                />
              ))}
            </div>
            <button className="slider-btn" onClick={() => goSlide(1)}>→</button>
          </div>
          <div className="slide-counter" style={{ textAlign: "center", marginTop: "0.8rem" }}>
            {String(slideIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>

          <div className="gallery-thumbs">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className={`thumb-item ${i === slideIndex ? "active" : ""}`}
                onClick={() => { clearInterval(autoplayRef.current); setSlideIndex(i); }}
              >
                <img src={slide.src} alt={slide.title} />
              </div>
            ))}
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

      <section id="contact">
        <div className="section-divider" />
        <div className="contact-inner" style={{ paddingTop: "2rem" }}>
          <div className="fade-in">
            <p className="section-label">Let's Talk</p>
            <h2 className="section-title">
              Get in <span className="accent">Touch</span>
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: "1rem 0 2rem", fontSize: "0.95rem" }}>
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

          <div className="contact-form fade-in">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" className="form-control" placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" className="form-control" placeholder="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" placeholder="example@gmail.com" />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" className="form-control" placeholder="Project Inquiry" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-control" rows="5" placeholder="Ceritakan tentang proyek yang ingin Anda kembangkan..." />
            </div>
            <button className="submit-btn" onClick={() => window.location.href='mailto:ahmadwildansyaroni@gmail.com'}>Send Message →</button>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 Portfolio. Made with <span>♥</span> and <span>purple magic</span>.</p>
      </footer>
    </>
  );
}