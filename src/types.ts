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
    currentMoodIcon: string;
    currentTime: string;
}

export interface CreatureProps {
    currentStatus: string;
    creatureName: string;
}

export interface MenuProps {
    inCombat: boolean;
    currentStatus: string;
    showStatusWindow: boolean;
    setShowStatusWindow: React.Dispatch<React.SetStateAction<boolean>>;
    setInCombat: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
}

export interface StatusWindowProps {
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

export interface MoodProps {
    currentMoodIcon: string;
}

export interface StatusDisplayProps {
    currentStatus: string;
}

export interface OptionsMenuProps {

}

export interface ColorPickerProps {
    setCurrentShellColor: React.Dispatch<React.SetStateAction<string>>;
}

export interface TimeOfDayProps {
    setCurrentTime: React.Dispatch<React.SetStateAction<string>>;
}

export interface ExternalUIProps {
    setCurrentShellColor: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTime: React.Dispatch<React.SetStateAction<string>>;
}