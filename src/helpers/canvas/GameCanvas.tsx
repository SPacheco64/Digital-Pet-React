import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Sprite} from 'react-konva';
import type Konva from 'konva';
import useImage from 'use-image';
import chocoSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png';
import { GameCanvasProps } from '../../types';
import { useSpriteAnimation } from '../functions/useSpriteAnimation';
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
    currentMoodIcon,
    setCurrentlyBusy,
    actionFailureTrigger
  } = props;

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

  // This function changes the Chocobo animation shown briefly
  // on user click of the game screen. Result based on Chocobo's mood.
  const touchReaction = (forceSadReaction = false) => {
    const isUninteractable = currentStatus === 'training' || currentStatus === 'sleeping' || currentStatus === 'eating';

    // Prevents bugs where buttons would become enabled when they should be disabled
    // as the user touches the chocobo while it is busy with another action.
    if (isUninteractable) {
      return;
    }

    let reactionAnimation: AnimAttr;

    if (forceSadReaction || currentMoodIcon === 'sad') {
      reactionAnimation = mainAnimationAttrs[7];
    } else if (currentMoodIcon === 'happy') {
      reactionAnimation = mainAnimationAttrs[6];
    } else if (currentMoodIcon === 'normal') {
      reactionAnimation = mainAnimationAttrs[5];
    } else {
      return;
    }

    if (touchReactionTimer.current !== null) {
      window.clearTimeout(touchReactionTimer.current);
    }

    setCurrentlyBusy(true);
    setAttrToUse(reactionAnimation);
    touchReactionTimer.current = window.setTimeout(() => {
      touchReactionTimer.current = null;
      setAttrToUse(getStatusAnimation(currentStatus));
      setCurrentlyBusy(false);
    }, 2000);
  };

  const stageRef = useRef<Konva.Stage>(null);
  const spriteRef = useRef<Konva.Sprite>(null);
  const touchReactionTimer = useRef<number | null>(null);

  const [chocoSheetImg] = useImage(chocoSheet);
  const [attrToUse, setAttrToUse] = useState<AnimAttr>({x: 90, y: 110, anim: 'idle', frameRate: 5, scale: 1.6});
  const lastActionFailureTrigger = useRef<number>(actionFailureTrigger);

  const getStatusAnimation = (status: string): AnimAttr => {
    if (status === 'eating') return mainAnimationAttrs[1];
    if (status === 'training') return mainAnimationAttrs[2];
    if (status === 'sleeping') return mainAnimationAttrs[3];
    if (status === 'Egg') return mainAnimationAttrs[4];
    return mainAnimationAttrs[0];
  };

  // Sets the shown animation based on the chocobo's current status.
  useEffect(() => {
    if (touchReactionTimer.current !== null) {
      window.clearTimeout(touchReactionTimer.current);
      touchReactionTimer.current = null;
      setCurrentlyBusy(false);
    }

    setAttrToUse(getStatusAnimation(currentStatus));
  }, [currentStatus, setCurrentlyBusy]);

  useEffect(() => () => {
    if (touchReactionTimer.current !== null) {
      window.clearTimeout(touchReactionTimer.current);
      touchReactionTimer.current = null;
      setCurrentlyBusy(false);
    }
  }, [setCurrentlyBusy]);

  // The actual animations used pulled from the Chocobo Spritesheet
  const animations = useRef({
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
  }).current;

  // Use the custom loop so think, happy, and upset can play all of their frames.
  useSpriteAnimation(spriteRef, attrToUse.anim, attrToUse.frameRate, animations, !!chocoSheetImg);

  useEffect(() => {
    if (actionFailureTrigger !== lastActionFailureTrigger.current) {
      lastActionFailureTrigger.current = actionFailureTrigger;
      touchReaction(true);
    }
  }, [actionFailureTrigger]);

  return (
    <>
      <Stage id='GameStage' className='game-canvas' height={248} width={256} ref={stageRef} onClick={() => touchReaction()}>
        <Layer id='GameLayer'>
          {chocoSheetImg && <Sprite
            ref={spriteRef}
            x={attrToUse.x}
            y={attrToUse.y}
            image={chocoSheetImg}
            animation={attrToUse.anim}
            animations={animations}
            frameRate={attrToUse.frameRate}
            scaleX={attrToUse.scale}
            scaleY={attrToUse.scale}
          />}
        </Layer>
      </Stage>
    </>
  );
};

export default GameCanvas;