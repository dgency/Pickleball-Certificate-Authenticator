// components/LoadingAnimation.js
"use client"
import { useEffect } from 'react';
import { gsap, Power1 } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'; // Import MotionPathPlugin

gsap.registerPlugin(MotionPathPlugin); // Register the plugin

const LoadingAnimation = () => {
  useEffect(() => {
    const blueDot = document.querySelector('#blue');
    if (!blueDot) {
      console.warn('The blue dot element was not found');
      return;
    }

    const masterTL = gsap.timeline({
      repeat: -1, // Infinite repeat
      yoyo: true, // Reverse animation back and forth
      delay: 1, // Initial delay before animation starts
    });

    const dur = 0.4;
    const easing = Power1.easeInOut;

    // Set initial transform style for the dot
    gsap.set('.dot', {
      transformStyle: 'preserve-3d',
      transformOrigin: '50% 50%',
    });

    // Animation sequence for the blue dot using MotionPathPlugin
    masterTL
      .to('#blue', {
        duration: dur,
        motionPath: {
          path: [
            { x: 0, y: 0 },   // Start point
            { x: 0, y: 7 },   // Point 1
            { x: 15, y: -25 }, // Point 2
            { x: 33, y: 0 },   // End point
          ],
          autoRotate: true, // Auto-rotate if needed
        },
        ease: easing,
      }, 'blueJumpFirst')
      .to('#blue', {
        duration: dur,
        motionPath: {
          path: [
            { x: 33, y: 0 },   // Start from the end of the previous path
            { x: 33, y: 7 },
            { x: 43, y: -25 },
            { x: 66, y: 0 },
          ],
          autoRotate: true,
        },
        ease: easing,
      }, 'blueJumpTwo')
      .to('#blue', {
        duration: dur,
        motionPath: {
          path: [
            { x: 66, y: 0 },
            { x: 66, y: 7 },
            { x: 80, y: -25 },
            { x: 100, y: 0 },
          ],
          autoRotate: true,
        },
        ease: easing,
      }, 'blueJumpThree');

    // Start the animation timeline
    // masterTL.play();
  }, []);

  return (
    <div id="dots">
      <div id="blue" className="blue dot"></div>
     </div>
  );
};

export default LoadingAnimation;
