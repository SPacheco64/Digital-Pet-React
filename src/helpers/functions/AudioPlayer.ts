import { AUDIO_NAMES, MUSIC_THEMES, AudioEvent, MusicTheme } from '../../constants/AudioNames';
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
import BattleSelectSound from '../../sounds/battle/BattleSelect.wav';
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
import RaceSelectSound from '../../sounds/racing/RaceSelect.wav';
import CountSound from '../../sounds/racing/Count.wav';
import GoSound from '../../sounds/racing/Go.wav';
import BumpSound from '../../sounds/racing/Bump.wav';
import WinRaceSound from '../../sounds/racing/Win.wav';
import LoseRaceSound from '../../sounds/racing/Lose.wav';
// Background Music
import BattleTheme from '../../sounds/music/BattleTheme.mp3';
import MainTheme from '../../sounds/music/MainTheme.mp3';
import RaceTheme from '../../sounds/music/RaceTheme.mp3';

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
    [AUDIO_NAMES.battleSelect] : BattleSelectSound,
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
    [AUDIO_NAMES.raceSelect]: RaceSelectSound,
    [AUDIO_NAMES.count]: CountSound,
    [AUDIO_NAMES.go]: GoSound,
    [AUDIO_NAMES.bump]: BumpSound,
    [AUDIO_NAMES['win-race']]: WinRaceSound,
    [AUDIO_NAMES['lose-race']]: LoseRaceSound,
};

const music = {
    [MUSIC_THEMES.main]: MainTheme,
    [MUSIC_THEMES.battle]: BattleTheme,
    [MUSIC_THEMES.race]: RaceTheme,
};

type AudioName = (typeof AUDIO_NAMES)[AudioEvent];
type MusicName = (typeof MUSIC_THEMES)[MusicTheme];

// Creates the audio elements for the game sound effects 
const audioPlayers = Object.fromEntries(
    Object.entries(sounds).map(([name, source]) => {
        const audio = new Audio(source);
        audio.preload = 'auto';
        audio.volume = 0.5;
        audio.addEventListener('error', () => {
            console.error(`Failed to preload audio: ${source}`);
        });
        return [name, audio]; // audio player gets associated with sound name
    })
) as Record<AudioName, HTMLAudioElement>;

// Creates the audio elements for the game music 
const musicPlayers = Object.fromEntries(
    Object.entries(music).map(([theme, source]) => {
        const audio = new Audio(source);
        audio.preload = 'none';
        audio.loop = true;
        audio.volume = 0.15;
        audio.addEventListener('error', () => {
            console.error(`Failed to preload background music: ${source}`);
        });
        return [theme, audio]; // audio player gets associated with music name
    })
) as Record<MusicName, HTMLAudioElement>;

let audioMuted = false;
let musicMuted = false;
let activeMusic: MusicTheme | null = null;
let userInteracted = false;

// Function to play the appropriate music for which screen the user is on 
const playBackgroundMusic = (theme: MusicTheme) => {
    const audio = musicPlayers[MUSIC_THEMES[theme]];
    if (musicMuted || !userInteracted || !audio.paused) {
        return;
    }

    audio.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
            return;
        }
        console.error(`Failed to play background music: ${MUSIC_THEMES[theme]}`, error);
    });
};

// Function to see if the user has interacted with the page, and
// then trigger the music accordingly. Used to get around browsers
// potentially blocking audio playback until a user interacts.
const handleUserInteraction = () => {
    userInteracted = true;
    if (activeMusic !== null) {
        playBackgroundMusic(activeMusic);
    }
};
document.addEventListener('pointerdown', handleUserInteraction, true);
document.addEventListener('keydown', handleUserInteraction, true);

// Synthetic key press event to trigger autoplay if the browser allows it
export const triggerAutoplay = () => {
    const keyEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    bubbles: true,
    cancelable: true
    });
    document.body.dispatchEvent(keyEvent);
};

// Function to track if sound effects have been muted
export const setAudioMuted = (muted: boolean) => {
    audioMuted = muted;
};

// Function to track if music has been muted and pause any
// playing tracks in response to being muted.
export const setMusicMuted = (muted: boolean) => {
    musicMuted = muted;
    if (activeMusic === null) {
        return;
    }

    const activeAudio = musicPlayers[MUSIC_THEMES[activeMusic]];
    if (muted) {
        activeAudio.pause();
    } else {
        playBackgroundMusic(activeMusic);
    }
};

// Preloads the sound effects for the game. Music is not preloaded to avoid
// download strain and extended load times on assets.
export const preloadAudio = () => {
    Object.values(audioPlayers).forEach((audio) => audio.load());
};

// Function to stop previous music and play the current theme that
// should be playing (unless muted)
export const setBackgroundMusic = (theme: MusicTheme | null) => {
    // If the theme comes through as null, the active music is stopped.
    // This functions to stop the music when a battle or race has ended.
    if (theme === null) {
        if (activeMusic !== null) {
            const previousAudio = musicPlayers[MUSIC_THEMES[activeMusic]];
            previousAudio.pause();
            previousAudio.currentTime = 0;
            activeMusic = null;
        }
        return;
    }

    // If the active music is different from the new music to be played,
    // stops the current music and sets the music to be played to the new track.
    if (activeMusic !== theme) {
        if (activeMusic !== null) {
            const previousAudio = musicPlayers[MUSIC_THEMES[activeMusic]];
            previousAudio.pause();
            previousAudio.currentTime = 0;
        }
        activeMusic = theme;
    }

    // If the music is muted, simply pauses the music player and never reaches
    // the playBackroundMusic(function). The theme was still changed above, but
    // will not be audible until the music is unmuted.
    if (musicMuted) {
        musicPlayers[MUSIC_THEMES[theme]].pause();
        return;
    }

    playBackgroundMusic(theme);
};

// Function to trigger/play game effect sounds
export const useAudioPlayer = (event: AudioEvent) => {
    if (audioMuted) { return; } // If audio is muted, do not play any sound

    const audio = audioPlayers[AUDIO_NAMES[event]];
    audio.currentTime = 0;
    audio.play();
};