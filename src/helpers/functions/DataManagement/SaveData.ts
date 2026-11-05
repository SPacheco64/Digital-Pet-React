import { ChocoboSaveData } from '../../../types';

// Constants for valid shell colors and mood icons
const SHELL_COLORS = new Set(['orange', 'red', 'green', 'blue', 'pink', 'purple', 'gray', 'yellow']);
const MOOD_ICONS = new Set(['happy', 'normal', 'sad', 'Happy', 'Normal', 'Sad']);

// Type guard to check if a value is a non-null object (excluding arrays)
const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null && !Array.isArray(value)
);

// Helper function to validate and retrieve a required string field from the save data
const requireString = (data: Record<string, unknown>, key: string): string => {
    const value = data[key];
    if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > 10) {
        throw new Error(`Invalid save field: ${key}`);
    }
    return value.trim();
};

// Helper function to validate and retrieve a required number field from the save data
const requireNumber = (data: Record<string, unknown>, key: string): number => {
    const value = data[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`Invalid save field: ${key}`);
    }
    return value;
};

// Helper function to validate and retrieve an optional counter field from the save data
const optionalCounter = (data: Record<string, unknown>, key: string): number => {
    const value = data[key] ?? 0;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        throw new Error(`Invalid save field: ${key}`);
    }
    return Math.floor(value);
};

// Helper function to validate and retrieve an optional number field from the save data
const optionalNumber = (data: Record<string, unknown>, key: string): number => {
    const value = data[key] ?? 0;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`Invalid save field: ${key}`);
    }
    return value;
};

// Parses and validates the saved game data, ensuring all required fields are present and within valid ranges
export const parseChocoboSaveData = (value: unknown): ChocoboSaveData => {
    if (!isRecord(value)) {
        throw new Error('Saved game data must be an object.');
    }

    const maxHealth = Math.min(200, Math.max(1, requireNumber(value, 'maxHealth')));
    const maxEnergy = Math.min(200, Math.max(1, requireNumber(value, 'maxEnergy')));
    const alreadyPurchased = value.alreadyPurchased ?? [];
    if (!Array.isArray(alreadyPurchased)) {
        throw new Error('Invalid save field: alreadyPurchased');
    }
    const purchasedItemNames = alreadyPurchased
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    const moodIcon = value.currentMoodIcon ?? 'normal';
    if (typeof moodIcon !== 'string' || !MOOD_ICONS.has(moodIcon)) {
        throw new Error('Invalid save field: currentMoodIcon');
    }

    const shellColor = value.currentShellColor ?? 'orange';
    if (typeof shellColor !== 'string' || !SHELL_COLORS.has(shellColor)) {
        throw new Error('Invalid save field: currentShellColor');
    }

    const retroMode = value.retroMode ?? false;
    if (typeof retroMode !== 'boolean') {
        throw new Error('Invalid save field: retroMode');
    }

    const isMuted = value.isMuted ?? false;
    if (typeof isMuted !== 'boolean') {
        throw new Error('Invalid save field: isMuted');
    }

    return {
        playerName: requireString(value, 'playerName'),
        chocoboName: requireString(value, 'chocoboName'),
        currentShellColor: shellColor,
        retroMode,
        isMuted,
        currentHealth: Math.min(maxHealth, Math.max(0, requireNumber(value, 'currentHealth'))),
        maxHealth,
        currentEnergy: Math.min(maxEnergy, Math.max(0, requireNumber(value, 'currentEnergy'))),
        maxEnergy,
        currentHappiness: Math.min(100, Math.max(0, requireNumber(value, 'currentHappiness'))),
        currentHunger: Math.min(100, Math.max(0, requireNumber(value, 'currentHunger'))),
        currentPower: Math.min(10, Math.max(0, requireNumber(value, 'currentPower'))),
        currentDefense: Math.min(10, Math.max(0, requireNumber(value, 'currentDefense'))),
        currentSpeed: Math.min(10, Math.max(0, requireNumber(value, 'currentSpeed'))),
        currentEndurance: Math.min(10, Math.max(0, requireNumber(value, 'currentEndurance'))),
        currentMoodIcon: moodIcon.toLowerCase(),
        currentMoney: Math.max(0, requireNumber(value, 'currentMoney')),
        alreadyPurchased: [...new Set(purchasedItemNames)],
        battlesWon: optionalCounter(value, 'battlesWon'),
        battlesLost: optionalCounter(value, 'battlesLost'),
        racesWon: optionalCounter(value, 'racesWon'),
        specialCharge: Math.min(100, Math.max(0, optionalNumber(value, 'specialCharge'))),
    };
};
