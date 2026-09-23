import React from 'react';
import { BattleSelectionScreenProps } from '../types';
import '../../styles/components/battle-selection.scss';
import chocoboIcon from '../graphics/icons/misc-icons/chocobo.svg';

const BattleSelectionScreen: React.FC<BattleSelectionScreenProps> = (props: BattleSelectionScreenProps) => {
  // Destructure props for ease of access & documentation
  const {
    // creatureName,
    currentHealth,
    battlesWon,
    isLoading,
    setIsLoading,
    setShowBattleSelection,
    setShowBattleScreen,
    setSelectedEnemyLevel,
  } = props;

  const difficultyLevels = [
    { level: 1, label: 'Easy' },
    { level: 2, label: 'Normal' },
    { level: 3, label: 'Hard' },
    { level: 4, label: 'Expert' },
    { level: 5, label: 'Extreme' },
  ];

  const startBattle = (level: number) => {
    setSelectedEnemyLevel(level);
    setIsLoading(true);
    setShowBattleSelection(false);
    setShowBattleScreen(true);
  };

    return (
        <div id='BattleSelectionScreen' className='game-screen additional-screen'>
            <div className='battle-selection-content'>
                <div className='battle-selection-header'>
                    <div className='chocobo-health'>
                        <img src={chocoboIcon} alt='Chocobo Icon' />
                        HP:{currentHealth}
                    </div>
                    <div className='battle-wins'>
                        Battles Won:{battlesWon}
                    </div>
                </div>

                <div className='difficulty-container'>
                    <div className='difficulty-header'>
                        Select Difficulty
                    </div>
                    <div className='difficulty-buttons'>
                        {difficultyLevels.map(({ level, label }) => (
                            <button
                                key={level}
                                type='button'
                                onClick={() => startBattle(level)}
                                disabled={isLoading || currentHealth <= 0}
                            >
                                <span>Level {level}</span>
                                <strong>{label}</strong>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BattleSelectionScreen;