import React, { useEffect, useRef, useState } from 'react';
import { ColorPickerProps } from '../../types';
import colorPickerIcon from '../../graphics/icons/external_ui/color-picker.svg';
import { useAudioPlayer } from '../functions/AudioPlayer';

const ColorPicker: React.FC<ColorPickerProps> = (props: ColorPickerProps) => {
  // Destructure props for ease of access & documentation
  const {
    setCurrentShellColor,
  } = props;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, []);

  const colorArray = [
    {colorName: 'orange', circleColor: '#fa9d23'},
    {colorName: 'red', circleColor: '#f21616'},
    {colorName: 'green', circleColor: '#18d935'},
    {colorName: 'blue', circleColor: '#1342cf'},
    {colorName: 'pink', circleColor: '#fc62f5'},
    {colorName: 'purple', circleColor: '#7b0bb3'},
    {colorName: 'gray', circleColor: '#9e9d9e'},
    {colorName: 'yellow', circleColor: '#ffff00'}
  ];

  return (
    <div id='ColorPicker' ref={colorPickerRef}>
        <button onClick={() => {
            useAudioPlayer('select');
            setIsMenuOpen(!isMenuOpen);
        }} className='options-btn'>
            <div className='color-menu-icon'>
                <img className={isMenuOpen ? 'open' : 'closed'} src={colorPickerIcon} alt='open options menu' />
            </div>
        </button>

        {
            isMenuOpen &&
            <div className='color-selection'>
                {
                    colorArray.map((color, index) => (
                        <button key={index} onClick={() => {
                            useAudioPlayer('touch');
                            setCurrentShellColor(color.colorName);
                        }}>
                            <span className={`color-circle ${color.colorName}`} style={{backgroundColor: color.circleColor}}>{color.colorName}</span>
                        </button>
                    ))
                }
            </div>
        }
    </div>
  );
};

export default ColorPicker;