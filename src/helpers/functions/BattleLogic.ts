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

// Handles whether the player or enemy acts first on a turn
export const turnOrderFunction = (
    currentSpeed?: number,
    currentHappiness?: number, // Happiness either increases, or decreases speed in battle
    enemyInfo?: EnemyInformation,
) => {

}

// Handles the calculation of damage from an attack
export const attackFunction = (
    setPlayerAttack?: React.Dispatch<React.SetStateAction<boolean>>,
    setEnemyAttack?: React.Dispatch<React.SetStateAction<boolean>>,
    currentPower?: number,
    currentDefense?: number,
    currentHealth?: number,
    attacker?: number, // 1 = Player | 2 = Enemy
    enemyInfo?: EnemyInformation,
) => {
    console.log('Attack function triggered.');
    
    setTimeout(() => {
        console.log('Ending attack...');

        if(setPlayerAttack !== undefined) {
            setPlayerAttack(false);
        }
    }, 400);
}

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
    currentSpeed?: number,
    currentHealth?: number,
    enemyInfo?: EnemyInformation,
) => {
    console.log('Run function triggered.');
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