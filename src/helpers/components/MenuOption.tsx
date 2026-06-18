import React from 'react';

interface MenuOptionProps {
  onClick: () => void;
  icon: string | null;
  optionName: string;
}

const MenuOption: React.FC<MenuOptionProps> = ({ onClick, icon, optionName }) => {
  return (
    <div className='menu-option'>
      <button onClick={onClick} className='menu-btn'>
        {
          icon &&
          <img src={icon} alt={optionName} />
        }
      </button>
    </div>
  );
};

export default MenuOption;
