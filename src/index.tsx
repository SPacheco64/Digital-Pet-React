import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import GameContainer from './GameContainer';
import '../styles/global.scss';
import '../styles/retro.scss';

const root = ReactDOM.createRoot(
  document.getElementById('DigipetRoot') as HTMLElement
);

root.render(
  <>    
    <GameContainer />
  </>
);
