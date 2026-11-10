import React, { useEffect, useRef, useState } from 'react';
import { OptionsMenuProps } from '../../types';
import { githubFunction, websiteFunction } from '../functions/OperationalFunctions';
import closedMenuIcon from '../../graphics/icons/external_ui/closed-menu.svg';
import openedMenuIcon from '../../graphics/icons/external_ui/opened-menu.svg';
import saveIcon from '../../graphics/icons/external_ui/save.svg';
import autosaveIcon from '../../graphics/icons/external_ui/autosave.svg';
import autosaveDisabledIcon from '../../graphics/icons/external_ui/autosave-disabled.svg';
import resetIcon from '../../graphics/icons/external_ui/reset.svg';
import retroIcon from '../../graphics/icons/external_ui/retro.svg';
import githubIcon from '../../graphics/icons/external_ui/github.svg';
import webIcon from '../../graphics/icons/external_ui/website-icon.svg'
import mutedIcon from '../../graphics/icons/external_ui/muted.svg';
import unmutedIcon from '../../graphics/icons/external_ui/unmuted.svg';
import musicMutedIcon from '../../graphics/icons/external_ui/music-muted.svg';
import musicEnabledIcon from '../../graphics/icons/external_ui/music-enabled.svg';
import { setAudioMuted, useAudioPlayer } from '../functions/AudioPlayer';

const OptionsMenu: React.FC<OptionsMenuProps> = ({
    onSave,
    onReset,
    autosaveEnabled,
    setAutosaveEnabled,
    retroMode,
    setRetroMode,
    isMuted,
    setIsMuted,
    isMusicMuted,
    setIsMusicMuted,
}: OptionsMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, []);

  const optionsArray = [
        {optionName: 'Save', function: () => {
            useAudioPlayer('touch');
            onSave();
        }, icon: saveIcon, isToggle: false, isActive: false},
        {optionName: 'Reset', function: () => {
            useAudioPlayer('touch');
            onReset();
        }, icon: resetIcon, isToggle: false, isActive: false},
        {
                optionName: `Autosave: ${autosaveEnabled ? 'On' : 'Off'}`,
                function: () => {
                    useAudioPlayer('touch');
                    setAutosaveEnabled((enabled) => !enabled);
                }, icon: autosaveEnabled ? autosaveIcon : autosaveDisabledIcon, isToggle: true, isActive: autosaveEnabled,
        },
        {optionName: `Sounds: ${isMuted ? 'Off' : 'On'}`, function: () => {
            const unmuting = isMuted;
            if (unmuting) {
                // Only play the sound when unmuting. Sets the audioMuted 
                // state to false before playing the sound to ensure it 
                // plays correctly.
                setAudioMuted(false);
                useAudioPlayer('touch');
            }
            setIsMuted((muted) => !muted);
        }, icon: isMuted ? mutedIcon : unmutedIcon, isToggle: true, isActive: isMuted},
        {optionName: `Music: ${isMusicMuted ? 'Off' : 'On'}`, function: () => {
            setIsMusicMuted((muted) => !muted);
            useAudioPlayer('touch');
        }, icon: isMusicMuted ? musicMutedIcon : musicEnabledIcon, isToggle: true, isActive: isMusicMuted},
        {optionName: `Retro: ${retroMode ? 'On' : 'Off'}`, function: () => {
            useAudioPlayer('touch');
            setRetroMode((enabled) => !enabled);
        }, icon: retroIcon, isToggle: true, isActive: retroMode},
        {optionName: 'Repo', function: () => {
            useAudioPlayer('touch');
            githubFunction();
        }, icon: githubIcon, isToggle: false, isActive: false},
        {optionName: 'Portfolio', function: () => {
            useAudioPlayer('touch');
            websiteFunction();
        }, icon: webIcon, isToggle: false, isActive: false},
  ];

  return (
    <div id='OptionsMenu' ref={optionsMenuRef}>
        <button onClick={() => {
            useAudioPlayer('select');
            setIsMenuOpen(!isMenuOpen);
        }} className='options-btn'>
            {
                !isMenuOpen &&
                <div className='options-menu-icon'>
                    <img src={closedMenuIcon} alt='open options menu' />
                </div>
            }
            {
                isMenuOpen &&
                <div className='options-menu-icon'>
                    <img src={openedMenuIcon} alt='close options menu' />
                </div>
            }
        </button>

        {
            isMenuOpen &&
            <div className='option-selection'>
                {
                    optionsArray.map((option, index) => (
                        <div className='option-container' key={index}>
                            <button
                                onClick={option.function}
                                aria-pressed={option.isToggle ? option.isActive : undefined}
                                onMouseEnter={() => {
                                const optionEle = document.getElementById(`option-${index}`);
                                if (optionEle) {
                                    optionEle.style.visibility = 'visible';
                                }
                            }} onMouseLeave={() => {
                                const optionEle = document.getElementById(`option-${index}`);
                                if (optionEle) {
                                    optionEle.style.visibility = 'hidden';
                                }
                            }}>
                                <img src={option.icon} alt={option.optionName} />
                            </button>

                            <span style = {{visibility: 'hidden'}} className='hover-text' id={`option-${index}`}>
                                {option.optionName}
                            </span>
                        </div>
                    ))
                }
            </div>
        }
    </div>
  );
};

export default OptionsMenu;