import React from "react";
import type { BattleEnemyId, EnemySpecialAttackType } from "../../../types";

export interface EnemyInformation {
    id: BattleEnemyId;
    name: string;
    sprite: string;
    power: number;
    defense: number;
    speed: number;
    health: number;
    specialAttack: EnemySpecialAttackType;
    difficultyLevel: number; // 1 (easy) -> 5 (difficult) 
}

export type { EnemySpecialAttackType } from "../../../types";

export type BattleTurn = 'player' | 'enemy';

const ATTACK_ANIMATION_DELAY = 400;
const ENEMY_RESPONSE_DELAY = 700;
const PLAYER_ACTION_DELAY = 700;

const ENEMIES_BY_DIFFICULTY: Record<number, BattleEnemyId[]> = {
    1: ['cactuar', 'flan', 'mu'],
    2: ['leapFrog', 'bomb', 'deepEye'],
    3: ['goldCactuar', 'tonberry', 'magicPot'],
    4: ['blackChocobo', 'mysteryBox', 'ahriman'],
    5: ['ifrit', 'malboro', 'ultros'],
};

const ENEMY_NAMES: Record<BattleEnemyId, string> = {
    cactuar: 'Cactuar',
    flan: 'Flan',
    mu: 'Mu',
    leapFrog: 'Leap Frog',
    bomb: 'Bomb',
    deepEye: 'Deep Eye',
    goldCactuar: 'Gold Cactuar',
    tonberry: 'Tonberry',
    magicPot: 'Magic Pot',
    blackChocobo: 'Black Chocobo',
    mysteryBox: 'Mystery Box',
    ahriman: 'Ahriman',
    ifrit: 'Ifrit',
    malboro: 'Malboro',
    ultros: 'Ultros',
};

// Edit this table to assign special attacks to individual enemy sprites.
// Available values: 'power', 'paralysis', 'burn', and 'instant-kill'.
export const ENEMY_SPECIAL_ATTACKS: Record<BattleEnemyId, EnemySpecialAttackType> = {
    cactuar: 'paralysis',
    flan: 'power',
    mu: 'power',
    leapFrog: 'power',
    bomb: 'burn',
    deepEye: 'paralysis',
    goldCactuar: 'paralysis',
    tonberry: 'instant-kill',
    magicPot: 'power',
    blackChocobo: 'power',
    mysteryBox: 'power',
    ahriman: 'paralysis',
    ifrit: 'burn',
    malboro: 'paralysis',
    ultros: 'power',
};

// Used to modify damage and enemy stats based on difficulty level.
// Generally keeps values from getting out of hand.
const determineLevelScale = (difficulty: number) => {
    switch (difficulty) {
        case 1:
            return 1;
        case 2:
            return .9;
        case 3:
            return .8;
        case 4:
            return .7;
        case 5:
            return 0;
        default:
            return 1;
    }
};

// Generates an enemy with stats based on the difficulty level of the battle
export const createEnemyForDifficulty = (difficultyLevel: number): EnemyInformation => {
    const clampedDifficulty = Math.min(Math.max(difficultyLevel, 1), 5);
    const enemyId = ENEMIES_BY_DIFFICULTY[clampedDifficulty][
        Math.floor(Math.random() * ENEMIES_BY_DIFFICULTY[clampedDifficulty].length)
    ];

    // Currently set to generate a random number between 1-2 at a single decimal point
    const randomPwrMod = Math.max(1, (Math.round(((Math.random() * 2)) * 10) / 10));
    const randomDefMod = Math.max(1, (Math.round(((Math.random() * 2)) * 10) / 10));
    const randomSpdMod = Math.max(1, (Math.round(((Math.random() * 2)) * 10) / 10));
    const randomHealthMod = Math.round((Math.random() * (clampedDifficulty * 10)) + (clampedDifficulty * 20));
    const difficultyBaseStatIncrease = clampedDifficulty > 1 ? (clampedDifficulty/2) : 0;
    const levelScaleDecrease = determineLevelScale(clampedDifficulty);

    const enemyInfo = {
        id: enemyId,
        name: ENEMY_NAMES[enemyId],
        sprite: enemyId,
        power: Math.max(.75, Math.min(10, clampedDifficulty * randomPwrMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        defense: Math.max(.75, Math.min(10, clampedDifficulty * randomDefMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        speed: Math.max(.75, Math.min(10, clampedDifficulty * randomSpdMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        health: clampedDifficulty === 5 ? 170 : 10 + randomHealthMod,
        specialAttack: ENEMY_SPECIAL_ATTACKS[enemyId],
        difficultyLevel: clampedDifficulty,
    };

    console.log('Enemy Info: ', enemyInfo);

    return enemyInfo;
};

// Calculates damage based on attack power and target defense
export const calculateDamage = (attackPower: number, targetDefense: number, difficulty: number): number => {
    const calcConst = 5;
    const damageUnits = 5;
    const levelScaling = determineLevelScale(difficulty);
    const variation = (Math.random() * (attackPower + 1)) || 1;
    const damage = Math.round((((attackPower * (10 / (calcConst + targetDefense))) * damageUnits) + variation) * (levelScaling || 1));
    
    return damage;
};

// Handles whether the player or enemy acts first on a turn
// Calculates using speed and happiness modifiers
export const turnOrderFunction = (
    currentSpeed: number,
    currentHappiness: number,
    enemyInfo: EnemyInformation,
): BattleTurn => {
    const happinessModifier = currentHappiness >= 70 ? 1.2 : currentHappiness <= 30 ? 0.8 : 1;
    const playerBattleSpeed = currentSpeed * happinessModifier;
    const speedVariation = Math.min(2, Math.random() * (currentSpeed/4));
    const totalBattleSpeed = playerBattleSpeed + speedVariation;

    return totalBattleSpeed >= enemyInfo.speed ? 'player' : 'enemy';
};

interface EnemyAttackOptions {
    setEnemyAttack: React.Dispatch<React.SetStateAction<boolean>>;
    setEnemySpecial: React.Dispatch<React.SetStateAction<boolean>>;
    setBattleLocked: React.Dispatch<React.SetStateAction<boolean>>;
    setBattleMessage: React.Dispatch<React.SetStateAction<string>>;
    setCurrentHealth: React.Dispatch<React.SetStateAction<number>>;
    setDamageToPlayer: React.Dispatch<React.SetStateAction<number>>;
    setSpecialCharge: React.Dispatch<React.SetStateAction<number>>;
    setParalysisTurns: React.Dispatch<React.SetStateAction<number>>;
    setBurnTurns: React.Dispatch<React.SetStateAction<number>>;
    applyParalysis?: boolean;
    currentHealth: number;
    currentDefense: number;
    enemyInfo: EnemyInformation;
    specialChargeGainMultiplier?: number;
    onComplete: (result: 'defeat' | null, paralyzed: boolean, remainingHealth: number) => void;
}

// Resolves every enemy attack so special attacks can occur on any enemy action.
export const enemyAttackFunction = (options: EnemyAttackOptions) => {
    const {
        setEnemyAttack,
        setEnemySpecial,
        setBattleLocked,
        setBattleMessage,
        setCurrentHealth,
        setDamageToPlayer,
        setSpecialCharge,
        setParalysisTurns,
        setBurnTurns,
        applyParalysis = true,
        currentHealth,
        currentDefense,
        enemyInfo,
        specialChargeGainMultiplier = 1,
        onComplete,
    } = options;
    setBattleLocked(true);
    const usesSpecial = Math.random() < enemyInfo.difficultyLevel * 0.05;
    const specialType = usesSpecial ? enemyInfo.specialAttack : null;
    const criticalHit = Math.random() < ((enemyInfo.speed / 2) / 10);
    const baseDamage = calculateDamage(enemyInfo.power, currentDefense, enemyInfo.difficultyLevel);
    const specialDmgModifier = specialType === 'power' ? 1.75 : 1.25;
    const attackDamage = usesSpecial ? baseDamage * specialDmgModifier : baseDamage;
    const instantlyKills = usesSpecial && specialType === 'instant-kill' && Math.random() < 0.1;
    const damage = instantlyKills
        ? currentHealth
        : Math.round(criticalHit ? attackDamage * 1.25 : attackDamage);
    const remainingHealth = Math.max(currentHealth - damage, 0);

    setEnemyAttack(!usesSpecial);
    setEnemySpecial(usesSpecial);
    setDamageToPlayer(damage);
    setSpecialCharge((charge) => Math.min(charge + damage * specialChargeGainMultiplier, 100));
    setCurrentHealth(remainingHealth);

    if (specialType === 'power') {
        setBattleMessage(`${enemyInfo.name} uses a truly powerful attack!`);
    } else if (specialType === 'paralysis') {
        if (applyParalysis) {
            const turns = 1 + Math.floor(Math.random() * 3);
            console.log('Paralysis turns: ', turns);
            setParalysisTurns((current) => Math.max(current, turns));
        }
        setBattleMessage(`${enemyInfo.name} paralyzes you!`);
    } else if (specialType === 'burn') {
        const turns = 1 + Math.floor(Math.random() * 5);
        setBurnTurns((current) => Math.max(current, turns));
        setBattleMessage(`${enemyInfo.name} burns you!`);
    } else if (instantlyKills) {
        setBattleMessage(`${enemyInfo.name}'s lands a OHKO!`);
    } else if (specialType === 'instant-kill') {
        setBattleMessage(`${enemyInfo.name} attempts to OHKO and fails...`);
    }

    window.setTimeout(() => {
        setEnemyAttack(false);
        setEnemySpecial(false);
        onComplete(remainingHealth === 0 ? 'defeat' : null, specialType === 'paralysis', remainingHealth);
    }, specialType ? ATTACK_ANIMATION_DELAY + 200 : ATTACK_ANIMATION_DELAY);
};

// Handles the calculation of damage from an attack
export const attackFunction = (
    options: {
        setPlayerAttack: React.Dispatch<React.SetStateAction<boolean>>;
        setEnemyAttack: React.Dispatch<React.SetStateAction<boolean>>;
        setEnemySpecial: React.Dispatch<React.SetStateAction<boolean>>;
        setBattleLocked: React.Dispatch<React.SetStateAction<boolean>>;
        setBattleMessage: React.Dispatch<React.SetStateAction<string>>;
        setCurrentHealth: React.Dispatch<React.SetStateAction<number>>;
        setEnemyHealth: React.Dispatch<React.SetStateAction<number>>;
        setParalysisTurns: React.Dispatch<React.SetStateAction<number>>;
        setBurnTurns: React.Dispatch<React.SetStateAction<number>>;
        currentPower: number;
        currentDefense: number;
        currentHealth: number;
        currentSpeed: number;
        currentHappiness: number;
        currentEnemyHealth: number;
        enemyInfo: EnemyInformation;
        onComplete: (result: 'victory' | 'defeat') => void;
        onTurnComplete?: (remainingHealth: number) => boolean;
        setDamageToEnemy: React.Dispatch<React.SetStateAction<number>>;
        setDamageToPlayer: React.Dispatch<React.SetStateAction<number>>;
        setSpecialCharge: React.Dispatch<React.SetStateAction<number>>;
    },
) => {
    const {
        setPlayerAttack,
        setEnemyAttack,
        setEnemySpecial,
        setBattleLocked,
        setBattleMessage,
        setCurrentHealth,
        setEnemyHealth,
        setParalysisTurns,
        setBurnTurns,
        currentPower,
        currentDefense,
        currentHealth,
        currentSpeed,
        currentHappiness,
        currentEnemyHealth,
        enemyInfo,
        onComplete,
        onTurnComplete,
        setDamageToEnemy,
        setDamageToPlayer,
        setSpecialCharge,
    } = options;
    const firstTurn = turnOrderFunction(currentSpeed, currentHappiness, enemyInfo);
    let enemyDefeated = currentEnemyHealth <= 0;
    const finishTurn = (remainingHealth: number) => {
        if (onTurnComplete?.(remainingHealth)) {
            onComplete('defeat');
            return;
        }
        setBattleLocked(false);
    };

    // Triggers player attack animation and calculates damage to the enemy
    const performPlayerAttack = (onFinished?: (remainingHealth: number) => void, remainingHealth = currentHealth) => {
        setPlayerAttack(true);
        const criticalHit = Math.random() < ((currentSpeed/2)/10);
        const initDamage = calculateDamage(currentPower, enemyInfo.defense, enemyInfo.difficultyLevel);
        const finalDamage = Math.round(criticalHit ? initDamage * 1.25 : initDamage);
        
        setDamageToEnemy(finalDamage);
        const remainingEnemyHealth = Math.max(currentEnemyHealth - finalDamage, 0);
        enemyDefeated = remainingEnemyHealth === 0;
        setEnemyHealth(remainingEnemyHealth);

        setTimeout(() => {
            setPlayerAttack(false);

            if (remainingEnemyHealth === 0) {
                onComplete('victory');
                return;
            }

            if (onFinished) {
                setTimeout(() => onFinished(remainingHealth), ENEMY_RESPONSE_DELAY);
            } else {
                finishTurn(remainingHealth);
            }
        }, ATTACK_ANIMATION_DELAY);
    };

    // Triggers enemy attack animation and calculates damage to the player
    const performEnemyAttack = (
        onFinished?: (remainingHealth: number) => void,
        remainingHealth = currentHealth,
    ) => {
        if (enemyDefeated) {
            setBattleLocked(false);
            return;
        }

        enemyAttackFunction({
            setEnemyAttack,
            setEnemySpecial,
            setBattleLocked,
            setBattleMessage,
            setCurrentHealth,
            setDamageToPlayer,
            setSpecialCharge,
            setParalysisTurns,
            setBurnTurns,
            currentHealth: remainingHealth,
            currentDefense,
            enemyInfo,
            onComplete: (result, paralyzed, healthAfterAttack) => {
                if (result) {
                    onComplete(result);
                    return;
                }
                if (paralyzed) {
                    if (onFinished) {
                        setParalysisTurns((turns) => Math.max(0, turns - 1));
                    }
                    finishTurn(healthAfterAttack);
                    return;
                }
                if (onFinished) {
                    window.setTimeout(() => onFinished(healthAfterAttack), PLAYER_ACTION_DELAY);
                } else {
                    finishTurn(healthAfterAttack);
                }
            },
        });
    };

    if (firstTurn === 'player') {
        performPlayerAttack((health) => performEnemyAttack(undefined, health));
        return;
    }
    performEnemyAttack((health) => performPlayerAttack(undefined, health));
};

// Handles the calculation of damage/the result of a special action
export const specialFunction = (options: {
    setPlayerSpecial: React.Dispatch<React.SetStateAction<boolean>>;
    setEnemyAttack: React.Dispatch<React.SetStateAction<boolean>>;
    setEnemySpecial: React.Dispatch<React.SetStateAction<boolean>>;
    setBattleLocked: React.Dispatch<React.SetStateAction<boolean>>;
    setBattleMessage: React.Dispatch<React.SetStateAction<string>>;
    setCurrentHealth: React.Dispatch<React.SetStateAction<number>>;
    setEnemyHealth: React.Dispatch<React.SetStateAction<number>>;
    setSpecialCharge: React.Dispatch<React.SetStateAction<number>>;
    setDamageToEnemy: React.Dispatch<React.SetStateAction<number>>;
    setDamageToPlayer: React.Dispatch<React.SetStateAction<number>>;
    setParalysisTurns: React.Dispatch<React.SetStateAction<number>>;
    setBurnTurns: React.Dispatch<React.SetStateAction<number>>;
    onTurnComplete?: (remainingHealth: number) => boolean;
    currentPower: number;
    currentDefense: number;
    currentSpeed: number;
    currentHealth: number;
    currentEnemyHealth: number;
    enemyInfo: EnemyInformation;
    onComplete: (result: 'victory' | 'defeat') => void;
}) => {
    const {
        setPlayerSpecial,
        setEnemyAttack,
        setEnemySpecial,
        setBattleLocked,
        setBattleMessage,
        setCurrentHealth,
        setEnemyHealth,
        setSpecialCharge,
        setDamageToEnemy,
        setDamageToPlayer,
        setParalysisTurns,
        setBurnTurns,
        onTurnComplete,
        currentPower,
        currentDefense,
        currentSpeed,
        currentHealth,
        currentEnemyHealth,
        enemyInfo,
        onComplete,
    } = options;
    const criticalHit = Math.random() < ((currentSpeed / 2) / 10);
    const initDamage = calculateDamage(currentPower, enemyInfo.defense, enemyInfo.difficultyLevel) * 2;
    const finalDamage = Math.round(criticalHit ? initDamage * 1.25 : initDamage);
    const remainingEnemyHealth = Math.max(currentEnemyHealth - finalDamage, 0);

    setPlayerSpecial(true);
    setDamageToEnemy(finalDamage);
    setEnemyHealth(remainingEnemyHealth);

    setTimeout(() => {
        setPlayerSpecial(false);
        if (remainingEnemyHealth === 0) {
            setBattleLocked(false);
            onComplete('victory');
            return;
        }

        setTimeout(() => enemyAttackFunction({
            setEnemyAttack,
            setEnemySpecial,
            setBattleLocked,
            setBattleMessage,
            setCurrentHealth,
            setDamageToPlayer,
            setSpecialCharge,
            setParalysisTurns,
            setBurnTurns,
            currentHealth,
            currentDefense,
            enemyInfo,
            specialChargeGainMultiplier: 1 / 3,
            onComplete: (result, _paralyzed, remainingHealth) => {
                if (result) {
                    onComplete(result);
                } else if (onTurnComplete?.(remainingHealth)) {
                    onComplete('defeat');
                } else {
                    setBattleLocked(false);
                }
            },
        }), ENEMY_RESPONSE_DELAY);
    }, ATTACK_ANIMATION_DELAY + 200);
};

// When trying to run from battle, either leave safely or give the enemy a free attack.
export const escapeFunction = (options: {
    setPlayerRunning: React.Dispatch<React.SetStateAction<boolean>>;
    setBattleLocked: React.Dispatch<React.SetStateAction<boolean>>;
    setBattleMessage: React.Dispatch<React.SetStateAction<string>>;
    setEnemyAttack: React.Dispatch<React.SetStateAction<boolean>>;
    setEnemySpecial: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentHealth: React.Dispatch<React.SetStateAction<number>>;
    setDamageToPlayer: React.Dispatch<React.SetStateAction<number>>;
    setSpecialCharge: React.Dispatch<React.SetStateAction<number>>;
    setParalysisTurns: React.Dispatch<React.SetStateAction<number>>;
    setBurnTurns: React.Dispatch<React.SetStateAction<number>>;
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>;
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>;
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>;
    currentSpeed: number;
    currentHealth: number;
    currentDefense: number;
    enemyInfo: EnemyInformation;
    difficultyLevel: number;
    onEscapeSuccess: () => void;
    onComplete: (result: 'victory' | 'defeat') => void;
    onTurnComplete?: (remainingHealth: number) => boolean;
}) => {
    const {
        setPlayerRunning,
        setBattleLocked,
        setBattleMessage,
        setEnemyAttack,
        setEnemySpecial,
        setCurrentHealth,
        setDamageToPlayer,
        setSpecialCharge,
        setParalysisTurns,
        setBurnTurns,
        setCurrentEnergy,
        setCurrentHunger,
        setCurrentHappiness,
        currentSpeed,
        currentHealth,
        currentDefense,
        enemyInfo,
        difficultyLevel,
        onEscapeSuccess,
        onComplete,
        onTurnComplete,
    } = options;

    // Randomly generate hunger, happiness loss, and energy changes based on difficulty level.
    // These apply on a successful escape.
    const randomHungerGain = (3*difficultyLevel) + Math.floor(Math.random() * 5);
    const randomHappinessLoss = (3*difficultyLevel) + Math.floor(Math.random() * 5);
    const randomEnergyLoss = (5*difficultyLevel) + Math.floor(Math.random() * 10);

    // Calculate escape chance based on player speed and enemy speed.
    // Escape chance is between 10% and 80%.
    const escapeChance = Math.min(.8, Math.max(0.1, currentSpeed / (enemyInfo.speed * 1.5)));
    const escapeSuccess = Math.random() < escapeChance;

    setPlayerRunning(true);
    setBattleLocked(true);

    // On successful escape, display a message and call the onEscapeSuccess callback 
    // after a short delay.
    if (escapeSuccess) {
        setBattleMessage('Escape successful! You got away safely.');
        window.setTimeout(() => {
            setPlayerRunning(false);
            setBattleLocked(false);
            setCurrentHunger((prevHunger: number) => Math.min(prevHunger + randomHungerGain, 100));
            setCurrentHappiness((prevHappy: number) => Math.max(prevHappy - randomHappinessLoss, 0));
            setCurrentEnergy((prevEnergy: number) => Math.max(prevEnergy - randomEnergyLoss, 0));
            onEscapeSuccess();
        }, 800);
        return;
    }

    // On failed escape, display a failure message and trigger the enemy's 
    // counterattack after a short delay.
    setBattleMessage('Escape failed! The enemy attacks!');
    window.setTimeout(() => {
        setPlayerRunning(false);
        enemyAttackFunction({
            setEnemyAttack,
            setEnemySpecial,
            setBattleLocked,
            setBattleMessage,
            setCurrentHealth,
            setDamageToPlayer,
            setSpecialCharge,
            setParalysisTurns,
            setBurnTurns,
            currentHealth,
            currentDefense,
            enemyInfo,
            onComplete: (result, _paralyzed, remainingHealth) => {
                if (result) {
                    onComplete(result);
                } else if (onTurnComplete?.(remainingHealth)) {
                    onComplete('defeat');
                } else {
                    setBattleLocked(false);
                }
            },
        });
    }, 400);
};

// Implements the results of a finished battle (victory vs. loss)
export const battleEndFunction = (
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>,
    setCurrentPower: React.Dispatch<React.SetStateAction<number>>,
    setCurrentDefense: React.Dispatch<React.SetStateAction<number>>,
    setCurrentSpeed: React.Dispatch<React.SetStateAction<number>>,
    setCurrentEndurance: React.Dispatch<React.SetStateAction<number>>,
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>,
    setBattleEndScreen: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>,
    setCurrentMoney: React.Dispatch<React.SetStateAction<number>>,
    setTotalBattlesWon: React.Dispatch<React.SetStateAction<number>>,
    setMaxHealth: React.Dispatch<React.SetStateAction<number>>,
    setMaxEnergy: React.Dispatch<React.SetStateAction<number>>,
    setCurrentHealth: React.Dispatch<React.SetStateAction<number>>,
    setBattleMessage: React.Dispatch<React.SetStateAction<string>>,
    setBattlesLost: React.Dispatch<React.SetStateAction<number>>,
    chocoboName: string,
    difficultyLevel: number, // 1-5 difficulty
    victory: boolean,
    battlesWon: number,
) => {
    const minimumStatGain = difficultyLevel > 3 ? 0.5 : difficultyLevel > 1 ? .2 : .1;
    const minimumHpGain = difficultyLevel > 3 ? 5 : difficultyLevel > 1 ? 3 : 1;
    const minimumEnergyGain = difficultyLevel > 3 ? 5 : difficultyLevel > 1 ? 3 : 1;
    const randomHungerGain = (3*difficultyLevel) + Math.floor(Math.random() * 5);
    const randomHappinessChange = (3*difficultyLevel) + Math.floor(Math.random() * 5);
    const randomEnergyLoss = (5*difficultyLevel) + Math.floor(Math.random() * 10);
    const randomPowerGain = Math.max(Number(((0.2*difficultyLevel) + Math.random() * (0.2*difficultyLevel)).toFixed(1)) - (battlesWon * .05), minimumStatGain);
    const randomDefGain = Math.max(Number(((0.2*difficultyLevel) + Math.random() * (0.2*difficultyLevel)).toFixed(1)) - (battlesWon * .05), minimumStatGain);
    const randomSpeedGain = Math.max(Number(((0.2*difficultyLevel) + Math.random() * (0.2*difficultyLevel)).toFixed(1)) - (battlesWon * .05), minimumStatGain);
    const randomEnduranceGain = Math.max(Number(((0.2*difficultyLevel) + Math.random() * (0.2*difficultyLevel)).toFixed(1)) - (battlesWon * .05), minimumStatGain);
    const hpGain = Math.max(Math.round(difficultyLevel + Math.floor((Math.random() * 2))) - (battlesWon * 1), minimumHpGain);
    const energyGain = Math.max(Math.round(difficultyLevel + Math.floor((Math.random() * 2))) - (battlesWon * 1), minimumEnergyGain);
    const randomMoneyGain = (10*difficultyLevel) + Math.floor(Math.random() * (10*difficultyLevel));
    const randomMoneyLoss = (5*difficultyLevel) + Math.floor(Math.random() * (10*difficultyLevel));

    setCurrentHunger(prevHunger => Math.min(prevHunger + randomHungerGain, 100));
    setCurrentEnergy(prevEnergy => Math.max(prevEnergy - randomEnergyLoss, 0));

    if (victory) {
        console.log('Max HP gain: ', hpGain);
        console.log('Max Energy gain: ', energyGain);
        console.log('Money gain: ', randomMoneyGain);
        console.log('Stat Gains [POW, DEF, SPD, END]: ', randomPowerGain, randomDefGain, randomSpeedGain, randomEnduranceGain);
        
        setCurrentHappiness(prevHappy => Math.min(prevHappy + randomHappinessChange, 100));
        setMaxHealth(prevMaxHealth => Math.min(prevMaxHealth + hpGain, 200));
        setMaxEnergy(prevMaxEnergy => Math.min(prevMaxEnergy + energyGain, 200));
        setCurrentPower(prevStr => Math.min(Number((prevStr + randomPowerGain).toFixed(1)), 10));
        setCurrentDefense(prevDef => Math.min(Number((prevDef + randomDefGain).toFixed(1)), 10));
        setCurrentSpeed(prevSpd => Math.min(Number((prevSpd + randomSpeedGain).toFixed(1)), 10));
        setCurrentEndurance(prevEnd => Math.min(Number((prevEnd + randomEnduranceGain).toFixed(1)), 10));
        setCurrentMoney(prevMoney => prevMoney + randomMoneyGain);
        setTotalBattlesWon(prevWins => prevWins + 1);

        const victoryMessage = `Victory! You and ${chocoboName} earned ${randomMoneyGain}G.`;
        setBattleMessage(victoryMessage);
    } else {
        setCurrentHappiness(prevHappy => Math.max(prevHappy - (difficultyLevel * 5), 0));
        setCurrentMoney(prevMoney => Math.max(prevMoney - randomMoneyLoss, 0));
        setBattlesLost(prevLosses => prevLosses + 1);

        const defeatMessage = `${chocoboName} has lost... ${randomMoneyLoss}G was stolen.`;
        setBattleMessage(defeatMessage);
    }
}