import React from 'react';
import '../../../styles/components/welcome-form.scss';

interface WelcomeFormProps {
    welcomeMessage: string;
    question1: string;
    question2: string;
    val1: string;
    val2: string;
    setVal1: React.Dispatch<React.SetStateAction<string>>;
    setVal2: React.Dispatch<React.SetStateAction<string>>;
    buttonTxt: string;
    hideWelcomeForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const WelcomeForm: React.FC<WelcomeFormProps> = ({ welcomeMessage, question1, question2, val1, val2, setVal1, setVal2, buttonTxt, hideWelcomeForm }) => {

    const handlePlayerName = (event: any) => {
        setVal1(event.target.value);
    };

    const handleChocoboName = (event: any) => {
        setVal2(event.target.value);
    };

    return (
        <div id='WelcomeForm' className='question-window game-screen additional-screen'>
            <div className='welcome-message'>
                {welcomeMessage}
            </div>

            {
                question1 &&
                <>
                    <div className='dialogue'>
                        {question1}
                    </div>
                    
                    <input value={val1} onChange={handlePlayerName} maxLength={10} minLength={1}></input>
                </>
            }

            {
                question2 &&
                <>
                    <div className='dialogue'>
                        {question2}
                    </div>
                    
                    <input value={val2} onChange={handleChocoboName} maxLength={10} minLength={1}></input>
                </>
            }

            <button onClick={() => hideWelcomeForm(true)} className={`${(val1 && val2) ? '' : 'disabled'}`}>
                { buttonTxt }
            </button>
        </div>
    );
};

export default WelcomeForm;
