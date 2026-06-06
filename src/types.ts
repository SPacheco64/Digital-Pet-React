export interface GameContainerProps {
    
}

export interface GameDisplayProps {
    inCombat: boolean;
    creatureName: string;
    currentStatus: string;
    currentHealth: number;
    currentHappiness: number;
    currentHunger: number;
    currentEnergy: number;
    currentStrength: number;
    currentDefense: number;
}

export interface CreatureProps {
    currentStatus: string;
    creatureName: string;
}

export interface MenuProps {
    inCombat: boolean;
    setInCombat: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
}

export interface StatusDisplayProps {
    creatureName: string;
    currentStatus: string;
    currentHealth: number;
    currentHappiness: number;
    currentMoodIcon: string;
    currentHunger: number;
    currentEnergy: number;
    currentStrength: number;
    currentDefense: number;
}