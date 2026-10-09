import React from 'react';
import { RaceDifficulty } from '../types';

interface RaceSelectionScreenProps {
  onSelect: (difficulty: RaceDifficulty) => void;
}

const difficultyOptions: Array<{ level: RaceDifficulty; label: string; description: string }> = [
  { level: 1, label: 'Easy', description: 'Steady rivals' },
  { level: 2, label: 'Medium', description: 'Faster rivals, occasional sprints' },
  { level: 3, label: 'Hard', description: 'Fast rivals, frequent sprints' },
];

const RaceSelectionScreen: React.FC<RaceSelectionScreenProps> = ({ onSelect }) => (
  <section id='RaceSelectionScreen' className='game-screen additional-screen' aria-label='Choose race difficulty'>
    <div className='race-selection-panel'>
      <h2>Race Difficulty</h2>
      <div className='race-difficulty-options'>
        {difficultyOptions.map(({ level, label, description }) => (
          <button key={level} type='button' onClick={() => onSelect(level)}>
            <strong>{label}</strong>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default RaceSelectionScreen;