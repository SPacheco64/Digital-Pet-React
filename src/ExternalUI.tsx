import React from 'react';
import '../styles/components/external-ui.scss';
import { ExternalUIProps } from './types';
import OptionsMenu from './helpers/components/OptionsMenu';
import ColorPicker from './helpers/components/ColorPicker';
import TimeOfDay from './helpers/components/TimeOfDay';

const ExternalUI: React.FC<ExternalUIProps> = (props: ExternalUIProps) => {
  // Destructure props for ease of access & documentation
  const {
        setCurrentShellColor,
        setCurrentTime
  } = props;

  return (
    <div id='ExternalUI'>
      <div className='ui-container'>
        <ColorPicker setCurrentShellColor={setCurrentShellColor} />
        <OptionsMenu />
        <TimeOfDay setCurrentTime={setCurrentTime} />
      </div>
    </div>
  );
};

export default ExternalUI;