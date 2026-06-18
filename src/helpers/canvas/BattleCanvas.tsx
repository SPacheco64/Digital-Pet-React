import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Sprite} from 'react-konva';
import useImage from 'use-image';
import chocoSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png';
import enemySheet from '../../graphics/canvas_sprites/enemy-spritesheet.png';
import attackSheet from '../../graphics/canvas_sprites/attack-spritesheet.png';
import { BattleCanvasProps } from '../../types';
import '../../../styles/components/battle-canvas.scss';
import BattleLoader from '../components/BattleLoader';
import Konva from 'konva';

type AnimAttr = {
  x: number;
  y: number;
  anim: string;
  frameRate: number;
  scale: number;
};

const BattleCanvas: React.FC<BattleCanvasProps> = (props: BattleCanvasProps) => {
    // Destructure props for ease of access & documentation
    const {
        // currentPlayerAction,
        // currentEnemyAction,
        // currentEnemy,
        selectedEnemyLevel,
        isLoading,
        playerAttack,
        enemyAttack,
        playerSpecial,
        enemySpecial,
        playerRunning,
        setIsLoading,
    } = props;

    const determineEnemy = () => {
        switch (selectedEnemyLevel) {
            case 1:
                return Math.floor(Math.random() * 3);
            case 2:
                return Math.floor(Math.random() * 3) + 3;
            case 3:
                return Math.floor(Math.random() * 3) + 6;
            case 4:
                return Math.floor(Math.random() * 3) + 9;
            default:
                return Math.floor(Math.random() * 3) + 12;
            
        }
    };

    // All animation settings for each chocobo animation shown in this canvas
    const chocoboAttrs = [
        {x: 190, y: 206, anim: 'miniChocoStand', frameRate: 5, scale: 1}, // Menu Choco Stand
        {x: 180, y: 206, anim: 'miniChocoAttack', frameRate: 5, scale: 1}, // Menu Choco Attack
    ];

    // All animation settings for each enemy shown in this canvas
    const enemyAttrs = [
        {x: 40, y: 115, anim: 'cactuar', frameRate: 5, scale: .5}, // Cactuar
        {x: 25, y: 100, anim: 'flan', frameRate: 5, scale: .8}, // Flan
        {x: 25, y: 100, anim: 'mu', frameRate: 5, scale: .8}, // Mu
        {x: 30, y: 95, anim: 'leapFrog', frameRate: 5, scale: .8}, // Leap Frog
        {x: 30, y: 85, anim: 'bomb', frameRate: 5, scale: .8}, // Bomb
        {x: 30, y: 95, anim: 'deepEye', frameRate: 5, scale: .8}, // Deep Eye
        {x: 35, y: 95, anim: 'goldCactuar', frameRate: 5, scale: .7}, // Gold Cactuar
        {x: 30, y: 90, anim: 'tonberry', frameRate: 5, scale: .8}, // Tonberry
        {x: 30, y: 92, anim: 'magicPot', frameRate: 5, scale: .8}, // Magic Pot
        {x: 35, y: 95, anim: 'blackChocobo', frameRate: 5, scale: .7}, // Black Chocobo
        {x: 15, y: 58, anim: 'mysteryBox', frameRate: 5, scale: 1.2}, // Mystery Box
        {x: 15, y: 70, anim: 'ahriman', frameRate: 5, scale: .8}, // Ahriman
        {x: 15, y: 35, anim: 'ifrit', frameRate: 5, scale: 1}, // Ifrit
        {x: 15, y: 35, anim: 'malboro', frameRate: 5, scale: 1}, // Malboro
        {x: 15, y: 45, anim: 'ultros', frameRate: 5, scale: 1}, // Ultros
    ];

    // Attack/Effect animation settings
    const attackAttrs = [
        {x: 40, y: 105, anim: 'normalHit', frameRate: 13, scale: .7}, // Normal Attack on Enemy
        {x: 190, y: 105, anim: 'normalHit', frameRate: 13, scale: .7}, // Normal Attack on Player
    ];

    const stageRef = useRef<any>(null);
    const spriteRef1 = useRef<any>(null);
    const spriteRef2 = useRef<any>(null);
    const spriteRef3 = useRef<any>(null);

    const [chocoSheetImg] = useImage(chocoSheet);
    const [enemySheetImg] = useImage(enemySheet);
    const [attackSheetImg] = useImage(attackSheet);

    const [chocoAttrToUse, setChocoAttrToUse] = useState<AnimAttr>({x: 190, y: 110, anim: 'miniChocoStand', frameRate: 5, scale: .6});
    const [enemyAttrToUse, setEnemyAttrToUse] = useState<AnimAttr>(enemyAttrs[determineEnemy()]);
    const [attackAttrToUse, setAttackAttrToUse] = useState<AnimAttr>({x: 40, y: 105, anim: 'normalHit', frameRate: 13, scale: .7});

    // The actual animations used pulled from the Chocobo Spritesheet
    const animations = {
        // Chocobo:
        miniChocoStand: [
            299, 918, 80, 80,     // frame 1
            405, 918, 80, 80,     // frame 2
        ],
        miniChocoAttack: [
            405, 918, 80, 80,     // frame 1
        ],

        // Enemies:
        cactuar: [
            0, 0, 80, 80
        ],
        flan: [
            100, 0, 80, 80
        ],
        mu: [
            210, 0, 80, 80
        ],
        leapFrog: [
            0, 130, 80, 80
        ],
        bomb: [
            100, 130, 80, 80
        ],
        deepEye: [
            210, 130, 80, 80
        ],
        goldCactuar: [
            0, 260, 80, 80
        ],
        tonberry: [
            100, 260, 80, 80
        ],
        magicPot: [
            210, 260, 80, 80
        ],
        blackChocobo: [
            0, 410, 80, 80,
        ],
        mysteryBox: [
            100, 410, 80, 80,
        ],
        ahriman: [
            220, 390, 120, 120,
        ],
        ifrit: [
            0, 570, 120, 120,
        ],
        malboro: [
            140, 565, 130, 130,
        ],
        ultros: [
            285, 570, 150, 140,
        ],

        // Attacks/Effects:
        normalHit: [
            0, 0, 49, 60,
            62, 0, 49, 60,
            124, 0, 49, 60,
            200, 0, 0, 0,
            200, 0, 0, 0,
            200, 0, 0, 0,
        ],
    };

    // Starts animation whenever actions are taken
    useEffect(() => {
        const spriteNode1 = spriteRef1.current;
        const spriteNode2 = spriteRef2.current;
        const spriteNode3 = spriteRef3.current;

        console.log('Sprite Node 1: ', spriteNode1);
        console.log('Sprite Node 2: ', spriteNode2);
        console.log('Sprite Node 3: ', spriteNode3);

        if (spriteNode1) { spriteNode1.start(); }
        if (spriteNode2) { spriteNode2.start(); }
        if (spriteNode3) { spriteNode3.start(); }
    }, [isLoading, playerAttack, enemyAttack]);

    useEffect(() => {
        const ogChocoState = chocoAttrToUse;
        const ogEnemyState = enemyAttrToUse;
        const targetNode = playerAttack ? spriteRef1.current : spriteRef2.current;

        const flashSprite = new Konva.Tween({
            node: targetNode,
            opacity: 0.5,
            duration: .1,
            easing: Konva.Easings.Linear,
            onFinish: () => {
                    new Konva.Tween({
                    node: targetNode,
                    opacity: 1,
                    duration: 0.01,
                    easing: Konva.Easings.Linear,
                }).play();
            }
        });

        console.log('Player Attack: ', playerAttack);
        console.log('Enemy Attack: ', enemyAttack);
        console.log('Target Node: ', targetNode);

        if (playerAttack) {
            setAttackAttrToUse(attackAttrs[0]);
            flashSprite.play();

            setChocoAttrToUse(prevState => ({
                ...prevState,
                x: prevState.x - 10,
                y: prevState.y - 4,
                anim: 'miniChocoAttack'
            }));

            setEnemyAttrToUse(prevState => ({
                ...prevState,
                x: prevState.x - 5,
                y: prevState.y + 1,
                scale: prevState.scale -.05
            }));

            setTimeout(() => {
                setChocoAttrToUse(ogChocoState);
                setEnemyAttrToUse(ogEnemyState);
                flashSprite.destroy();
            }, 400);
        }

        if (enemyAttack) {
            console.log('attackAttrs[1]: ', attackAttrs[1]);
            setAttackAttrToUse(attackAttrs[1]);
            flashSprite.play();

            setChocoAttrToUse(prevState => ({
                ...prevState,
                x: prevState.x + 10,
                anim: 'miniChocoAttack'
            }));

            setEnemyAttrToUse(prevState => ({
                ...prevState,
                x: prevState.x + 5,
                y: prevState.y,
                scale: prevState.scale + .05
            }));

            setTimeout(() => {
                setChocoAttrToUse(ogChocoState);
                setEnemyAttrToUse(ogEnemyState);
                flashSprite.destroy();
            }, 400);
        }
    }, [playerAttack, enemyAttack]);

    useEffect(() => {
        console.log('Attack To Use: ', attackAttrToUse);
    }, [attackAttrToUse]);

    // When enemy attacks, change their x value by +10

    return (
        <BattleLoader selectedEnemyLevel={selectedEnemyLevel} isLoading={isLoading} setIsLoading={setIsLoading}>
            <Stage id='BattleStage' className='battle-canvas' height={248} width={256} ref={stageRef}>
                <Layer id='BattleLayer'>
                    {/* Enemy Sprite: */}
                    <Sprite
                        id='Enemy'
                        ref={spriteRef1}
                        x={enemyAttrToUse.x}
                        y={enemyAttrToUse.y}
                        // @ts-ignore
                        image={enemySheetImg}
                        animation={enemyAttrToUse.anim}
                        animations={animations}
                        frameRate={enemyAttrToUse.frameRate}
                        scaleX={enemyAttrToUse.scale}
                        scaleY={enemyAttrToUse.scale}
                        
                    />

                    {/* Chocobo Sprite */}
                    <Sprite
                        ref={spriteRef2}
                        x={chocoAttrToUse.x}
                        y={chocoAttrToUse.y}
                        // @ts-ignore
                        image={chocoSheetImg}
                        animation={chocoAttrToUse.anim}
                        animations={animations}
                        frameRate={chocoAttrToUse.frameRate}
                        scaleX={chocoAttrToUse.scale}
                        scaleY={chocoAttrToUse.scale}
                    />

                    {/* Show only when an Attack or Special Action is taking place */}

                    {
                        (playerAttack || enemyAttack) &&
                        <Sprite
                            ref={spriteRef3}
                            x={attackAttrToUse.x}
                            y={attackAttrToUse.y}
                            // @ts-ignore
                            image={attackSheetImg}
                            animation={attackAttrToUse.anim}
                            animations={animations}
                            frameRate={attackAttrToUse.frameRate}
                            scaleX={attackAttrToUse.scale}
                            scaleY={attackAttrToUse.scale}
                        />
                    }
                </Layer>
            </Stage>
        </BattleLoader>
    );
};

export default BattleCanvas;