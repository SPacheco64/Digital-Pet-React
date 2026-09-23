import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../../styles/components/rps-minigame.scss';
import paperIcon from '../../graphics/icons/game_buttons/normal/paper.svg';
import rockIcon from '../../graphics/icons/game_buttons/normal/rock.svg';
import scissorsIcon from '../../graphics/icons/game_buttons/normal/scissors.svg';

interface RockPaperScissorsMinigameProps {
  onComplete: (result: 'win' | 'tie' | 'loss') => void;
  onResult: (result: 'win' | 'tie' | 'loss') => void;
  inputTrigger: number;
  earnedCurrency: number;
}

type Choice = 'rock' | 'paper' | 'scissors';
type GameState = 'playing' | 'finished';

const choices: Choice[] = ['rock', 'paper', 'scissors'];
const choiceIcons: Record<Choice, string> = {
  rock: rockIcon,
  paper: paperIcon,
  scissors: scissorsIcon,
};

const getResult = (playerChoice: Choice, computerChoice: Choice): 'win' | 'tie' | 'loss' => {
  if (playerChoice === computerChoice) {
    return 'tie';
  }

  const playerWins = (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  );

  return playerWins ? 'win' : 'loss';
};

const RockPaperScissorsMinigame: React.FC<RockPaperScissorsMinigameProps> = ({ onComplete, onResult, inputTrigger, earnedCurrency }) => {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<'win' | 'tie' | 'loss' | null>(null);
  const lastInputTrigger = useRef<number>(inputTrigger);

  const handleChoice = useCallback((choiceIndex: number) => {
    if (gameState === 'finished' || choiceIndex < 1 || choiceIndex > choices.length) {
      return;
    }

    const selectedChoice = choices[choiceIndex - 1];
    const selectedComputerChoice = choices[Math.floor(Math.random() * choices.length)];
    const gameResult = getResult(selectedChoice, selectedComputerChoice);
    setPlayerChoice(selectedChoice);
    setComputerChoice(selectedComputerChoice);
    setResult(gameResult);
    setGameState('finished');
    onResult(gameResult);
  }, [gameState, onResult]);

  const handleInput = useCallback(() => {
    if (gameState === 'finished' && result !== null) {
      onComplete(result);
    }
  }, [gameState, onComplete, result]);

  useEffect(() => {
    if (inputTrigger !== lastInputTrigger.current) {
      lastInputTrigger.current = inputTrigger;
      handleChoice(inputTrigger);
    }
  }, [handleChoice, inputTrigger]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      if (event.code === 'Digit1' || event.code === 'Numpad1') {
        handleChoice(1);
      } else if (event.code === 'Digit2' || event.code === 'Numpad2') {
        handleChoice(2);
      } else if (event.code === 'Digit3' || event.code === 'Numpad3') {
        handleChoice(3);
      } else if (event.code === 'Space' && gameState === 'finished') {
        event.preventDefault();
        handleInput();
      } else {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleChoice, handleInput]);

  return (
    <section className='rps-minigame game-screen additional-screen' aria-live='polite' onClick={handleInput}>
      <h2>Rock, Paper, Scissors</h2>
      {gameState === 'playing' ? (
        <>
          <p>Choose your move.</p>
          <div className='rps-choices'>
            {choices.map((choice, index) => (
              <button key={choice} type='button' onClick={(event) => { event.stopPropagation(); handleChoice(index + 1); }}>
                <img src={choiceIcons[choice]} alt={choice} />
              </button>
            ))}
          </div>
          <p className='rps-hint'>Choose with the buttons or keys 1, 2, 3</p>
        </>
      ) : (
        <>
          <p>You chose {playerChoice}. The Chocobo chose {computerChoice}.</p>
          <p className='rps-result'>
            {result === 'win' ? 'You win!' : result === 'tie' ? 'It is a tie!' : 'You lose!'}
          </p>
          <p className='rps-result'>You earned {earnedCurrency} G</p>
          <p className='rps-hint'>Click or press SPACE to return</p>
        </>
      )}
    </section>
  );
};

export default RockPaperScissorsMinigame;