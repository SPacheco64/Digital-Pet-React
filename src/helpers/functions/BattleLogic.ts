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
    const randomHealthMod = Math.round((Math.random() * (clampedDifficulty * 10)) + clampedDifficulty);
    const difficultyBaseStatIncrease = clampedDifficulty > 1 ? (clampedDifficulty/2) : 0;
    const levelScaleDecrease = determineLevelScale(clampedDifficulty);

    const enemyInfo = {
        name: 'Enemy',
        sprite: '',
        power: Math.max(.75, Math.min(10, clampedDifficulty * randomPwrMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        defense: Math.max(.75, Math.min(10, clampedDifficulty * randomDefMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        speed: Math.max(.75, Math.min(10, clampedDifficulty * randomSpdMod + difficultyBaseStatIncrease) - levelScaleDecrease * 1.25),
        // health: (clampedDifficulty === 5) ? 100 : (15 * clampedDifficulty) + (randomHealthMod),
        health: clampedDifficulty === 5 ? 120 : 100,
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
    const variation = (Math.random() * attackPower) || 1;
    const damage = Math.round((((attackPower * (10 / (calcConst + targetDefense))) * damageUnits) + variation) * (levelScaling || 1));
    
    console.log('Calculated Damage: ', damage);

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
        const damage = calculateDamage(currentPower, enemyInfo.defense, enemyInfo.difficultyLevel);
        const remainingEnemyHealth = Math.max(currentEnemyHealth - damage, 0);
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
        const damage = calculateDamage(enemyInfo.power, currentDefense, enemyInfo.difficultyLevel);
        const remainingHealth = Math.max(currentHealth - damage, 0);
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
    difficultyLevel: number, // 1-5 difficulty
    victory: boolean,
) => {
    const randomHungerGain = (3*difficultyLevel) + Math.floor(Math.random() * 5);
    const randomHappinessChange = (3*difficultyLevel) + Math.floor(Math.random() * 5);
    const randomEnergyLoss = (5*difficultyLevel) + Math.floor(Math.random() * 10);
    const randomPowerGain = Number(((0.1*difficultyLevel) + Math.random() * 0.3).toFixed(1));
    const randomDefGain = Number(((0.1*difficultyLevel) + Math.random() * 0.5).toFixed(1));
    const randomSpeedGain = Number(((0.1*difficultyLevel) + Math.random() * 0.5).toFixed(1));
    const randomEnduranceGain = Number(((0.1*difficultyLevel) + Math.random() * 0.5).toFixed(1));
    const hpGain = difficultyLevel * Math.floor((Math.random() * 4) + 1);
    const energyGain = difficultyLevel * Math.floor((Math.random() * 4) + 1);

    setCurrentHunger(prevHunger => Math.min(prevHunger + randomHungerGain, 100));
    setCurrentEnergy(prevEnergy => Math.max(prevEnergy - randomEnergyLoss, 0));

    if (victory) {
        setCurrentHappiness(prevHappy => Math.min(prevHappy + randomHappinessChange, 100));
        setMaxHealth(prevMaxHealth => Math.min(prevMaxHealth + hpGain, 200));
        setMaxEnergy(prevMaxEnergy => Math.min(prevMaxEnergy + energyGain, 200));
        setCurrentPower(prevStr => Math.min(Number((prevStr + randomPowerGain).toFixed(1)), 10));
        setCurrentDefense(prevDef => Math.min(Number((prevDef + randomDefGain).toFixed(1)), 10));
        setCurrentSpeed(prevSpd => Math.min(Number((prevSpd + randomSpeedGain).toFixed(1)), 10));
        setCurrentEndurance(prevEnd => Math.min(Number((prevEnd + randomEnduranceGain).toFixed(1)), 10));
    } else {
        setCurrentHappiness(prevHappy => Math.max(prevHappy - (difficultyLevel * 10), 0));
        setCurrentHealth(1);
    }
}