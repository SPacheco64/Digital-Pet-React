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

export const trainingFunction = (
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>,
    setCurrentStrength: React.Dispatch<React.SetStateAction<number>>,
    setCurrentDefense: React.Dispatch<React.SetStateAction<number>>,
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentQuestionType: React.Dispatch<React.SetStateAction<string>>,
    setQuestionWindowOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>,
    optionSelected: number,
) => {
    const randomHungerGain = 5 + Math.floor(Math.random() * 10);
    const randomHappinessLoss = 5 + Math.floor(Math.random() * 5);
    const randomEnergyLoss = 20 + Math.floor(Math.random() * 15);
    const randomStrengthGain = Number((0.1 + Math.random() * 0.5).toFixed(1));
    const randomDefGain = Number((0.1 + Math.random() * 0.5).toFixed(1));

    const trainingTimer = setTimeout(() => {
        setCurrentStatus('normal');
        setCurrentHunger(prevHunger => Math.min(prevHunger + randomHungerGain, 100));
        setCurrentEnergy(prevEnergy => Math.max(prevEnergy - randomEnergyLoss, 0));
        setCurrentHappiness(prevHappy => Math.max(prevHappy - randomHappinessLoss, 0))
    
        if (optionSelected === 1) {
            setCurrentStrength(prevStr => Math.min(Number((prevStr + randomStrengthGain).toFixed(1)), 5));
        } else if (optionSelected === 2) {
            setCurrentDefense(prevDef => Math.min(Number((prevDef + randomDefGain).toFixed(1)), 5));
        }

        setCurrentQuestionType('');
        setQuestionWindowOpen(false);
        setCurrentlyBusy(false);
    }, 10000);

    return () => clearTimeout(trainingTimer);
}

export const sleepingFunction = (
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>,
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>,
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {

    const randomHungerGain = 5 + Math.floor(Math.random() * 15);
    const randomEnergyGain = 30 + Math.floor(Math.random() * 10);
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
