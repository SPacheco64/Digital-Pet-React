import React from 'react';
import { determineMood } from './helpers/components/MoodDeterminer';
import { MoodProps } from './types';

const MoodDisplay: React.FC<MoodProps> = (props: MoodProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentMoodIcon,
  } = props;

  return (
    <div id='MoodDisplay'>
      <div className='mood-icon'>
        <img src={determineMood(currentMoodIcon)} alt='mood icon'/>
      </div>
    </div>
  );
};

export default MoodDisplay;