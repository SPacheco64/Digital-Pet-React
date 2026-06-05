import React from 'react';
import { CreatureProps } from './types';

const Creature: React.FC<CreatureProps> = (props: CreatureProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  return (
    <div id='Creature'>
      {/* Creature content will go here */}
    </div>
  );
};

export default Creature;