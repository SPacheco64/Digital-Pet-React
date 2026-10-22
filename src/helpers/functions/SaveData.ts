import { ChocoboSaveData } from '../../types';

const SHELL_COLORS = new Set(['orange', 'red', 'green', 'blue', 'pink', 'purple', 'gray', 'yellow']);
const MOOD_ICONS = new Set(['happy', 'normal', 'sad', 'Happy', 'Normal', 'Sad']);
const SHOP_ITEM_COUNT = 12;

const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null && !Array.isArray(value)
);

const requireString = (data: Record<string, unknown>, key: string): string => {
    const value = data[key];
    if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > 10) {
        throw new Error(`Invalid save field: ${key}`);
    }
    return value.trim();
};

const requireNumber = (data: Record<string, unknown>, key: string): number => {
    const value = data[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`Invalid save field: ${key}`);
    }
    return value;
};

const optionalCounter = (data: Record<string, unknown>, key: string): number => {
    const value = data[key] ?? 0;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        throw new Error(`Invalid save field: ${key}`);
    }
    return Math.floor(value);
};

const optionalNumber = (data: Record<string, unknown>, key: string): number => {
    const value = data[key] ?? 0;
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`Invalid save field: ${key}`);
    }
    return value;
};

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

    const moodIcon = value.currentMoodIcon ?? 'normal';
    if (typeof moodIcon !== 'string' || !MOOD_ICONS.has(moodIcon)) {
        throw new Error('Invalid save field: currentMoodIcon');
    }

    const shellColor = value.currentShellColor ?? 'orange';
    if (typeof shellColor !== 'string' || !SHELL_COLORS.has(shellColor)) {
        throw new Error('Invalid save field: currentShellColor');
    }

    return {
        playerName: requireString(value, 'playerName'),
        chocoboName: requireString(value, 'chocoboName'),
        currentShellColor: shellColor,
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
        alreadyPurchased: [...new Set(alreadyPurchased.filter(
            (item): item is number => Number.isInteger(item) && item >= 0 && item < SHOP_ITEM_COUNT,
        ))],
        battlesWon: optionalCounter(value, 'battlesWon'),
        battlesLost: optionalCounter(value, 'battlesLost'),
        racesWon: optionalCounter(value, 'racesWon'),
        specialCharge: Math.min(100, Math.max(0, optionalNumber(value, 'specialCharge'))),
    };
};
