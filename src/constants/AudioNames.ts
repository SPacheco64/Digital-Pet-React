export const AUDIO_NAMES = {
    // UI Sound Effects
    touch: 'TouchSound',
    error: 'ErrorSound',
    get: 'GetSound',
    select: 'SelectSound',
    // Chocobo Sound Effects
    hatch: 'HatchSound',
    eat: 'EatSound',
    sleep: 'SleepSound',
    train: 'TrainSound',
    // Battle Sound Effects
    battleSelect: 'BattleSelectSound',
    attack: 'AttackSound',
    power: 'PowerSound',
    burn: 'BurnSound',
    paralysis: 'ParalyzeSound',
    'instant-kill': 'InstaKOSound',
    win: 'WinSound',
    lose: 'LoseSound',
    run: 'RunSound',
    // Fishing Sound Effects
    catch: 'CatchSound',
    miss: 'MissSound',
    // Racing Sound Effects
    raceSelect: 'RaceSelectSound',
    count: 'CountSound',
    go: 'GoSound',
    bump: 'BumpSound',
    'win-race': 'WinRaceSound',
    'lose-race': 'LoseRaceSound',
};

export type AudioEvent = keyof typeof AUDIO_NAMES;