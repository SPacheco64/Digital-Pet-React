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

export const createSaveData = (saveData: ChocoboSaveData): ChocoboSaveData => ({ ...saveData });

export const reportSaveError = (message: string, error: unknown, setSaveError: SetSaveError) => {
  console.error(message, error);
  setSaveError(message);
};

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

export const handleReset = (setSaveError: SetSaveError) => {
  try {
    if (resetFunction()) {
      window.location.reload();
    }
  } catch (error) {
    reportSaveError('Unable to reset saved game data. Browser storage may be unavailable.', error, setSaveError);
  }
};

export const handleSaveRecovery = (setSaveError: SetSaveError) => {
  try {
    localStorage.removeItem('digitalPetSave');
    window.location.reload();
  } catch (error) {
    reportSaveError('Unable to remove the damaged save. Browser storage may be unavailable.', error, setSaveError);
  }
};
