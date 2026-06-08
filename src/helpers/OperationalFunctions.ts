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
export const eatFunction = (setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>) => {
    
    const randomHappinessGain = Math.floor(Math.random() * 10);
    
    const eatingTimer = setTimeout(() => {
        setCurrentStatus('normal');
        setCurrentHunger(prevHunger => Math.max(prevHunger - 20, 0)); // Decrease hunger by 20, but not below 0
        setCurrentHappiness(prevHappiness => Math.min(prevHappiness + randomHappinessGain, 100)); // Increase happiness by 10, but not above 100
    }, 5000);

    return () => clearTimeout(eatingTimer);
}

export const trainingFunction = (
    trainingType: string,
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>,
    setCurrentStrength: React.Dispatch<React.SetStateAction<number>>,
    setCurrentDefense: React.Dispatch<React.SetStateAction<number>>
    ) => {
    const randomHungerGain = Math.floor(Math.random() * 15);
    const randomEnergyLoss = Math.floor(Math.random() * 20);
    const randomStrengthGain = Math.random() * 0.3;
    const randomDefGain = Math.random() * 0.3;

    const trainingTimer = setTimeout(() => {
        setCurrentStatus('normal');
        setCurrentHunger(prevHunger => Math.min(prevHunger + randomHungerGain, 100));
        setCurrentEnergy(prevEnergy => Math.max(prevEnergy - randomEnergyLoss, 0));
    
        if (trainingType === 'Strength') {
            setCurrentStrength(prevStr => Math.min(prevStr + randomStrengthGain, 5));
        } else if (trainingType === 'Defense') {
            setCurrentDefense(prevDef => Math.min(prevDef + randomDefGain, 5));
        }
    }, 5000);

    return () => clearTimeout(trainingTimer);
}
