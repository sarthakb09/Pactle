import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAP = <T extends HTMLElement = HTMLElement>() => {
  const elementRef = useRef<T>(null);

  // Fade in animation
  const fadeIn = (duration = 0.8, delay = 0) => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration, 
          delay,
          ease: "power2.out"
        }
      );
    }
  };

  // Slide in from left
  const slideInLeft = (duration = 0.8, delay = 0) => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { x: -100, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration, 
          delay,
          ease: "power2.out"
        }
      );
    }
  };

  // Slide in from right
  const slideInRight = (duration = 0.8, delay = 0) => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { x: 100, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration, 
          delay,
          ease: "power2.out"
        }
      );
    }
  };

  // Scale in animation
  const scaleIn = (duration = 0.6, delay = 0) => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration, 
          delay,
          ease: "back.out(1.7)"
        }
      );
    }
  };

  // Stagger animation for multiple elements
  const staggerIn = (duration = 0.6, stagger = 0.1, delay = 0) => {
    if (elementRef.current) {
      const children = elementRef.current.children;
      gsap.fromTo(
        children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration, 
          delay,
          stagger,
          ease: "power2.out"
        }
      );
    }
  };

  // Scroll-triggered animation
  const scrollTrigger = (animation: () => void, trigger = "top 80%") => {
    if (elementRef.current) {
      ScrollTrigger.create({
        trigger: elementRef.current,
        start: trigger,
        onEnter: animation,
        once: true
      });
    }
  };

  // Hover animations
  const hoverScale = (scale = 1.05, duration = 0.3) => {
    if (elementRef.current) {
      elementRef.current.addEventListener('mouseenter', () => {
        gsap.to(elementRef.current, { scale, duration, ease: "power2.out" });
      });
      
      elementRef.current.addEventListener('mouseleave', () => {
        gsap.to(elementRef.current, { scale: 1, duration, ease: "power2.out" });
      });
    }
  };

  // Page transition animation
  const pageTransition = (direction: 'left' | 'right' = 'left', duration = 0.5) => {
    if (elementRef.current) {
      const xOffset = direction === 'left' ? -100 : 100;
      gsap.fromTo(
        elementRef.current,
        { x: xOffset, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration,
          ease: "power2.out"
        }
      );
    }
  };

  return {
    elementRef,
    fadeIn,
    slideInLeft,
    slideInRight,
    scaleIn,
    staggerIn,
    scrollTrigger,
    hoverScale,
    pageTransition
  };
}; 