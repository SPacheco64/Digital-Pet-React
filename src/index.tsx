import React from 'react';
import ReactDOM from 'react-dom/client';
import GameContainer from './GameContainer';
import '../styles/global.scss';

const root = ReactDOM.createRoot(
  document.getElementById('DigipetRoot') as HTMLElement
);

root.render(
  <>
    <GameContainer />
  </>
);
