import React from 'react';
interface MenuOptionProps {
  onClick: () => void;
  icon: string;
  optionName: string;
}

const MenuOption: React.FC<MenuOptionProps> = ({ onClick, icon, optionName }) => {
  return (
    <div className='menu-option'>
      <button onClick={onClick} className='menu-btn'>
        <img src={icon} alt={optionName} />
      </button>
    </div>
  );
};

export default MenuOption;
