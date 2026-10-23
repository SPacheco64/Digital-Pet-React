import { useEffect, type RefObject } from 'react';
import type Konva from 'konva';

export const useSpriteAnimation = (
  spriteRef: RefObject<Konva.Sprite | null>,
  animation: string,
  frameRate: number,
  animations: Record<string, number[]>,
  enabled = true,
) => {
  useEffect(() => {
    const sprite = spriteRef.current;
    const frames = animations[animation];

    if (!enabled || !sprite || !frames) {
      return;
    }

    // Each frame is stored as x, y, width, height; using the array length supports any frame count.
    const frameCount = frames.length / 4;
    let frameIndex = 0;

    // Konva's built-in Sprite.start() only advances four indexes in this version, so drive the full loop here.
    sprite.stop();
    sprite.frameIndex(0);

    const interval = window.setInterval(() => {
      frameIndex = (frameIndex + 1) % frameCount;
      sprite.frameIndex(frameIndex);
      sprite.getLayer()?.batchDraw();
    }, 1000 / frameRate);

    return () => {
      window.clearInterval(interval);
      sprite.stop();
    };
  }, [animation, animations, enabled, frameRate, spriteRef]);
};
