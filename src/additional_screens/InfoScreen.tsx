import React from 'react';
import { InfoScreenProps } from '../types';
import '../../styles/components/info-screen.scss';

const InfoScreen: React.FC<InfoScreenProps> = (props: InfoScreenProps) => {
  // Destructure props for ease of access & documentation
  const {

} = props;

  const infoArray = [
    {
        content: "Welcome to the world of Chocobo raising! Here you will find some tips of the trade, so take note!",
        classes: "info-block"
    },
    {
        content: "Want to mute sounds,turn on music, change the game colors, check out the dev of this game & more? Be sure to check the external options in the upper left & upper right of the webpage!",
        classes: "info-block"
    },
    {
        content: "Be sure to monitor your Chocobo's status often! Your Chocobo's health and happiness are crucial. You can check your Chocobo's status at any time by pressing the feather button on the far left of this menu.",
        classes: "info-block"
    },
    {
        content: "Training, battling, and racing are all important aspects of your Chocobo's growth - BUT be warned, if you neglect the happiness, energy, or hunger of your feathered friend, some options may  become temporarily unavailable to you or your Chocobo may become disobedient.",
        classes: "info-block"
    },
    {
        content: "Be sure to check the shop (the second option on this menu). In there you will find items that will greatly help in the growth of your Chocobo, and to prepare you both for the challenges ahead!",
        classes: "info-block"
    },
    {
        content: "Playing games with your Chocobo is not only a great way to make your Chocobo happy, but it can also earn you G to spend on items in the shop!",

        classes: "info-block"
    },
    {
        content: "Playing games with your Chocobo is not only a great way to make your Chocobo happy, but it can also earn you G to spend on items in the shop!",
        classes: "info-block"
    },
    {
        content: "If you are a big achievement hunter, be sure to raise your Chocobo to new heights!",
        classes: "info-block"
    },
    {
        content: "This game uses an autosave feature by default. If you wish to turn this off and save manually, you can find these options in the external settings menu on the upper right of your browser window. You also have the option to reset your game if you want to start fresh!",
        classes: "info-block"
    },
    {
        content: "Be careful not to overstrain your Chocobo in battle! It might get an injury it can't bounce back from, so do not take on challenges unprepared!",
        classes: "info-block warning"
    },
  ];

  return (
    <div id='InfoScreen' className='game-screen additional-screen'>
        <div className='title'>
            Info & Tips
        </div>

        <div className='info-text'>
            {/* Map through the infoArray so new content can easily be created
                and rendered without manually setting up info blocks.*/}
            { 
                infoArray.map((block) => 
                    <div className={block.classes}>
                        {block.content}
                    </div>
                )
            }
        </div>
    </div>
  );
};

export default InfoScreen;