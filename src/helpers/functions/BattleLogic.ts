export interface EnemyInformation {
    name: string;
    sprite: string;
    power: number;
    defense: number;
    speed: number;
    health: number;
    specialAttacks: Array<object>;
    difficultyLevel: number; // 1 (easy) -> 5 (difficult) 
}

export type BattleTurn = 'player' | 'enemy';

const ATTACK_ANIMATION_DELAY = 400;
const ENEMY_RESPONSE_DELAY = 700;
const PLAYER_ACTION_DELAY = 700;

const enemyNames = ['Cactuar', 'Flan', 'Mu', 'Bomb', 'Tonberry', ''];

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

export const createEnemyForDifficulty = (difficultyLevel: number): EnemyInformation => {
    const clampedDifficulty = Math.min(Math.max(difficultyLevel, 1), 5);

    // Currently set to generate a random number between 1-2 at a single decimal point
    const randomPwrMod = Math.max(1, (Math.round(((Math.random() * 2)) * 10) / 10));
    const randomDefMod = Math.max(1, (Math.round(((Math.random() * 2)) * 10) / 10));
    const randomSpdMod = Math.max(1, (Math.round(((Math.random() * 2)) * 10) / 10));
    const randomHealthMod = Math.round((Math.random() * (clampedDifficulty * 10)) + (clampedDifficulty * 20));
    const difficultyBaseStatIncrease = clampedDifficulty > 1 ? (clampedDifficulty/2) : 0;
    const levelScaleDecrease = determineLevelScale(clampedDifficulty);

    const enemyInfo = {
        name: 'Enemy',
        sprite: '',
        power: Math.max(.75, Math.min(10, clampedDifficulty * randomPwrMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        defense: Math.max(.75, Math.min(10, clampedDifficulty * randomDefMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        speed: Math.max(.75, Math.min(10, clampedDifficulty * randomSpdMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        health: clampedDifficulty === 5 ? 170 : 10 + randomHealthMod,
        specialAttacks: [],
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

// Handles the calculation of damage from an attack
export const attackFunction = (
    options: {
        setPlayerAttack: React.Dispatch<React.SetStateAction<boolean>>;
        setEnemyAttack: React.Dispatch<React.SetStateAction<boolean>>;
        setBattleLocked: React.Dispatch<React.SetStateAction<boolean>>;
        setCurrentHealth: React.Dispatch<React.SetStateAction<number>>;
        setEnemyHealth: React.Dispatch<React.SetStateAction<number>>;
        currentPower: number;
        currentDefense: number;
        currentHealth: number;
        currentSpeed: number;
        currentHappiness: number;
        currentEnemyHealth: number;
        enemyInfo: EnemyInformation;
        onComplete: (result: 'victory' | 'defeat') => void;
    },
) => {
    const {
        setPlayerAttack,
        setEnemyAttack,
        setBattleLocked,
        setCurrentHealth,
        setEnemyHealth,
        currentPower,
        currentDefense,
        currentHealth,
        currentSpeed,
        currentHappiness,
        currentEnemyHealth,
        enemyInfo,
        onComplete,
    } = options;
    const firstTurn = turnOrderFunction(currentSpeed, currentHappiness, enemyInfo);

    // Triggers player attack animation and calculates damage to the enemy
    const performPlayerAttack = (onFinished?: () => void) => {
        setPlayerAttack(true);
        const criticalHit = Math.random() < ((currentSpeed/2)/10);
        const initDamage = calculateDamage(currentPower, enemyInfo.defense, enemyInfo.difficultyLevel);
        const finalDamage = Math.round(criticalHit ? initDamage * 1.25 : initDamage);
        
        console.log('Chocobo deals ', finalDamage, ' damage!');
        const remainingEnemyHealth = Math.max(currentEnemyHealth - finalDamage, 0);
        setEnemyHealth(remainingEnemyHealth);

        setTimeout(() => {
            setPlayerAttack(false);

            if (remainingEnemyHealth === 0) {
                onComplete('victory');
                return;
            }

            setTimeout(() => onFinished?.(), ENEMY_RESPONSE_DELAY);
        }, ATTACK_ANIMATION_DELAY);
    };

    // Triggers enemy attack animation and calculates damage to the player
    const performEnemyAttack = (onFinished?: () => void) => {
        setEnemyAttack(true);
        const criticalHit = Math.random() < ((enemyInfo.speed/2)/10);
        const initDamage = calculateDamage(enemyInfo.power, currentDefense, enemyInfo.difficultyLevel);
        const finalDamage = Math.round(criticalHit ? initDamage * 1.25 : initDamage);
        
        console.log('Enemy deals ', finalDamage, ' damage!');
        const remainingHealth = Math.max(currentHealth - finalDamage, 0);
        setCurrentHealth(remainingHealth);

        setTimeout(() => {
            setEnemyAttack(false);
            if (remainingHealth === 0) {
                onComplete('defeat');
                return;
            }

            setTimeout(() => {setBattleLocked(false); onFinished?.();}, PLAYER_ACTION_DELAY);
        }, ATTACK_ANIMATION_DELAY);
    };

    if (firstTurn === 'player') {
        performPlayerAttack(performEnemyAttack);
        return;
    }
    performEnemyAttack(performPlayerAttack);
};

// Handles the calculation of damage/the result of a special action
export const specialFunction = (
    currentPower?: number,
    currentDefense?: number,
    currentHealth?: number,
    currentHappiness?: number, // For player, helps determines the chance of success
    attacker?: number, // 1 = Player | 2 = Enemy
    enemyInfo?: EnemyInformation,
) => {
    console.log('Special function triggered.');
    if (attacker === 1) {
        
    }
}

// When trying to run from battle, determines if the player succeeds or fails
export const escapeFunction = (
    setPlayerRunning?: React.Dispatch<React.SetStateAction<boolean>>,
    currentSpeed?: number,
    currentHealth?: number,
    enemyInfo?: EnemyInformation,
) => {
    console.log('Run function triggered.');

    setTimeout(() => {
        setPlayerRunning?.(false);
    }, 400);
}

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
    const randomMoneyGain = (5*difficultyLevel) + Math.floor(Math.random() * (10*difficultyLevel));
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

        const victoryMessage = `Victory! You earned ${randomMoneyGain}G. ${chocoboName} feels stronger!`;
        setBattleMessage(victoryMessage);
    } else {
        setCurrentHappiness(prevHappy => Math.max(prevHappy - (difficultyLevel * 5), 0));
        setCurrentMoney(prevMoney => Math.max(prevMoney - randomMoneyLoss, 0));

        const defeatMessage = `${chocoboName} has lost... ${randomMoneyLoss}G was stolen.`;
        setBattleMessage(defeatMessage);
    }
}