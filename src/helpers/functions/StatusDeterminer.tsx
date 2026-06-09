import normalIcon from '../../graphics/icons/status/normal.svg'
import deadIcon from '../../graphics/icons/status/dead.svg';
import hungryIcon from '../../graphics/icons/status/hungry.svg';
import eatingIcon from '../../graphics/icons/status/eating.svg';
import eggIcon from '../../graphics/icons/status/egg.svg';
import fightingIcon from '../../graphics/icons/status/fighting.svg';
import hurtIcon from '../../graphics/icons/status/hurt.svg';
import sickIcon from '../../graphics/icons/status/sick.svg';
import sleepingIcon from '../../graphics/icons/status/sleeping.svg';
import tiredIcon from '../../graphics/icons/status/tired.svg';
import trainingIcon from '../../graphics/icons/status/training.svg';

export const determineStatus = (status: string) => {
  switch (status) {
    case 'dead':
      return deadIcon;
    case 'eating':
      return eatingIcon;
    case 'egg':
      return eggIcon;
    case 'fighting':
      return fightingIcon;
    case 'hurt':
      return hurtIcon;
    case 'sick':
      return sickIcon;
    case 'sleeping':
      return sleepingIcon;
    case 'tired':
      return tiredIcon;
    case 'training':
      return trainingIcon;
    case 'hungry':
        return hungryIcon;
    case 'happy':
      return normalIcon;
    case 'sad':
      return normalIcon;
    case 'normal':
      return normalIcon;
    default:
      return eggIcon;
  }
};
