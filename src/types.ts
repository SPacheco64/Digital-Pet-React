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
    currentPower: number;
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
    currentlyBusy: boolean;
    questionWindowOpen: boolean;
    showMenuScreen: boolean;
    showStatusScreen: boolean;
    showShopScreen: boolean;
    showAchievementsScreen: boolean;
    showInfoScreen: boolean;
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>;
    setShowMenuScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowStatusScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowShopScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowAchievementsScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowInfoScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setInCombat: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
    setOptionSelected: React.Dispatch<React.SetStateAction<number>>;
    setQuestionWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentQuestionType: React.Dispatch<React.SetStateAction<string>>;
}

export interface MenuScreenProps {
    currentStatus: string;
}

export interface StatusScreenProps {
    creatureName: string;
    currentStatus: string;
    currentHealth: number;
    currentHappiness: number;
    currentMoodIcon: string;
    currentHunger: number;
    currentEnergy: number;
    currentPower: number;
    currentDefense: number;
}

export interface ShopScreenProps {
    currentStatus: string;
    currentMoney: number;
}

export interface AchievementScreenProps {
    currentStatus: string;
    currentPower: number;
    currentDefense: number;
    currentSpeed: number;
    currentEndurance: number;
    battlesWon: number;
    racesWon: number;
}

export interface InfoScreenProps {
    currentStatus: string;
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