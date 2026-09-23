import React, { useEffect, useState } from 'react';
import { OptionsMenuProps } from '../../types';
import { githubFunction, retroFunction, websiteFunction, lightOrDarkFunction } from '../functions/OperationalFunctions';
import closedMenuIcon from '../../graphics/icons/external_ui/closed-menu.svg';
import openedMenuIcon from '../../graphics/icons/external_ui/opened-menu.svg';
import saveIcon from '../../graphics/icons/external_ui/save.svg';
import autosaveIcon from '../../graphics/icons/external_ui/autosave.svg';
import resetIcon from '../../graphics/icons/external_ui/reset.svg';
import retroIcon from '../../graphics/icons/external_ui/retro.svg';
import githubIcon from '../../graphics/icons/external_ui/github.svg';
import webIcon from '../../graphics/icons/external_ui/website-icon.svg'

const OptionsMenu: React.FC<OptionsMenuProps> = ({
    onSave,
    onReset,
    autosaveEnabled,
    setAutosaveEnabled,
}: OptionsMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const optionsArray = [
        {optionName: 'Save', function: onSave, icon: saveIcon, isToggle: false},
        {optionName: 'Reset', function: onReset, icon: resetIcon, isToggle: false},
        {
                optionName: `Autosave: ${autosaveEnabled ? 'On' : 'Off'}`,
                function: () => setAutosaveEnabled((enabled) => !enabled),
                icon: autosaveIcon,
                isToggle: true,
        },
        {optionName: 'Retro', function: retroFunction, icon: retroIcon, isToggle: false},
        {optionName: 'Repo', function: githubFunction, icon: githubIcon, isToggle: false},
        {optionName: 'Portfolio', function: websiteFunction, icon: webIcon, isToggle: false},
  ];

  return (
    <div id='OptionsMenu'>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='options-btn'>
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
                                aria-pressed={option.isToggle ? autosaveEnabled : undefined}
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