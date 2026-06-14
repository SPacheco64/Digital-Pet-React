import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Sprite} from 'react-konva';
import useImage from 'use-image';
import chocoSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png';
import { GameCanvasProps } from '../../types';
import '../../../styles/components/game-canvas.scss';

type AnimAttr = {
  x: number;
  y: number;
  anim: string;
  frameRate: number;
  scale: number;
};

const GameCanvas: React.FC<GameCanvasProps> = (props: GameCanvasProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus,
    setCurrentlyBusy
  } = props;

  // This function changes the Chocobo animation shown briefly
  // on user click of the game screen. Result based on Chocobo's mood.
  const touchReaction = () => {
    const previousState = attrToUse;

    if (currentStatus === 'happy') {
      setCurrentlyBusy(true);
      setAttrToUse(mainAnimationAttrs[6]);
    } else if (currentStatus === 'sad') {
      setCurrentlyBusy(true);
      setAttrToUse(mainAnimationAttrs[7]);
    } else if (currentStatus === 'normal') {
      setCurrentlyBusy(true);
      setAttrToUse(mainAnimationAttrs[5]);
    }

    setTimeout(() => {
      if (currentStatus !== 'Egg') {
        setAttrToUse(previousState);
        setCurrentlyBusy(false);
      }
    }, 2000);
  };

  const stageRef = useRef<any>(null);
  const spriteRef = useRef<any>(null);

  const [chocoSheetImg] = useImage(chocoSheet);
  const [attrToUse, setAttrToUse] = useState<AnimAttr>({x: 90, y: 110, anim: 'idle', frameRate: 5, scale: 1.6});

  // All animation settings for each animation shown in this canvas
  const mainAnimationAttrs = [
    {x: 90, y: 110, anim: 'idle', frameRate: 5, scale: 1.6}, // Idle
    {x: 80, y: 110, anim: 'eating', frameRate: 5, scale: 1.6}, // Eating
    {x: 85, y: 95, anim: 'training', frameRate: 7, scale: 1.6}, // Training
    {x: 75, y: 25, anim: 'sleeping', frameRate: 3, scale: 1.6}, // Sleeping
    {x: 90, y: 115, anim: 'eggbounce', frameRate: 7, scale: 1.3}, // Egg
    {x: 66, y: 124.5, anim: 'think', frameRate: 5, scale: 1.6}, // Neutral Touch React
    {x: 68, y: 100, anim: 'happy', frameRate: 7, scale: 1.6}, // Happy Touch React
    {x: 90, y: 115, anim: 'upset', frameRate: 7, scale: 1.6}, // Upset Touch React
  ];

  // Sets shown animation based on the chocobo's currentStatus value
  useEffect(() => {
    if (currentStatus === 'eating') {
      setAttrToUse(mainAnimationAttrs[1]);
    } else if (currentStatus === 'training') {
      setAttrToUse(mainAnimationAttrs[2]);
    } else if (currentStatus === 'sleeping') {
      setAttrToUse(mainAnimationAttrs[3]);
    } else if (currentStatus === 'Egg') {
        setAttrToUse(mainAnimationAttrs[4]);
    } else {
      setAttrToUse(mainAnimationAttrs[0]);
    }
  }, [currentStatus]);

  // The actual animations used pulled from the Chocobo Spritesheet
  const animations = {
    idle: [
      0, 0, 69, 72,      // frame 1
      107, 0, 69, 72,     // frame 2
      210, 0, 69, 72,    // frame 3
      107, 0, 69, 72,    // frame 4
    ], 
    eating: [
      324, 0, 69, 72,      // frame 1
      431, 0, 69, 72,     // frame 2
      534, 0, 69, 72,    // frame 3
      431, 0, 69, 72,    // frame 4
    ],
    sleeping: [
      0, 74, 81, 130,      // frame 1
      89, 74, 94, 130,     // frame 2
      186, 74, 94, 130,    // frame 3
      300, 74, 94, 130,    // frame 4
    ],
    training: [
      0, 268, 80, 80,      // frame 1
      106, 268, 80, 80,     // frame 2
      209, 268, 80, 80,    // frame 3
      106, 268, 80, 80,    // frame 4
    ],
    eggbounce: [
      321, 268, 80, 80,      // frame 1
      411, 268, 80, 80,     // frame 2
      501, 268, 80, 80,    // frame 3
      411, 268, 80, 80,    // frame 4
    ],
    think: [
      0, 788, 66, 80,       // frame 1
      0, 788, 66, 80,       // frame 2
      0, 788, 66, 80,       // frame 3
      90, 788, 66, 80,      // frame 4
      180, 788, 66, 80,    // frame 5
    ],
    happy: [
      0, 404, 81, 85,     // frame 1
      90, 404, 81, 85,     // frame 2
      192, 404, 81, 85,     // frame 3
      90, 404, 81, 85,     // frame 4
      0, 503, 81, 85,     // frame 5
      90, 503, 81, 85,     // frame 6
      192, 503, 81, 85,     // frame 7
      90, 503, 81, 85,     // frame 8
    ],
    upset: [
      0, 652, 80, 80,       // frame 1
      90, 652, 80, 80,      // frame 2
      180, 652, 80, 80,      // frame 3
      90, 652, 80, 80,      // frame 4
      0, 652, 80, 80,      // frame 5
      270, 652, 80, 80,      // frame 6
      360, 652, 80, 80,      // frame 7
      270, 652, 80, 80,      // frame 8
    ],
  };

  // Starts animation whenever currentStatus changes
  useEffect(() => {
    const spriteNode = spriteRef.current;

    if (spriteNode) {
      spriteNode.start();
    }
  }, [currentStatus]);

  return (
    <>
      <Stage id='GameStage' className='game-canvas' height={248} width={256} ref={stageRef} onClick={touchReaction}>
        <Layer id='GameLayer'>
          <Sprite
            ref={spriteRef}
            x={attrToUse.x}
            y={attrToUse.y}
            // @ts-ignore
            image={chocoSheetImg}
            animation={attrToUse.anim}
            animations={animations}
            frameRate={attrToUse.frameRate}
            frameIndex={0}
            scaleX={attrToUse.scale}
            scaleY={attrToUse.scale}
          />
        </Layer>
      </Stage>
    </>
  );
};

export default GameCanvas;