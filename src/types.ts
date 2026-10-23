export interface GameContainerProps {
    
}

export interface ChocoboSaveData {
    playerName: string;
    chocoboName: string;
    currentShellColor: string;
    currentHealth: number;
    maxHealth: number;
    currentEnergy: number;
    maxEnergy: number;
    currentHappiness: number;
    currentHunger: number;
    currentPower: number;
    currentDefense: number;
    currentSpeed: number;
    currentEndurance: number;
    currentMoodIcon: string;
    currentMoney: number;
    alreadyPurchased: number[];
    battlesWon: number;
    battlesLost: number;
    racesWon: number;
    specialCharge: number;
}

export type GameActivity = 'pet' | 'battle-selection' | 'battle' | 'fishing' | 'race-selection' | 'race';

export interface GameDisplayProps {
    inCombat: boolean;
    creatureName: string;
    currentStatus: string;
    currentHealth: number;
    battlesWon: number;
    maxHealth: number;
    currentHappiness: number;
    currentHunger: number;
    currentEnergy: number;
    currentPower: number;
    currentDefense: number;
    battleMessage: string;
    battleResult: 'victory' | 'defeat' | null;
    currentMoodIcon: string;
    currentTime: string;
    actionFailureTrigger: number;
    currentlyBusy: boolean;
    showMenuScreen: boolean;
    activity: GameActivity;
    onStartBattle: (level: number) => void;
    fishingInput: number;
    fishingEarnedCurrency: number;
    onFishingComplete: (caughtCount: number) => void;
    onFishingClose: () => void;
    raceDifficulty: RaceDifficulty;
    currentSpeed: number;
    currentEndurance: number;
    raceSteeringInput: { direction: -1 | 1; sequence: number };
    sprintActive: boolean;
    setSprintActive: React.Dispatch<React.SetStateAction<boolean>>;
    onRaceComplete: (place: number) => void;
    onRaceClose: () => void;
    selectedEnemyLevel: number;
    isLoading: boolean;
    playerAttack: boolean;
    enemyAttack: boolean; 
    playerSpecial: boolean; 
    enemySpecial: boolean; 
    playerRunning: boolean; 
    damageToEnemy: number;
    damageToPlayer: number;
    specialCharge: number;
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onSelectRaceDifficulty: (difficulty: RaceDifficulty) => void;
}

export interface CreatureProps {
    currentStatus: string;
    currentHappiness: number;
    creatureName: string;
    currentlyBusy: boolean;
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>;
}

export type RaceDifficulty = 1 | 2 | 3;

export interface MenuProps {
    activity: GameActivity;
    onActivityChange: (activity: GameActivity) => void;
    inCombat: boolean;
    currentStatus: string;
    currentHealth: number;
    maxHealth: number;
    onAttack: () => void;
    onSpecial: () => void;
    specialCharge: number;
    currentEnemyHealth: number;
    battleLocked: boolean;
    currentEnergy: number;
    maxEnergy: number;
    currentHunger: number;
    currentlyBusy: boolean;
    questionWindowOpen: boolean;
    showMenuScreen: boolean;
    showStatusScreen: boolean;
    showShopScreen: boolean;
    showAchievementsScreen: boolean;
    showInfoScreen: boolean;
    playerAttack: boolean;
    enemyAttack: boolean;
    playerSpecial: boolean;
    enemySpecial: boolean;
    playerRunning: boolean;
    fishingComplete: boolean;
    raceComplete: boolean;
    sprintActive: boolean;
    welcomeFormHidden: boolean;
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>;
    setShowMenuScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowStatusScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowShopScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowAchievementsScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setShowInfoScreen: React.Dispatch<React.SetStateAction<boolean>>;
    setInCombat: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
    setActionFailureTrigger: React.Dispatch<React.SetStateAction<number>>;
    setOptionSelected: React.Dispatch<React.SetStateAction<number>>;
    setQuestionWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentQuestionType: React.Dispatch<React.SetStateAction<string>>;
    setFishingComplete: React.Dispatch<React.SetStateAction<boolean>>;
    setFishingInput: React.Dispatch<React.SetStateAction<number>>;
    setRaceComplete: React.Dispatch<React.SetStateAction<boolean>>;
    setSprintActive: React.Dispatch<React.SetStateAction<boolean>>;
    setRaceSteeringInput: React.Dispatch<React.SetStateAction<{ direction: -1 | 1; sequence: number }>>;
    setPlayerAttack: React.Dispatch<React.SetStateAction<boolean>>;
    setEnemyAttack: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayerSpecial: React.Dispatch<React.SetStateAction<boolean>>;
    setEnemySpecial: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayerRunning: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentHealth: React.Dispatch<React.SetStateAction<number>>;
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>;
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
    currentSpeed: number;
    currentEndurance: number;
    maxHealth: number;
    maxEnergy: number;
}

export interface ShopScreenProps {
    currentStatus: string;
    currentMoney: number;
    alreadyPurchased: Array<number>;
    setCurrentMoney: React.Dispatch<React.SetStateAction<number>>;
    setAlreadyPurchased: React.Dispatch<React.SetStateAction<Array<number>>>
    currentHealth: number;
    currentEnergy: number;
    maxHealth: number;
    maxEnergy: number;
    setCurrentHealth: React.Dispatch<React.SetStateAction<number>>;
    setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>;
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
    onSave: () => void;
    onReset: () => void;
    autosaveEnabled: boolean;
    setAutosaveEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ColorPickerProps {
    setCurrentShellColor: React.Dispatch<React.SetStateAction<string>>;
}

export interface TimeOfDayProps {
    currentTime: string;
    setCurrentTime: React.Dispatch<React.SetStateAction<string>>;
}

export interface ExternalUIProps {
    setCurrentShellColor: React.Dispatch<React.SetStateAction<string>>;
    currentTime: string;
    setCurrentTime: React.Dispatch<React.SetStateAction<string>>;
    onSave: () => void;
    onReset: () => void;
    autosaveEnabled: boolean;
    setAutosaveEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface GameCanvasProps {
    currentStatus: string;
    currentMoodIcon: string;
    setCurrentlyBusy: React.Dispatch<React.SetStateAction<boolean>>;
    actionFailureTrigger: number;
}

export interface MenuCanvasProps {
    currentStatus: string;
    iconToUse: number;
}

export interface BattleCanvasProps {
    selectedEnemyLevel: number;
    isLoading: boolean;
    playerAttack: boolean;
    enemyAttack: boolean; 
    playerSpecial: boolean; 
    enemySpecial: boolean; 
    playerRunning: boolean; 
    battleResult: 'victory' | 'defeat' | null;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface BattleSelectionScreenProps {
    isLoading: boolean;
    battlesWon: number;
    currentHealth: number;
    onStartBattle: (level: number) => void;
}

export interface BattleScreenProps {
    selectedEnemyLevel: number;
    isLoading: boolean;
    playerAttack: boolean;
    enemyAttack: boolean; 
    playerSpecial: boolean; 
    enemySpecial: boolean; 
    playerRunning: boolean; 
    currentHealth: number;
    maxHealth: number;
    currentPower: number;
    currentDefense: number;
    battleMessage: string;
    battleResult: 'victory' | 'defeat' | null;
    damageToEnemy: number;
    damageToPlayer: number;
        specialCharge: number;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}