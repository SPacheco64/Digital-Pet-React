import React, { useEffect, useState } from 'react';
import { OptionsMenuProps } from '../../types';
import { saveFunction, resetFunction, githubFunction, retroFunction, infoFunction } from '../functions/OperationalFunctions';
import closedMenuIcon from '../graphics/icons/external_ui/closed-menu.svg';
import openedMenuIcon from '../graphics/icons/external_ui/opened-menu.svg';
import saveIcon from '../graphics/icons/external_ui/save.svg';
import resetIcon from '../graphics/icons/external_ui/reset.svg';
import retroIcon from '../graphics/icons/external_ui/retro.svg';
import githubIcon from '../graphics/icons/external_ui/github.svg';
import infoIcon from '../graphics/icons/external_ui/info-i.svg';

const OptionsMenu: React.FC<OptionsMenuProps> = (props: OptionsMenuProps) => {
  // Destructure props for ease of access & documentation
  const {

  } = props;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const optionsArray = [
    {optionName: 'Save', function: saveFunction, icon: saveIcon},
    {optionName: 'Reset', function: resetFunction, icon: resetIcon},
    {optionName: 'Retro', function: retroFunction, icon: retroIcon},
    {optionName: 'Portfolio', function: githubFunction, icon: githubIcon},
    {optionName: 'Info', function: infoFunction, icon: infoIcon}
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
                        <div className='option-container'>
                            <button key={index} onClick={option.function} onMouseEnter={() => {
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