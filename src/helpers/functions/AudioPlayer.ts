import { AUDIO_NAMES, AudioEvent } from '../../constants/AudioNames';
// UI Sound Effects
import TouchSound from '../../sounds/ui/Touch.wav';
import ErrorSound from '../../sounds/ui/Error.wav';
import GetSound from '../../sounds/ui/Get.wav';
import SelectSound from '../../sounds/ui/Select.wav';
// Chocobo Sound Effects
import EatSound from '../../sounds/chocobo/Eat.wav';
import SleepSound from '../../sounds/chocobo/Sleep.wav';
import HatchSound from '../../sounds/chocobo/Hatch.wav';
import TrainSound from '../../sounds/chocobo/Train.wav';
// Battle Sound Effects
import AttackSound from '../../sounds/battle/Attack.wav';
import PowerSound from '../../sounds/battle/Power.wav';
import BurnSound from '../../sounds/battle/Burn.wav';
import ParalyzeSound from '../../sounds/battle/Paralyze.wav';
import InstaKOSound from '../../sounds/battle/InstaKO.wav';
import WinSound from '../../sounds/battle/Win.wav';
import LoseSound from '../../sounds/battle/Lose.wav';
import RunSound from '../../sounds/battle/Run.wav';
// Fishing Sound Effects
import CatchSound from '../../sounds/fishing/Catch.wav';
import MissSound from '../../sounds/fishing/Miss.wav';
// Racing Sound Effects
import CountSound from '../../sounds/racing/Count.wav';
import GoSound from '../../sounds/racing/Go.wav';
import BumpSound from '../../sounds/racing/Bump.wav';
import WinRaceSound from '../../sounds/racing/Win.wav';
import LoseRaceSound from '../../sounds/racing/Lose.wav';

const sounds = {
    // UI Sound Effects:
    [AUDIO_NAMES.touch]: TouchSound,
    [AUDIO_NAMES.error]: ErrorSound,
    [AUDIO_NAMES.get]: GetSound,
    [AUDIO_NAMES.select]: SelectSound,
    // Chocobo Sound Effects:
    [AUDIO_NAMES.eat]: EatSound,
    [AUDIO_NAMES.sleep]: SleepSound,
    [AUDIO_NAMES.hatch]: HatchSound,
    [AUDIO_NAMES.train]: TrainSound,
    // Battle Sound Effects:
    [AUDIO_NAMES.attack]: AttackSound,
    [AUDIO_NAMES.power]: PowerSound,
    [AUDIO_NAMES.burn]: BurnSound,
    [AUDIO_NAMES.paralysis]: ParalyzeSound,
    [AUDIO_NAMES['instant-kill']]: InstaKOSound,
    [AUDIO_NAMES.win]: WinSound,
    [AUDIO_NAMES.lose]: LoseSound,
    [AUDIO_NAMES.run]: RunSound,
    // Fishing Sound Effects:
    [AUDIO_NAMES.catch]: CatchSound,
    [AUDIO_NAMES.miss]: MissSound,
    // Racing Sound Effects:
    [AUDIO_NAMES.count]: CountSound,
    [AUDIO_NAMES.go]: GoSound,
    [AUDIO_NAMES.bump]: BumpSound,
    [AUDIO_NAMES['win-race']]: WinRaceSound,
    [AUDIO_NAMES['lose-race']]: LoseRaceSound
};

const audioPlayers = Object.fromEntries(
    Object.entries(sounds).map(([name, source]) => {
        const audio = new Audio(source);
        audio.preload = 'auto';
        audio.volume = 0.5;
        audio.addEventListener('error', () => {
            console.error(`Failed to preload audio: ${source}`);
        });
        return [name, audio];
    })
) as Record<string, HTMLAudioElement>;

let audioMuted = false;
export const setAudioMuted = (muted: boolean) => {
    audioMuted = muted;
};

export const preloadAudio = () => {
    Object.values(audioPlayers).forEach((audio) => audio.load());
};

export const useAudioPlayer = (event: AudioEvent) => {
    if (audioMuted) { return; } // If audio is muted, do not play any sound

    const audio = audioPlayers[AUDIO_NAMES[event]];
    audio.currentTime = 0;
    audio.play();
};