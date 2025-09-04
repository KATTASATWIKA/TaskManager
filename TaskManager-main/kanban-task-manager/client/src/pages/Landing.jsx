import React, { useState, useEffect } from 'react';

function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const styles = `
    * {
      box-sizing: border-box;
    }

    :root {
      --color-white: #fff;
      --color-black: #000;
      --color-lightGray: #f9f9f9;
      --color-dark: #22322F;
      --color-darkGray: #333333;
      --color-primary: #3B82F6;
      --header-height: 7.5rem;
    }

    .landing-page {
      margin: 0;
      padding: 0;
      background-color: var(--color-lightGray);
      font-family: 'Lato', Arial, sans-serif;
      font-size: 1.125rem;
      overflow-x: hidden;
    }

    .landing-page.body--noscroll {
      overflow: hidden;
    }

    .landing-page a {
      display: inline-block;
      text-decoration: none;
      color: var(--color-dark);
    }

    .container {
      max-width: 1200px;
      margin: auto;
    }

    .container-pall {
      padding: 1.875rem 1.5625rem;
    }

    .flex {
      display: flex;
    }

    .flex-jc-sp {
      justify-content: space-between;
    }

    .flex-jc-c {
      justify-content: center;
    }

    .flex-ai-c {
      align-items: center;
    }

    @media (min-width: 48rem) {
      .hide-for-desktop {
        display: none;
      }
    }

    @media (max-width: 47.9375rem) {
      .hide-for-mobile {
        display: none;
      }
    }

    .header {
      height: var(--header-height);
      position: relative;
      z-index: 1001;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideDown 0.8s ease-out;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .nav {
      height: 100%;
      flex-wrap: wrap;
    }

    @media (max-width: 18.75rem) {
      .nav {
        justify-content: center;
      }
    }

    .header__logo {
      font-size: 1.875rem;
      font-weight: 700;
      animation: logoGlow 2s ease-in-out infinite alternate;
      transition: transform 0.3s ease;
    }

    .header__logo:hover {
      transform: scale(1.05);
    }

    @keyframes logoGlow {
      from {
        text-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
      }
      to {
        text-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
      }
    }

    .toggle-menu {
      position: relative;
      z-index: 1000;
      min-width: 8.125rem;
      min-height: 3.125rem;
      justify-content: space-between;
      align-items: center;
      border: 2px solid var(--color-dark);
      border-radius: 10px;
      box-shadow: 2px 2px 0 var(--color-dark);
      padding: 0 1.5625rem;
      cursor: pointer;
      transition: all 300ms ease-in-out;
      animation: bounceIn 0.6s ease-out 0.3s both;
    }

    @keyframes bounceIn {
      0% {
        transform: scale(0.3);
        opacity: 0;
      }
      50% {
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .header--active .toggle-menu {
      background-color: var(--color-white);
      box-shadow: none;
    }

    .toggle-menu:hover {
      opacity: 0.7;
      transform: translateY(-2px);
    }

    .toggle-menu__dots {
      width: 1.375rem;
      height: 0.9375rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 5px 0px;
      transition: all 300ms ease-in-out;
    }

    .header--active .toggle-menu__dots {
      transform: scale(0.9) rotate(45deg);
    }

    .toggle-menu__dot {
      width: 5px;
      height: 5px;
      display: inline-block;
      background-color: var(--color-dark);
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .toggle-menu__dot:nth-child(1) { animation-delay: 0s; }
    .toggle-menu__dot:nth-child(2) { animation-delay: 0.1s; }
    .toggle-menu__dot:nth-child(3) { animation-delay: 0.2s; }
    .toggle-menu__dot:nth-child(4) { animation-delay: 0.3s; }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.3);
        opacity: 0.7;
      }
    }

    .toggle-menu__text {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .menu {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 999;
      transform: translateX(-50%);
      width: 100vw;
      height: 100vh;
      background-color: var(--color-white);
      background-image: radial-gradient(circle, rgb(255 255 255) 40%, rgb(208 208 208) 100%);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0;
      margin: 0;
      visibility: hidden;
      opacity: 0;
      transition: all 500ms ease-in-out;
    }

    @media (min-width: 48rem) {
      .menu {
        position: static;
        transform: translateX(0);
        visibility: visible;
        opacity: 1;
        width: auto;
        height: auto;
        background-color: transparent;
        background-image: none;
        flex-direction: row;
        justify-content: flex-start;
        align-items: stretch;
      }
    }

    .header--active .menu {
      transform: translateX(0);
      visibility: visible;
      opacity: 1;
    }

    .menu__item {
      list-style-type: none;
      animation: fadeInUp 0.6s ease-out both;
    }

    .menu__item:nth-child(1) { animation-delay: 0.1s; }
    .menu__item:nth-child(2) { animation-delay: 0.2s; }
    .menu__item:nth-child(3) { animation-delay: 0.3s; }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .menu__item:not(:last-child) {
      margin-bottom: 1.875rem;
    }

    @media (min-width: 48rem) {
      .menu__item:not(:last-child) {
        margin-bottom: 0px;
        margin-right: 2.5rem;
      }
    }

    .menu__link {
      font-size: 1.25rem;
      font-weight: 400;
      transition: all 200ms ease-in-out;
      position: relative;
    }

    .menu__link::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -5px;
      left: 50%;
      background-color: var(--color-primary);
      transition: all 300ms ease-in-out;
      transform: translateX(-50%);
    }

    .menu__link:hover::after {
      width: 100%;
    }

    .menu__link:hover {
      color: var(--color-primary);
      transform: translateY(-2px);
    }

    .menu__link--primary {
      font-weight: bold;
      color: var(--color-primary);
    }

    .menu__link--primary:hover {
      color: var(--color-dark);
    }

    .hero {
      min-height: calc(100vh - var(--header-height));
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      opacity: ${isLoaded ? '1' : '0'};
      transform: ${isLoaded ? 'translateY(0)' : 'translateY(50px)'};
      transition: all 1s ease-out 0.2s;
    }

    @media (max-width: 18.75rem) {
      .hero {
        text-align: center;
      }
    }

    @media (min-width: 48rem) {
      .hero {
        flex-direction: row-reverse;
        justify-content: space-between;
      }
    }

    .hero__image {
      animation: floatIn 1.2s ease-out 0.5s both;
    }

    @keyframes floatIn {
      0% {
        opacity: 0;
        transform: translateX(50px) rotateY(20deg);
      }
      100% {
        opacity: 1;
        transform: translateX(0) rotateY(0deg);
      }
    }

    .hero__illustration-image {
      width: min(19.25rem, 100%);
      height: min(18.8125rem, 100%);
    }

    @media (min-width: 48rem) {
      .hero__illustration-image {
        width: 23.125rem;
        height: auto;
        margin-left: 3.125rem;
      }
    }

    @media (min-width: 64rem) {
      .hero__illustration-image {
        width: 31.25rem;
      }
    }

    .hero__text {
      animation: slideInLeft 1s ease-out 0.3s both;
    }

    @keyframes slideInLeft {
      0% {
        opacity: 0;
        transform: translateX(-50px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (min-width: 64rem) {
      .hero__text {
        width: 31.25rem;
      }
    }

    .hero__heading {
      font-size: 1.875rem;
      font-weight: 400;
      line-height: 1.6;
      background: linear-gradient(135deg, var(--color-dark), var(--color-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: textShimmer 3s ease-in-out infinite;
    }

    @keyframes textShimmer {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }

    @media (min-width: 64rem) {
      .hero__heading {
        font-size: 2.6rem;
        font-weight: 700;
      }
    }

    .hero__description {
      font-size: 1.1875rem;
      line-height: 1.7;
      animation: fadeIn 1s ease-out 0.8s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .hero__cta {
      color: var(--color-dark);
      border: 2px solid var(--color-dark);
      border-radius: 10px;
      padding: 0.9375rem 1.875rem;
      font-size: 1.125rem;
      font-weight: bold;
      text-align: center;
      transition: all 300ms ease-in-out;
      margin-right: 0.75rem;
      margin-bottom: 0.75rem;
      position: relative;
      overflow: hidden;
      transform: translateY(20px);
      opacity: 0;
      animation: slideUp 0.6s ease-out 1.2s both;
    }

    @keyframes slideUp {
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .hero__cta::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.5s;
    }

    .hero__cta:hover::before {
      left: 100%;
    }

    .hero__cta--primary {
      background-color: var(--color-primary);
      color: var(--color-white);
      box-shadow: 2px 2px 0 var(--color-dark);
      animation-delay: 1s;
    }

    .hero__cta--primary:hover,
    .hero__cta--primary:focus {
      background-color: var(--color-white);
      color: var(--color-dark);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
      transform: translateY(-3px);
    }

    .hero__cta--secondary {
      background-color: var(--color-white);
      color: var(--color-dark);
      box-shadow: 2px 2px 0 var(--color-dark);
      animation-delay: 1.3s;
    }

    .hero__cta--secondary:hover,
    .hero__cta--secondary:focus {
      background-color: var(--color-dark);
      color: var(--color-white);
      box-shadow: 0 10px 25px rgba(34, 50, 47, 0.3);
      transform: translateY(-3px);
    }

    .hero__cta-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    @media (min-width: 48rem) {
      .hero__cta-container {
        justify-content: flex-start;
      }
    }

    .hero-kanban-board {
      width: min(32rem, 100%);
      height: min(26rem, 100%);
      background-color: #f8f9fa;
      border: 3px solid var(--color-dark);
      border-radius: 8px;
      padding: 1.5rem;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      animation: boardFloat 6s ease-in-out infinite;
      position: relative;
      overflow: hidden;
    }

    .hero-kanban-board::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent);
      animation: shimmer 8s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes boardFloat {
      0%, 100% {
        transform: translateY(0px) rotateX(0deg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      50% {
        transform: translateY(-10px) rotateX(2deg);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      }
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
      }
      100% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
      }
    }

    @media (min-width: 48rem) {
      .hero-kanban-board {
        width: 38rem;
        height: 30rem;
        margin-left: 3.125rem;
        margin-right: -70px;
        padding: 2rem;
        gap: 1.25rem;
      }
    }

    @media (min-width: 64rem) {
      .hero-kanban-board {
        width: 48rem;
        height: 36rem;
        padding: 2.5rem;
        gap: 1.5rem;
        margin-right: -70px;
      }
    }

    .kanban-column {
      background-color: white;
      border: 2px solid var(--color-dark);
      border-radius: 4px;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-height: 320px;
      animation: columnSlide 0.8s ease-out both;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .kanban-column:nth-child(1) { animation-delay: 0.2s; }
    .kanban-column:nth-child(2) { animation-delay: 0.4s; }
    .kanban-column:nth-child(3) { animation-delay: 0.6s; }
    .kanban-column:nth-child(4) { animation-delay: 0.8s; }

    @keyframes columnSlide {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .kanban-column:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    @media (min-width: 48rem) {
      .kanban-column {
        padding: 1rem;
        gap: 1rem;
        min-height: 380px;
      }
    }

    @media (min-width: 64rem) {
      .kanban-column {
        padding: 1.25rem;
        gap: 1.25rem;
        min-height: 440px;
      }
    }

    .kanban-header {
      font-size: 0.7rem;
      font-weight: bold;
      text-align: center;
      color: var(--color-dark);
      padding: 0.25rem;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 0.25rem;
      animation: headerGlow 2s ease-in-out infinite alternate;
    }

    @keyframes headerGlow {
      from {
        text-shadow: none;
      }
      to {
        text-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      }
    }

    @media (min-width: 48rem) {
      .kanban-header {
        font-size: 0.8rem;
        padding: 0.4rem;
        margin-bottom: 0.4rem;
      }
    }

    @media (min-width: 64rem) {
      .kanban-header {
        font-size: 1rem;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
      }
    }

    .kanban-card {
      background-color: #f8f9fa;
      border: 1px solid var(--color-dark);
      border-radius: 3px;
      padding: 0.4rem;
      min-height: 2rem;
      display: flex;
      align-items: center;
      animation: cardPop 0.6s ease-out both;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .kanban-card:nth-child(2) { animation-delay: 1s; }
    .kanban-card:nth-child(3) { animation-delay: 1.2s; }
    .kanban-card:nth-child(4) { animation-delay: 1.4s; }

    @keyframes cardPop {
      0% {
        opacity: 0;
        transform: scale(0.5) rotate(10deg);
      }
      50% {
        transform: scale(1.1) rotate(-5deg);
      }
      100% {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }

    .kanban-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
      transition: left 0.5s;
    }

    .kanban-card:hover {
      transform: translateX(3px) scale(1.03);
      box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.1);
    }

    .kanban-card:hover::before {
      left: 100%;
    }

    @media (min-width: 48rem) {
      .kanban-card {
        padding: 0.6rem;
        min-height: 2.5rem;
      }
    }

    @media (min-width: 64rem) {
      .kanban-card {
        padding: 0.75rem;
        min-height: 3rem;
      }
    }

    .kanban-card-line {
      width: 60%;
      height: 2px;
      background-color: var(--color-dark);
      border-radius: 1px;
      animation: lineGrow 1s ease-out both;
      position: relative;
      overflow: hidden;
    }

    .kanban-card-line::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
      animation: lineShimmer 2s ease-in-out infinite;
    }

    @keyframes lineGrow {
      from {
        width: 0%;
      }
      to {
        width: 60%;
      }
    }

    @keyframes lineShimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }

    @media (min-width: 48rem) {
      .kanban-card-line {
        height: 3px;
      }
    }

    .kanban-card-line--short {
      width: 40%;
    }

    .kanban-card-line--short::after {
      animation-delay: 0.5s;
    }

    .kanban-card-line--long {
      width: 80%;
    }

    .kanban-card-line--long::after {
      animation-delay: 1s;
    }

    /* Floating particles animation */
    .hero::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20% 30%, rgba(59, 130, 246, 0.3), transparent),
        radial-gradient(2px 2px at 40% 70%, rgba(59, 130, 246, 0.2), transparent),
        radial-gradient(1px 1px at 90% 40%, rgba(59, 130, 246, 0.4), transparent),
        radial-gradient(1px 1px at 10% 80%, rgba(59, 130, 246, 0.3), transparent);
      background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
      animation: float 20s linear infinite;
      pointer-events: none;
      z-index: -1;
    }

    @keyframes float {
      0% {
        transform: translate(0, 0) rotate(0deg);
      }
      33% {
        transform: translate(30px, -30px) rotate(120deg);
      }
      66% {
        transform: translate(-20px, 20px) rotate(240deg);
      }
      100% {
        transform: translate(0, 0) rotate(360deg);
      }
    }
  `;

  return (
    <div className={`landing-page ${isMenuOpen ? 'body--noscroll' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* Header */}
      <header className={`header container container-pall ${isMenuOpen ? 'header--active' : ''}`}>
        <nav className="nav flex flex-jc-sp flex-ai-c">
          <a className="header__logo" href="#">TaskManager</a>
          
          <div 
            className="toggle-menu flex hide-for-desktop" 
            onClick={toggleMenu}
            role="button"
            tabIndex="0"
          >
            <div className="toggle-menu__dots">
              <span className="toggle-menu__dot"></span>
              <span className="toggle-menu__dot"></span>
              <span className="toggle-menu__dot"></span>
              <span className="toggle-menu__dot"></span>
            </div>
            <span className="toggle-menu__text">Menu</span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero container container-pall">
        <div className="hero__image">
          <div className="hero-kanban-board">
            {/* BACKLOG Column */}
            <div className="kanban-column">
              <div className="kanban-header">BACKLOG</div>
              <div className="kanban-card">
                <div className="kanban-card-line"></div>
              </div>
              <div className="kanban-card">
                <div className="kanban-card-line kanban-card-line--short"></div>
              </div>
              <div className="kanban-card">
                <div className="kanban-card-line"></div>
              </div>
            </div>
            
            {/* TO DO Column */}
            <div className="kanban-column">
              <div className="kanban-header">TO DO</div>
              <div className="kanban-card">
                <div className="kanban-card-line kanban-card-line--long"></div>
              </div>
            </div>
            
            {/* IN PROGRESS Column */}
            <div className="kanban-column">
              <div className="kanban-header">IN PROGRESS</div>
              <div className="kanban-card">
                <div className="kanban-card-line"></div>
              </div>
              <div className="kanban-card">
                <div className="kanban-card-line kanban-card-line--long"></div>
              </div>
            </div>
            
            {/* DONE Column */}
            <div className="kanban-column">
              <div className="kanban-header">DONE</div>
              <div className="kanban-card">
                <div className="kanban-card-line kanban-card-line--short"></div>
              </div>
              <div className="kanban-card">
                <div className="kanban-card-line"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero__text">
          <h1 className="hero__heading">Kanban Task Manager</h1>
          <p className="hero__description">
            Organize your work with boards, lists, and tasks. Set priorities, due dates, and keep your work aligned.
          </p>
          <br></br>
          <div className="hero__cta-container">
            <a href="/login" className="hero__cta hero__cta--primary">Sign in</a>
            <a href="/register" className="hero__cta hero__cta--secondary">Create account</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;