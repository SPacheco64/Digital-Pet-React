import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Sprite} from 'react-konva';
import useImage from 'use-image';
import { Image } from 'react-konva';
import bgDay from '../../graphics/backgrounds/pet-bg-day.png';
import bgEve from '../../graphics/backgrounds/pet-bg-evening.png';
import bgNight from '../../graphics/backgrounds/pet-bg-night.png';
import chocoNormal from '../../graphics/canvas_sprites/choco-sprite-for-canvas.png';
import chocoEat from '../../graphics/canvas_sprites/chocoEat-sprite-for-canvas.png';
import chocoTrain from '../../graphics/canvas_sprites/chocoTrain-sprite-for-canvas.png';
import chocoSleep from '../../graphics/canvas_sprites/chocoSleep-sprite-for-canvas.png';
import { GameScreenProps } from '../../types';

const GameScreen: React.FC<GameScreenProps> = (props: GameScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus,
    timeClass
  } = props;

  const spriteRef = useRef(null);

  const URLImage = ({ src, ...rest }) => {
      const [image] = useImage(src, 'anonymous');
      return <Image image={image} {...rest} />;
  };

  const imageToUse = () => {
    if (timeClass === 'day-bg') {
      return bgDay;
    } else if (timeClass === 'night-bg') {
      return bgNight;
    } else {
      return bgEve;
    }
  };

  const [chocoNormalImg] = useImage(chocoNormal);
  const [chocoEatImg] = useImage(chocoEat);
  const [chocoTrainImg] = useImage(chocoTrain);
  const [chocoSleepImg] = useImage(chocoSleep);

  const isEating = currentStatus === 'eating';
  const isTraining = currentStatus === 'training';
  const isSleeping = currentStatus === 'sleeping';

  const animations = {
    idle: [
      6, 0, 69, 72,      // frame 1
      113, 0, 69, 72,     // frame 2
      216, 0, 69, 72,    // frame 3
      113, 0, 69, 72,    // frame 4
    ], 
    eating: [
      0, 0, 69, 72,      // frame 1
      107, 0, 69, 72,     // frame 2
      210, 0, 69, 72,    // frame 3
      107, 0, 69, 72,    // frame 4
    ],
    training: [
      7, 0, 63, 81,      // frame 1
      114, 0, 63, 81,     // frame 2
      216, 0, 63, 81,    // frame 3
      114, 0, 63, 81,    // frame 4
    ],
    sleeping: [
      0, 0, 81, 118,      // frame 1
      89, 0, 94, 118,     // frame 2
      186, 0, 94, 118,    // frame 3
      300, 0, 94, 118,    // frame 4
    ],
  };

  useEffect(() => {
    if (spriteRef && spriteRef.current) {
      spriteRef.current.start();
    }
  }, [currentStatus]);

  return (
    <>
      <Stage className='game-canvas' height={248} width={256}>
        <Layer>
          <URLImage src={imageToUse()} x={0} />

          {
            !isEating && !isTraining && !isSleeping &&
            <Sprite
              ref={spriteRef}
              x={90}
              y={110}
              image={chocoNormalImg}
              animation='idle'
              animations={animations}
              frameRate={5}
              frameIndex={0}
              scaleX={1.6}
              scaleY={1.6}
            />
          }

          {
            isEating &&
            <Sprite
              ref={spriteRef}
              x={80}
              y={110}
              image={chocoEatImg}
              animation='eating'
              animations={animations}
              frameRate={5}
              frameIndex={0}
              scaleX={1.6}
              scaleY={1.6}
            />
          }

          {
            isTraining &&
            <Sprite
              ref={spriteRef}
              x={85}
              y={95}
              image={chocoTrainImg}
              animation='training'
              animations={animations}
              frameRate={7}
              frameIndex={0}
              scaleX={1.6}
              scaleY={1.6}
            />
          }

          {
            isSleeping &&
            <Sprite
              ref={spriteRef}
              x={75}
              y={35}
              image={chocoSleepImg}
              animation='sleeping'
              animations={animations}
              frameRate={3}
              frameIndex={0}
              scaleX={1.6}
              scaleY={1.6}
            />
          }
        </Layer>
        {/* <Layer>
        </Layer> */}
      </Stage>
    </>
  );
};

export default GameScreen;