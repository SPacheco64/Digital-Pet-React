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
    currentlyBusy: boolean;
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CreatureProps {
    currentStatus: string;
    currentHappiness: number;
    creatureName: string;
    currentlyBusy: boolean;
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MenuProps {
    inCombat: boolean;
    currentStatus: string;
    showStatusWindow: boolean;
    currentlyBusy: boolean;
    questionWindowOpen: boolean;
    showMenuScreen: boolean;
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>;
    setShowMenuScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowStatusWindow: React.Dispatch<React.SetStateAction<boolean>>;
    setInCombat: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
    setOptionSelected: React.Dispatch<React.SetStateAction<number>>;
    setQuestionWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentQuestionType: React.Dispatch<React.SetStateAction<string>>;
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