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
            <div className={`question-container reponse-option-${index+1}`}>
              <span className='question-num'>{index+1}.</span> 
              <span className='question-text'>{response}</span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default QuestionWindow;
