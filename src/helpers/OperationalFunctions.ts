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

// Game-Based Action Functions
export const eatFunction = (setCurrentStatus: React.Dispatch<React.SetStateAction<string>>, 
    setCurrentHunger: React.Dispatch<React.SetStateAction<number>>, 
    setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>) => {
    const eatingTimer = setTimeout(() => {
        setCurrentStatus('normal');
        setCurrentHunger(prevHunger => Math.max(prevHunger - 20, 0)); // Decrease hunger by 20, but not below 0
        setCurrentHappiness(prevHappiness => Math.min(prevHappiness + 10, 100)); // Increase happiness by 10, but not above 100
    }, 5000);

    return () => clearTimeout(eatingTimer);
}
