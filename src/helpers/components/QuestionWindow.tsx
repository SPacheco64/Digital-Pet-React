import React from 'react';
import '../../../styles/components/question-window.scss';

interface QuestionWindowProps {
  dialogue: string;
  responsesArray: Array<string>;
}

const QuestionWindow: React.FC<QuestionWindowProps> = ({ dialogue, responsesArray }) => {
  return (
    <div className='question-window'>
      <div className='dialogue'>
        {dialogue}
      </div>

      <div className='responses'>
        {
          responsesArray.map((response, index) => (
            <span className={`reponse-option-${index+1}`}>
              {`${index+1}. ${response}`}
            </span>
          ))
        }
      </div>
    </div>
  );
};

export default QuestionWindow;
