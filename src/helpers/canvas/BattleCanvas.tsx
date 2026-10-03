import React, { useEffect, useRef, useState } from 'react';
import { Circle, Group, Layer, Ring, Sprite, Stage, Star } from 'react-konva';
import useImage from 'use-image';
import chocoSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png';
import enemySheet from '../../graphics/canvas_sprites/enemy-spritesheet.png';
import attackSheet from '../../graphics/canvas_sprites/attack-spritesheet.png';
import { BattleCanvasProps } from '../../types';
import '../../../styles/components/battle-canvas.scss';
import BattleLoader from '../components/BattleLoader';
import { useSpriteAnimation } from '../functions/useSpriteAnimation';
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
        selectedEnemyLevel,
        isLoading,
        playerAttack,
        enemyAttack,
        playerSpecial,
        enemySpecial,
        playerRunning,
        battleResult,
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
    const specialImpactRefs = [useRef<any>(null), useRef<any>(null), useRef<any>(null)];

    const [chocoSheetImg] = useImage(chocoSheet);
    const [enemySheetImg] = useImage(enemySheet);
    const [attackSheetImg] = useImage(attackSheet);

    const [chocoAttrToUse, setChocoAttrToUse] = useState<AnimAttr>({x: 190, y: 110, anim: 'miniChocoStand', frameRate: 5, scale: .6});
    const [enemyAttrToUse, setEnemyAttrToUse] = useState<AnimAttr>(enemyAttrs[determineEnemy()]);
    const [attackAttrToUse, setAttackAttrToUse] = useState<AnimAttr>({x: 40, y: 105, anim: 'normalHit', frameRate: 13, scale: .7});

    // The actual animations used pulled from the Chocobo Spritesheet
    const animations = useRef({
        // Chocobo:
        miniChocoStand: [
            299, 918, 80, 80,     // frame 1
            405, 918, 80, 80,     // frame 2
        ],
        miniChocoAttack: [
            405, 918, 80, 80,     // frame 1
        ],
        miniChocoSpecial: [
            405, 918, 80, 80,
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
            124, 0, 49, 60,
        ],
    }).current;

    // Battle sprites use the custom loop so one-frame and multi-frame definitions never enter invalid indexes.
    useSpriteAnimation(spriteRef1, enemyAttrToUse.anim, enemyAttrToUse.frameRate, animations, !isLoading);
    useSpriteAnimation(spriteRef2, chocoAttrToUse.anim, chocoAttrToUse.frameRate, animations, !isLoading);
    useSpriteAnimation(
        spriteRef3,
        attackAttrToUse.anim,
        attackAttrToUse.frameRate,
        animations,
        !isLoading && (playerAttack || enemyAttack) && !playerSpecial && !enemySpecial,
    );

    useEffect(() => {
        const playerAction = playerAttack || playerSpecial;
        const enemyAction = enemyAttack || enemySpecial;
        if (!playerAction && !enemyAction) {
            return;
        }

        const isSpecialAction = playerSpecial || enemySpecial;
        const ogChocoState = chocoAttrToUse;
        const ogEnemyState = enemyAttrToUse;
        const targetNode = playerAction ? spriteRef1.current : spriteRef2.current;

        if (!targetNode) {
            return;
        }

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

        if (playerAction) {
            setAttackAttrToUse(isSpecialAction ? { ...attackAttrs[0], x: 28, y: 78, scale: 1.25 } : attackAttrs[0]);
            flashSprite.play();

            setChocoAttrToUse(prevState => ({
                ...prevState,
                x: prevState.x - (isSpecialAction ? 24 : 10),
                y: prevState.y - (isSpecialAction ? 12 : 4),
                scale: prevState.scale + (isSpecialAction ? .12 : 0),
                anim: isSpecialAction ? 'miniChocoSpecial' : 'miniChocoAttack'
            }));

            setEnemyAttrToUse(prevState => ({
                ...prevState,
                x: prevState.x - (isSpecialAction ? 12 : 5),
                y: prevState.y + (isSpecialAction ? 5 : 1),
                scale: prevState.scale - (isSpecialAction ? .12 : .05)
            }));

            setTimeout(() => {
                setChocoAttrToUse(ogChocoState);
                setEnemyAttrToUse(ogEnemyState);
                flashSprite.destroy();
            }, isSpecialAction ? 600 : 400);
        }

        if (enemyAction) {
            setAttackAttrToUse(isSpecialAction ? { ...attackAttrs[1], x: 174, y: 78, scale: 1.25 } : attackAttrs[1]);
            flashSprite.play();

            setChocoAttrToUse(prevState => ({
                ...prevState,
                x: prevState.x + (isSpecialAction ? 20 : 10),
                y: prevState.y + (isSpecialAction ? 8 : 0),
                scale: prevState.scale + (isSpecialAction ? .1 : 0),
                anim: isSpecialAction ? 'miniChocoSpecial' : 'miniChocoAttack'
            }));

            setEnemyAttrToUse(prevState => ({
                ...prevState,
                x: prevState.x + (isSpecialAction ? 12 : 5),
                y: prevState.y,
                scale: prevState.scale + (isSpecialAction ? .12 : .05)
            }));

            setTimeout(() => {
                setChocoAttrToUse(ogChocoState);
                setEnemyAttrToUse(ogEnemyState);
                flashSprite.destroy();
            }, 400);
        }
    }, [playerAttack, enemyAttack, playerSpecial, enemySpecial]);

    useEffect(() => {
        if (!playerSpecial && !enemySpecial) {
            return;
        }

        const stageNode = stageRef.current;
        const impactNodes = specialImpactRefs.map((impactRef) => impactRef.current);

        if (impactNodes.some((impactNode) => !impactNode) || !stageNode) {
            return;
        }

        const impactTweens: Konva.Tween[] = [];
        const impactTimers = impactNodes.map((impactNode, index) => {
            impactNode.opacity(0);
            impactNode.scale({ x: 0.3, y: 0.3 });
            impactNode.rotation(0);

            return window.setTimeout(() => {
                impactNodes[index].opacity(0.95);
                const impactTween = new Konva.Tween({
                    node: impactNode,
                    opacity: 0,
                    scaleX: [1.15, 1.55, 1.3][index],
                    scaleY: [1.15, 1.55, 1.3][index],
                    rotation: index % 2 === 0 ? 45 : -35,
                    duration: 0.32,
                    easing: Konva.Easings.EaseOut,
                });
                impactTweens[index] = impactTween;
                impactTween.play();
            }, index * 180);
        });

        const shakeTween = new Konva.Tween({
            node: stageNode,
            x: playerSpecial ? -4 : 4,
            duration: 0.06,
            easing: Konva.Easings.Linear,
            onFinish: () => {
                new Konva.Tween({
                    node: stageNode,
                    x: 0,
                    duration: 0.18,
                    easing: Konva.Easings.EaseOut,
                }).play();
            },
        });
        shakeTween.play();

        return () => {
            impactTimers.forEach((impactTimer) => window.clearTimeout(impactTimer));
            impactTweens.forEach((impactTween) => impactTween?.destroy());
            shakeTween.destroy();
            stageNode.x(0);
        };
    }, [playerSpecial, enemySpecial]);

    useEffect(() => {
        if (!battleResult) { return; }

        const targetNode = battleResult === 'victory' ? spriteRef1.current : spriteRef2.current;

        if (!targetNode) { return; }

        const fadeSprite = new Konva.Tween({
            node: targetNode,
            opacity: 0,
            duration: 1,
            easing: Konva.Easings.EaseIn,
        });

        fadeSprite.play();

        return () => fadeSprite.destroy();
    }, [battleResult]);

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

                    {/* Regular attack effect; Special uses only the burst below. */}

                    {
                        (playerAttack || enemyAttack) && !playerSpecial && !enemySpecial &&
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

                    {(playerSpecial || enemySpecial) &&
                        <Group listening={false}>
                            <Group
                                ref={specialImpactRefs[0]}
                                x={attackAttrToUse.x + 10}
                                y={attackAttrToUse.y + 38}
                                listening={false}
                            >
                                <Star
                                    numPoints={10}
                                    innerRadius={14}
                                    outerRadius={34}
                                    fill='#ffd34e'
                                    stroke='#fff4ae'
                                    strokeWidth={2}
                                />
                                <Ring
                                    innerRadius={18}
                                    outerRadius={22}
                                    stroke='#fff4ae'
                                    strokeWidth={2}
                                />
                                <Circle radius={11} fill='#fff4ae' opacity={0.8} />
                            </Group>
                            <Group
                                ref={specialImpactRefs[1]}
                                x={attackAttrToUse.x + 24}
                                y={attackAttrToUse.y + 22}
                                listening={false}
                            >
                                <Star
                                    numPoints={14}
                                    innerRadius={22}
                                    outerRadius={58}
                                    fill='#ffb52e'
                                    stroke='#fff4ae'
                                    strokeWidth={2}
                                />
                                <Ring
                                    innerRadius={30}
                                    outerRadius={36}
                                    stroke='#fff4ae'
                                    strokeWidth={2}
                                />
                                <Circle radius={17} fill='#fff4ae' opacity={0.8} />
                            </Group>
                            <Group
                                ref={specialImpactRefs[2]}
                                x={attackAttrToUse.x + 38}
                                y={attackAttrToUse.y + 34}
                                listening={false}
                            >
                                <Star
                                    numPoints={12}
                                    innerRadius={17}
                                    outerRadius={44}
                                    fill='#ffd34e'
                                    stroke='#fff4ae'
                                    strokeWidth={2}
                                />
                                <Ring
                                    innerRadius={23}
                                    outerRadius={28}
                                    stroke='#fff4ae'
                                    strokeWidth={2}
                                />
                                <Circle radius={13} fill='#fff4ae' opacity={0.8} />
                            </Group>
                        </Group>
                    }
                </Layer>
            </Stage>
        </BattleLoader>
    );
};

export default BattleCanvas;