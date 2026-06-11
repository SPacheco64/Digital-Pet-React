import React from 'react';
import '../../../styles/components/question-window.scss';
import chocoIcon from '../../graphics/creature_sprites/small_choco/choco-looking-away.png'

interface QuestionWindowProps {
  dialogue: string;
  responsesArray: Array<string>;
}

const QuestionWindow: React.FC<QuestionWindowProps> = ({ dialogue, responsesArray }) => {
  return (
    <div className='question-window game-screen additional-screen'>
      <div className='dialogue'>
        {dialogue}
      </div>

      <div className='responses'>
        {
          responsesArray.map((response, index) => (
            <div key={index} className={`question-container reponse-option-${index+1}`}>
              <span className='question-num'>{index+1}.</span> 
              <span className='question-text'>{response}</span>
            </div>
          ))
        }
      </div>

      <div className='choco-icon'>
          <img src={chocoIcon} />
      </div>
    </div>
  );
};

export default QuestionWindow;
