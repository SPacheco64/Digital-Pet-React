import React from 'react';
import { determineStatus } from './helpers/StatusDeterminer';
import { StatusDisplayProps } from './types';

const StatusDisplay: React.FC<StatusDisplayProps> = (props: StatusDisplayProps) => {
  // Destructure props for ease of access & documentation
  const {
    currentStatus
  } = props;

  return (
    <div id='StatusDisplay'>
      <div className='status-icon'>
        <img src={determineStatus(currentStatus)} alt='status icon'/>
      </div>
    </div>
  );
};

export default StatusDisplay;