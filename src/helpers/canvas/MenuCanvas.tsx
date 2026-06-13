import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Sprite} from 'react-konva';
import useImage from 'use-image';
import chocoSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png';
import { MenuCanvasProps } from '../../types';

type AnimAttr = {
  x: number;
  y: number;
  anim: string;
  frameRate: number;
  scale: number;
};

const MenuCanvas: React.FC<MenuCanvasProps> = (props: MenuCanvasProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus,
    iconToUse,
  } = props;

  const stageRef = useRef<any>(null);
  const spriteRef = useRef<any>(null);

  const [chocoSheetImg] = useImage(chocoSheet);
  const [attrToUse, setAttrToUse] = useState<AnimAttr>({x: 90, y: 110, anim: 'eggbounce', frameRate: 7, scale: .5});

  const mainAnimationAttrs = [
    {x: 227, y: 213, anim: 'eggbounce', frameRate: 7, scale: .3}, // Egg
    {x: 220, y: 206, anim: 'miniChocoWalk', frameRate: 5, scale: .45}, // Menu Choco Walk
    {x: 220, y: 206, anim: 'miniChocoEat', frameRate: 3, scale: .45}, // Menu Choco Eat
    {x: 118, y: 190, anim: 'miniChocoTurned', frameRate: 3, scale: .6}, // Menu Choco Turned
  ];

  const animations = {
    eggbounce: [
      321, 268, 80, 80,     // frame 1
      411, 268, 80, 80,     // frame 2
      501, 268, 80, 80,     // frame 3
      411, 268, 80, 80,     // frame 4
    ],
    miniChocoWalk: [
      299, 918, 80, 80,     // frame 1
      405, 918, 80, 80,     // frame 2
    ],
    miniChocoEat: [
      299, 779, 80, 80,      // frame 1
      299, 779, 80, 80,      // frame 2
      299, 779, 80, 80,      // frame 3
      405, 779, 80, 80,      // frame 4
      501, 779, 80, 80,      // frame 5
      405, 779, 80, 80,      // frame 6
      501, 779, 80, 80,      // frame 7
    ],
    miniChocoTurned: [
      0, 918, 80, 80,     // frame 1
    ],
  };

  useEffect(() => {
    if (currentStatus === 'Egg') {
      setAttrToUse(mainAnimationAttrs[0]);
    } else {
      setAttrToUse(mainAnimationAttrs[iconToUse]);
    }
  }, [currentStatus]);

  useEffect(() => {
    const spriteNode = spriteRef.current;

    if (spriteNode) {
      spriteNode.start();
    }
  }, [currentStatus]);

  return (
    <>
      {
        <Stage id='MenuStage' className='menu-canvas' height={248} width={256} ref={stageRef}>
          <Layer id='MenuLayer'>
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
      }
    </>
  );
};

export default MenuCanvas;