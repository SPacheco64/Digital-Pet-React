import React, { useRef, useEffect } from 'react';
import dayBG from '../../graphics/backgrounds/pet-bg-day.png';
import chocoboSprite from '../../../src/graphics/backgrounds/pet-bg-day.png';

// Define the mutable game state structure
interface PetState {
  x: number;
  y: number;
  frame: number;
  tickCounter: number;
  hunger: number;
}

export const PetGameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Keep game state in a ref so the loop can read/write instantly without re-rendering React
  const gameStateRef = useRef<PetState>({
    x: 0,
    y: 0,
    frame: 0,
    tickCounter: 0,
    hunger: 100,
  });

  // Load your spritesheets
  const spriteRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = chocoboSprite;
    img.onload = () => {
      spriteRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // The Main Game Loop
    const loop = () => {
      updateGame();
      renderGame(ctx);
      animationFrameId = requestAnimationFrame(loop);
    };

    // 1. Update Game Logic (Physics, timers, animation frames)
    const updateGame = () => {
      const state = gameStateRef.current;
      
      // Handle sprite animation timing
      state.tickCounter++;
      if (state.tickCounter % 15 === 0) { // Change frame every 15 ticks
        state.frame = (state.frame + 1) % 1; // Assuming a 4-frame walk cycle
      }

    //   // Gentle random pacing back and forth
    //   if (Math.random() < 0.02) {
    //     state.x += Math.random() > 0.5 ? 5 : -5;
    //   }
    };

    // 2. Render Graphics to the Screen
    const renderGame = (context: CanvasRenderingContext2D) => {
      const state = gameStateRef.current;
      const sprite = spriteRef.current;

      // Clear the canvas for the new frame
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Background
    const bgImg = new Image();
    bgImg.src = dayBG;
    bgImg.onload = function() {
        context.drawImage(bgImg,0,0,canvas.width,canvas.height);
    };

      
      // Draw UI Text (Hunger bar)
      context.fillStyle = '#000000';
      context.font = '16px "Courier New", monospace';
      context.fillText(`Hunger: ${state.hunger}`, 10, 20);

      // Draw Pet Sprite when loaded
      if (sprite) {
        const spriteWidth = canvas.width;
        const spriteHeight = canvas.height;
        
        context.drawImage(
          sprite,
          state.frame * spriteWidth, 0, // Source X (shifts by frame), Source Y
          spriteWidth, spriteHeight,    // Source width and height
          0, 0,             // Destination X, Destination Y on canvas
          canvas.height, canvas.width                        // Destination width, height (scaled up)
        );
      }
    };

    // Start the loop
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle HTML Button Interactions
  const feedPet = () => {
    gameStateRef.current.hunger = Math.min(gameStateRef.current.hunger + 10, 100);
    console.log("Fed! Hunger is now:", gameStateRef.current.hunger);
  };

  return (
    <div id={'gameCanvas'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', zIndex: '3' }}>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        style={{ border: '4px solid #333', imageRendering: 'pixelated' }} 
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={feedPet}>Feed</button>
      </div>
    </div>
  );
};