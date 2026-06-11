// External UI Functions
export const saveFunction = () => {
    console.log('DATA SAVED! WOOHOO!');
};
export const resetFunction = () => {
    console.log('GAME RESET! BYE BYE');
};
export const retroFunction = () => {
    console.log('GOING RETRO MODE!');
    document.getElementById('DigipetRoot')?.classList.toggle('retro');
}
export const githubFunction = () => {
    window.open('https://spacheco64.github.io', '_blank');
};
export const infoFunction = () => {
    
};

// Game-Based Action Functions
// Handles initial creature hatching
export const hatchingEvent = (currentStatus: string, 
    setCreatureName: React.Dispatch<React.SetStateAction<string>>,
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>,
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>,
) => {

    const hatchingTimeout = setTimeout(() => {
        setCreatureName('Choco');
        setCurrentStatus('normal');
        setCurrentlyBusy(false);
    }, 13000);

    return () => clearTimeout(hatchingTimeout);
}

// Handles feeding of creature
export const eatFunction = (setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>,
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>,
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const randomHappinessGain = 5 + Math.floor(Math.random() * 5);
    const randomEnergyGain = 5 + Math.floor(Math.random() * 10);
    
    const eatingTimer = setTimeout(() => {
        setCurrentStatus('normal');
        setCurrentHunger(prevHunger => Math.max(prevHunger - 20, 0)); // Decrease hunger by 20, but not below 0
        setCurrentHappiness(prevHappiness => Math.min(prevHappiness + randomHappinessGain, 100)); // Increase happiness by 10, but not above 100
        setCurrentEnergy(prevEnergy => Math.min(prevEnergy + randomEnergyGain, 100));
        setCurrentlyBusy(false);
    }, 5000);

    return () => clearTimeout(eatingTimer);
}

// Handles training of creature
export const trainingFunction = (
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>,
    setCurrentPower: React.Dispatch<React.SetStateAction<number>>,
    setCurrentDefense: React.Dispatch<React.SetStateAction<number>>,
    setCurrentSpeed: React.Dispatch<React.SetStateAction<number>>,
    setCurrentEndurance: React.Dispatch<React.SetStateAction<number>>,
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentQuestionType: React.Dispatch<React.SetStateAction<string>>,
    setQuestionWindowOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>,
    optionSelected: number,
) => {
    const randomHungerGain = 5 + Math.floor(Math.random() * 10);
    const randomHappinessLoss = 5 + Math.floor(Math.random() * 5);
    const randomEnergyLoss = 20 + Math.floor(Math.random() * 15);
    const randomPowerGain = Number((0.1 + Math.random() * 0.3).toFixed(1));
    const randomDefGain = Number((0.1 + Math.random() * 0.5).toFixed(1));
    const randomSpeedGain = Number((0.1 + Math.random() * 0.5).toFixed(1));
    const randomEnduranceGain = Number((0.1 + Math.random() * 0.5).toFixed(1));
    setCurrentStatus('training');

    const trainingTimer = setTimeout(() => {
        setCurrentStatus('normal');
        setCurrentHunger(prevHunger => Math.min(prevHunger + randomHungerGain, 100));
        setCurrentEnergy(prevEnergy => Math.max(prevEnergy - randomEnergyLoss, 0));
        setCurrentHappiness(prevHappy => Math.max(prevHappy - randomHappinessLoss, 0));
    
        if (optionSelected === 1) {
            setCurrentPower(prevStr => Math.min(Number((prevStr + randomPowerGain).toFixed(1)), 10));
        } else if (optionSelected === 2) {
            setCurrentDefense(prevDef => Math.min(Number((prevDef + randomDefGain).toFixed(1)), 10));
        } else if (optionSelected === 3) {
            setCurrentSpeed(prevSpd => Math.min(Number((prevSpd + randomSpeedGain).toFixed(1)), 10));
        } else {
            setCurrentEndurance(prevEnd => Math.min(Number((prevEnd + randomEnduranceGain).toFixed(1)), 10));
        }

        setCurrentQuestionType('');
        setQuestionWindowOpen(false);
        setCurrentlyBusy(false);
    }, 10000);

    return () => clearTimeout(trainingTimer);
}

// Handles creature sleeping
export const sleepingFunction = (
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>,
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>,
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {
    const randomHungerGain = 5 + Math.floor(Math.random() * 15);
    const randomEnergyGain = 20 + Math.floor(Math.random() * 10);
    const randomHappinessGain = 5 + Math.floor(Math.random() * 10);

    const sleepingTimer = setTimeout(() => {
        setCurrentStatus('normal');
        setCurrentHunger(prevHunger => Math.min(prevHunger + randomHungerGain, 100));
        setCurrentEnergy(prevEnergy => Math.min(prevEnergy + randomEnergyGain, 100));
        setCurrentHappiness(prevHappiness => Math.min(prevHappiness + randomHappinessGain, 100));
        setCurrentlyBusy(false);
    }, 60000);

    return () => clearTimeout(sleepingTimer);
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
