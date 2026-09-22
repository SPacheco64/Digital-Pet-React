import React from 'react';
import '../../../styles/components/testing-panel.scss';

interface TestingPanelProps {
  chocoboName: string;
  currentStatus: string;
  currentMoney: number;
  currentHealth: number;
  maxHealth: number;
  currentEnergy: number;
  maxEnergy: number;
  currentHappiness: number;
  currentHunger: number;
  currentPower: number;
  currentDefense: number;
  currentSpeed: number;
  currentEndurance: number;
  setChocoboName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMoney: React.Dispatch<React.SetStateAction<number>>;
  setCurrentHealth: React.Dispatch<React.SetStateAction<number>>;
  setMaxHealth: React.Dispatch<React.SetStateAction<number>>;
  setCurrentEnergy: React.Dispatch<React.SetStateAction<number>>;
  setMaxEnergy: React.Dispatch<React.SetStateAction<number>>;
  setCurrentHappiness: React.Dispatch<React.SetStateAction<number>>;
  setCurrentHunger: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPower: React.Dispatch<React.SetStateAction<number>>;
  setCurrentDefense: React.Dispatch<React.SetStateAction<number>>;
  setCurrentSpeed: React.Dispatch<React.SetStateAction<number>>;
  setCurrentEndurance: React.Dispatch<React.SetStateAction<number>>;
}

type NumberSetter = React.Dispatch<React.SetStateAction<number>>;

const updateNumber = (setter: NumberSetter, value: string) => {
  setter(Number(value));
};

const TestingPanel: React.FC<TestingPanelProps> = ({
  chocoboName,
  currentStatus,
  currentMoney,
  currentHealth,
  maxHealth,
  currentEnergy,
  maxEnergy,
  currentHappiness,
  currentHunger,
  currentPower,
  currentDefense,
  currentSpeed,
  currentEndurance,
  setChocoboName,
  setCurrentStatus,
  setCurrentMoney,
  setCurrentHealth,
  setMaxHealth,
  setCurrentEnergy,
  setMaxEnergy,
  setCurrentHappiness,
  setCurrentHunger,
  setCurrentPower,
  setCurrentDefense,
  setCurrentSpeed,
  setCurrentEndurance,
}) => (
  <aside className='testing-panel' aria-label='Chocobo testing controls'>
    <h2>Test Controls</h2>
    <div className='testing-panel-fields'>
      <label>
        Name
        <input type='text' value={chocoboName} onChange={(event) => setChocoboName(event.target.value)} />
      </label>
      <label>
        Status
        <input type='text' value={currentStatus} onChange={(event) => setCurrentStatus(event.target.value)} />
      </label>
      <label>
        Currency
        <input type='number' min='0' value={currentMoney} onChange={(event) => updateNumber(setCurrentMoney, event.target.value)} />
      </label>
      <label>
        Health
        <input type='number' min='0' value={currentHealth} onChange={(event) => updateNumber(setCurrentHealth, event.target.value)} />
      </label>
      <label>
        Max health
        <input type='number' min='0' value={maxHealth} onChange={(event) => updateNumber(setMaxHealth, event.target.value)} />
      </label>
      <label>
        Energy
        <input type='number' min='0' value={currentEnergy} onChange={(event) => updateNumber(setCurrentEnergy, event.target.value)} />
      </label>
      <label>
        Max energy
        <input type='number' min='0' value={maxEnergy} onChange={(event) => updateNumber(setMaxEnergy, event.target.value)} />
      </label>
      <label>
        Happiness
        <input type='number' min='0' max='100' value={currentHappiness} onChange={(event) => updateNumber(setCurrentHappiness, event.target.value)} />
      </label>
      <label>
        Hunger
        <input type='number' min='0' max='100' value={currentHunger} onChange={(event) => updateNumber(setCurrentHunger, event.target.value)} />
      </label>
      <label>
        Power
        <input type='number' min='0' max='10' step='0.1' value={currentPower} onChange={(event) => updateNumber(setCurrentPower, event.target.value)} />
      </label>
      <label>
        Defense
        <input type='number' min='0' max='10' step='0.1' value={currentDefense} onChange={(event) => updateNumber(setCurrentDefense, event.target.value)} />
      </label>
      <label>
        Speed
        <input type='number' min='0' max='10' step='0.1' value={currentSpeed} onChange={(event) => updateNumber(setCurrentSpeed, event.target.value)} />
      </label>
      <label>
        Endurance
        <input type='number' min='0' max='10' step='0.1' value={currentEndurance} onChange={(event) => updateNumber(setCurrentEndurance, event.target.value)} />
      </label>
    </div>
  </aside>
);

export default TestingPanel;
