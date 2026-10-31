import React, { useEffect, useRef, useState } from 'react';
import { Layer, Sprite, Stage } from 'react-konva';
import useImage from 'use-image';
import chocoSheet from '../../graphics/canvas_sprites/chocobo-spritesheet.png';
import enemySheet from '../../graphics/canvas_sprites/enemy-spritesheet.png';
import type { BattleCanvasProps, BattleEnemyId } from '../../types';
import '../../../styles/components/battle-canvas.scss';
import BattleLoader from '../components/BattleLoader';
import { useSpriteAnimation } from '../functions/useSpriteAnimation';
import Konva from 'konva';
import AttackAnimations, { type AnimAttr } from './AttackAnimations';

const BattleCanvas: React.FC<BattleCanvasProps> = (props: BattleCanvasProps) => {
    // Destructure props for ease of access & documentation
    const {
        selectedEnemyLevel,
        enemyId,
        isLoading,
        playerAttack,
        enemyAttack,
        playerSpecial,
        enemySpecial,
        enemySpecialType,
        playerRunning,
        paralysisTurns,
        burnTurns,
        escapeComplete,
        battleResult,
        setIsLoading,
    } = props;
    const statusTint = burnTurns > 0
        ? 'rgba(255, 0, 0, 0.6)'
        : paralysisTurns > 0
            ? 'rgba(255, 215, 0, 0.6)'
            : null;

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
    const enemySpriteIndexes: Record<BattleEnemyId, number> = {
        cactuar: 0,
        flan: 1,
        mu: 2,
        leapFrog: 3,
        bomb: 4,
        deepEye: 5,
        goldCactuar: 6,
        tonberry: 7,
        magicPot: 8,
        blackChocobo: 9,
        mysteryBox: 10,
        ahriman: 11,
        ifrit: 12,
        malboro: 13,
        ultros: 14,
    };

    const stageRef = useRef<Konva.Stage>(null);
    const spriteRef1 = useRef<Konva.Sprite>(null);
    const spriteRef2 = useRef<Konva.Sprite>(null);

    const [chocoSheetImg] = useImage(chocoSheet);
    const [enemySheetImg] = useImage(enemySheet);
    const [tintedChocoSheetImg, setTintedChocoSheetImg] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!chocoSheetImg || !statusTint) {
            setTintedChocoSheetImg(null);
            return;
        }

        const tintedSheet = document.createElement('canvas');
        tintedSheet.width = chocoSheetImg.width;
        tintedSheet.height = chocoSheetImg.height;
        const context = tintedSheet.getContext('2d');
        if (!context) {
            throw new Error('Unable to create the Chocobo status tint canvas.');
        }

        context.drawImage(chocoSheetImg, 0, 0);
        context.globalCompositeOperation = 'source-atop';
        context.fillStyle = statusTint;
        context.fillRect(0, 0, tintedSheet.width, tintedSheet.height);
        const tintedImage = new Image();
        tintedImage.onload = () => setTintedChocoSheetImg(tintedImage);
        tintedImage.onerror = () => {
            console.error('Unable to load the tinted Chocobo sprite sheet.');
        };
        tintedImage.src = tintedSheet.toDataURL();

        return () => {
            tintedImage.onload = null;
        };
    }, [chocoSheetImg, statusTint]);

    const [chocoAttrToUse, setChocoAttrToUse] = useState<AnimAttr>({x: 190, y: 110, anim: 'miniChocoStand', frameRate: 5, scale: .6});
    const getEnemyAnimation = (id: BattleEnemyId): AnimAttr =>
        enemyAttrs[enemySpriteIndexes[id] ?? enemySpriteIndexes.cactuar];
    const [enemyAttrToUse, setEnemyAttrToUse] = useState<AnimAttr>(() => getEnemyAnimation(enemyId));

    useEffect(() => {
        setEnemyAttrToUse(getEnemyAnimation(enemyId));
    }, [enemyId]);

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

    }).current;

    // Battle sprites use the custom loop so one-frame and multi-frame definitions never enter invalid indexes.
    useSpriteAnimation(spriteRef1, enemyAttrToUse.anim, enemyAttrToUse.frameRate, animations, !isLoading && !!enemySheetImg);
    useSpriteAnimation(spriteRef2, chocoAttrToUse.anim, chocoAttrToUse.frameRate, animations, !isLoading && !!chocoSheetImg);

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

    useEffect(() => {
        if (!playerRunning) {
            return;
        }

        const playerSprite = spriteRef2.current;
        if (!playerSprite) {
            return;
        }

        const leaveBattlefield = new Konva.Tween({
            node: playerSprite,
            x: 320,
            duration: 0.65,
            easing: Konva.Easings.EaseIn,
        });
        leaveBattlefield.play();

        return () => {
            leaveBattlefield.destroy();
        };
    }, [playerRunning]);

    // When enemy attacks, change their x value by +10
    return (
        <BattleLoader selectedEnemyLevel={selectedEnemyLevel} isLoading={isLoading} setIsLoading={setIsLoading}>
            <Stage id='BattleStage' className='battle-canvas' height={248} width={256} ref={stageRef}>
                <Layer id='BattleLayer'>
                    {/* Enemy Sprite: */}
                    {enemySheetImg && <Sprite
                        id='Enemy'
                        ref={spriteRef1}
                        x={enemyAttrToUse.x}
                        y={enemyAttrToUse.y}
                        image={enemySheetImg}
                        animation={enemyAttrToUse.anim}
                        animations={animations}
                        frameRate={enemyAttrToUse.frameRate}
                        scaleX={enemyAttrToUse.scale}
                        scaleY={enemyAttrToUse.scale}
                        
                    />}

                    {/* Chocobo Sprite */}
                    {chocoSheetImg && !escapeComplete && <Sprite
                        ref={spriteRef2}
                        x={chocoAttrToUse.x + (playerRunning ? 80 * chocoAttrToUse.scale : 0)}
                        y={chocoAttrToUse.y}
                        image={tintedChocoSheetImg ?? chocoSheetImg}
                        animation={chocoAttrToUse.anim}
                        animations={animations}
                        frameRate={chocoAttrToUse.frameRate}
                        scaleX={playerRunning ? -chocoAttrToUse.scale : chocoAttrToUse.scale}
                        scaleY={chocoAttrToUse.scale}
                    />}

                    <AttackAnimations
                        stageRef={stageRef}
                        enemySpriteRef={spriteRef1}
                        playerSpriteRef={spriteRef2}
                        chocoAttr={chocoAttrToUse}
                        setChocoAttr={setChocoAttrToUse}
                        enemyAttr={enemyAttrToUse}
                        setEnemyAttr={setEnemyAttrToUse}
                        playerAttack={playerAttack}
                        enemyAttack={enemyAttack}
                        playerSpecial={playerSpecial}
                        enemySpecial={enemySpecial}
                        enemySpecialType={enemySpecialType}
                        isLoading={isLoading}
                    />
                </Layer>
            </Stage>
        </BattleLoader>
    );
};

export default BattleCanvas;