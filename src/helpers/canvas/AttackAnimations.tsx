import React, { useEffect, useRef } from 'react';
import { Sprite } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { SHOP_ITEM_NAMES } from '../../constants/ShopItems';
import attackSheet from '../../graphics/canvas_sprites/attack-spritesheet.webp';
import type { EnemySpecialAttackType } from '../../types';
import { useSpriteAnimation } from '../functions/useSpriteAnimation';

// Interface for the attributes of an attack animation.
// An animation attribute defines the position (x/y), animation type, 
// frame rate, and scale of an attack animation.
export interface AnimAttr {
    x: number;
    y: number;
    anim: string;
    frameRate: number;
    scale: number;
}

interface AttackAnimationsProps {
    enemySpriteRef: React.RefObject<Konva.Sprite | null>;
    playerSpriteRef: React.RefObject<Konva.Sprite | null>;
    chocoAttr: AnimAttr;
    setChocoAttr: React.Dispatch<React.SetStateAction<AnimAttr>>;
    enemyAttr: AnimAttr;
    setEnemyAttr: React.Dispatch<React.SetStateAction<AnimAttr>>;
    playerAttack: boolean;
    enemyAttack: boolean;
    playerSpecial: boolean;
    enemySpecial: boolean;
    enemySpecialType: EnemySpecialAttackType;
    isLoading: boolean;
    alreadyPurchased: string[];
}

// Define the attack animations from the spritesheet.
const attackAnimations = {
    normalHit: [
        0, 0, 49, 60,
        62, 0, 49, 60,
        124, 0, 49, 60,
        124, 0, 49, 60,
        500, 0, 49, 60,
        500, 0, 49, 60,
        500, 0, 49, 60,
    ],
    burnHit: [
        0, 57, 49, 60,
        70, 57, 49, 60,
        137, 57, 49, 60,
        228, 57, 49, 60,
        313, 57, 49, 60,
        500, 57, 49, 60,
        500, 57, 49, 60,
        500, 57, 49, 60,
    ],
    paralysisHit: [
        0, 123, 64, 64,
        52, 125, 64, 64,
        132, 126, 64, 64,
        216, 126, 64, 64,
        306, 128, 64, 64,
        500, 128, 64, 64,
        500, 128, 64, 64,
        500, 128, 64, 64,
    ],
    instantKillHit: [
        0, 199, 64, 64,
        60, 199, 64, 64,
        126, 199, 64, 64,
        192, 199, 64, 64,
        258, 199, 64, 64,
        500, 199, 64, 64,
        500, 199, 64, 64,
        500, 199, 64, 64,
    ],
    powerHit: [
        0, 268, 64, 72,
        65, 270, 64, 72,
        155, 272, 64, 72,
        232, 266, 64, 72,
        297, 253, 64, 72,
        500, 253, 64, 72,
        500, 253, 64, 72,
        500, 253, 64, 72,
    ],
};

// Mapping of enemy special attack types to their corresponding animation names.
const enemySpecialAnimations: Record<EnemySpecialAttackType, string> = {
    power: 'powerHit',
    paralysis: 'paralysisHit',
    burn: 'burnHit',
    'instant-kill': 'instantKillHit',
};

// Component responsible for rendering attack animations for both the player and 
// enemy sprites.
const AttackAnimations: React.FC<AttackAnimationsProps> = ({
    enemySpriteRef,
    playerSpriteRef,
    chocoAttr,
    setChocoAttr,
    enemyAttr,
    setEnemyAttr,
    playerAttack,
    enemyAttack,
    playerSpecial,
    enemySpecial,
    enemySpecialType,
    isLoading,
    alreadyPurchased,
}) => {
    const hasMoogle = alreadyPurchased.includes(SHOP_ITEM_NAMES.moogle);
    const attackSpriteRef = useRef<Konva.Sprite>(null);
    const [attackSheetImg] = useImage(attackSheet);
    const specialAnimation = playerSpecial
        ? 'powerHit'
        : enemySpecial
            ? enemySpecialAnimations[enemySpecialType]
            : null;
    const renderedAttackAttr: AnimAttr = specialAnimation
        ? {
            x: playerSpecial ? 28 : 180,
            y: 78,
            anim: specialAnimation,
            frameRate: 13,
            scale: 1,
        }
        : playerAttack
            ? { x: 40, y: 105, anim: 'normalHit', frameRate: 13, scale: .7 }
            : enemyAttack
                ? { x: 190, y: 105, anim: 'normalHit', frameRate: 13, scale: .7 }
                : { x: 40, y: 105, anim: 'normalHit', frameRate: 13, scale: .7 };
    const hasAttack = playerAttack || enemyAttack || playerSpecial || enemySpecial;

    useSpriteAnimation(
        attackSpriteRef,
        renderedAttackAttr.anim,
        renderedAttackAttr.frameRate,
        attackAnimations,
        !isLoading && !!attackSheetImg && hasAttack,
        false,
    );

    useEffect(() => {
        const playerAction = playerAttack || playerSpecial;
        const enemyAction = enemyAttack || enemySpecial;
        if (!playerAction && !enemyAction) {
            return;
        }

        const isSpecialAction = playerSpecial || enemySpecial;
        const originalChocoState = chocoAttr;
        const originalEnemyState = enemyAttr;
        const targetNode = playerAction ? enemySpriteRef.current : playerSpriteRef.current;
        if (!targetNode) {
            return;
        }

        const actionTimers: number[] = [];
        const actionTweens: Konva.Tween[] = [];
        const flashSprite = new Konva.Tween({
            node: targetNode,
            opacity: 0.5,
            duration: .1,
            easing: Konva.Easings.Linear,
            onFinish: () => {
                const restoreFlash = new Konva.Tween({
                    node: targetNode,
                    opacity: 1,
                    duration: 0.01,
                    easing: Konva.Easings.Linear,
                });
                actionTweens.push(restoreFlash);
                restoreFlash.play();
            },
        });
        actionTweens.push(flashSprite);
        if (playerAction) {
            flashSprite.play();
            setChocoAttr((state) => ({
                ...state,
                x: state.x - 10,
                y: state.y - 4,
                scale: state.scale,
                anim: hasMoogle ? 'miniChocoMoogleAttack' : (isSpecialAction ? 'miniChocoSpecial' : 'miniChocoAttack'),
            }));
            setEnemyAttr((state) => ({
                ...state,
                x: state.x - 5,
                y: state.y + 1,
                scale: state.scale,
            }));
            actionTimers.push(window.setTimeout(() => {
                setChocoAttr(originalChocoState);
                setEnemyAttr(originalEnemyState);
            }, isSpecialAction ? 600 : 400));
        }

        if (enemyAction) {
            flashSprite.play();
            setChocoAttr((state) => ({
                ...state,
                x: state.x + 10,
                y: state.y,
                scale: state.scale,
                anim: hasMoogle ? 'miniChocoMoogleAttack' : (isSpecialAction ? 'miniChocoSpecial' : 'miniChocoAttack'),
            }));
            setEnemyAttr((state) => ({
                ...state,
                x: state.x + 5,
                scale: state.scale,
            }));
            actionTimers.push(window.setTimeout(() => {
                setChocoAttr(originalChocoState);
                setEnemyAttr(originalEnemyState);
            }, 400));
        }

        return () => {
            actionTimers.forEach((timer) => window.clearTimeout(timer));
            actionTweens.forEach((tween) => tween.destroy());
            setChocoAttr(originalChocoState);
            setEnemyAttr(originalEnemyState);
        };
    }, [playerAttack, enemyAttack, playerSpecial, enemySpecial]);

    return (
        <>
            {hasAttack && attackSheetImg && (
                <Sprite
                    ref={attackSpriteRef}
                    x={renderedAttackAttr.x}
                    y={renderedAttackAttr.y}
                    image={attackSheetImg}
                    animation={renderedAttackAttr.anim}
                    animations={attackAnimations}
                    frameRate={renderedAttackAttr.frameRate}
                    scaleX={renderedAttackAttr.scale}
                    scaleY={renderedAttackAttr.scale}
                />
            )}
        </>
    );
};

export default AttackAnimations;
