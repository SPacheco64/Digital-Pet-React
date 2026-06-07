import React from 'react';
import '../styles/components/external-ui.scss';
import { ExternalUIProps } from './types';
import OptionsMenu from './helpers/OptionsMenu';
import ColorPicker from './helpers/ColorPicker';

const ExternalUI: React.FC<ExternalUIProps> = (props: ExternalUIProps) => {
  // Destructure props for ease of access & documentation
  const {
        setCurrentShellColor,
  } = props;

  return (
    <div id='ExternalUI'>
        <ColorPicker setCurrentShellColor={setCurrentShellColor} />
        <OptionsMenu />
    </div>
  );
};

export default ExternalUI;