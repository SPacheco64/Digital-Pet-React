import sadIcon from '../../graphics/icons/mood/sad.svg';
import normalIcon from '../../graphics/icons/mood/normal.svg';
import happyIcon from '../../graphics/icons/mood/happy.svg';

export const determineMood = (moodIcon: string): string => {
  if (moodIcon === 'happy') {
    return happyIcon;
  } else if (moodIcon === 'sad') {
    return sadIcon;
  } else {
    return normalIcon;
  }
};
