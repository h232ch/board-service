// src/components/NewComponent/NewComponent.tsx
import React from 'react';
import './NewComponent.css';

interface NewComponentProps {
  // props 타입 정의
  title?: string;
  onClick?: () => void;
}

const NewComponent: React.FC<NewComponentProps> = ({ 
  title = 'Default Title',
  onClick
}) => {

  
  return (
    <div className="new-component">
      <h2 className="title" onClick={onClick}>{title}</h2>
      {/* 컴포넌트 내용 */}
    </div>
  );
};

export default NewComponent;