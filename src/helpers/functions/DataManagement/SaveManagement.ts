import { Dispatch, SetStateAction } from 'react';
import { ChocoboSaveData } from '../../../types';
import { resetFunction, saveFunction } from '../OperationalFunctions';

type SetSaveError = Dispatch<SetStateAction<string | null>>;

interface SaveOptions {
  saveData: ChocoboSaveData;
  storageHydrated: boolean;
  storageReadFailed: boolean;
  saveRecoveryRequired: boolean;
  setSaveError: SetSaveError;
}

// Creates a new save data object by copying the provided save data.
export const createSaveData = (saveData: ChocoboSaveData): ChocoboSaveData => ({ ...saveData });

// Reports a save error to the console and updates the save error state.
export const reportSaveError = (message: string, error: unknown, setSaveError: SetSaveError) => {
  console.error(message, error);
  setSaveError(message);
};

// Handles the save operation, checking for storage readiness and errors before attempting to save the game data.
export const handleSave = ({
  saveData,
  storageHydrated,
  storageReadFailed,
  saveRecoveryRequired,
  setSaveError,
}: SaveOptions) => {
  if (!storageHydrated) {
    setSaveError('Game storage is still loading. Try saving again in a moment.');
    return;
  }

  if (storageReadFailed) {
    setSaveError('Game progress cannot be saved because existing browser storage could not be read. Reload and try again.');
    return;
  }

  if (saveRecoveryRequired) {
    setSaveError('Reset the damaged save before saving a new game.');
    return;
  }

  try {
    saveFunction(saveData);
    setSaveError(null);
  } catch (error) {
    reportSaveError('Unable to save game progress. Check browser storage availability and space.', error, setSaveError);
  }
};

// Handles the reset operation, confirming with the user before clearing the saved game data and reloading the page.
export const handleReset = (setSaveError: SetSaveError) => {
  try {
    if (resetFunction()) {
      window.location.reload();
    }
  } catch (error) {
    reportSaveError('Unable to reset saved game data. Browser storage may be unavailable.', error, setSaveError);
  }
};

// Handles the recovery of a damaged save, attempting to remove the corrupted data and reload the page.
export const handleSaveRecovery = (setSaveError: SetSaveError) => {
  try {
    localStorage.removeItem('digitalPetSave');
    window.location.reload();
  } catch (error) {
    reportSaveError('Unable to remove the damaged save. Browser storage may be unavailable.', error, setSaveError);
  }
};
