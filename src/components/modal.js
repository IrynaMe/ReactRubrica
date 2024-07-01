import React from 'react';

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={modalContentStyle}>
        <span className="modal-close" onClick={closeModal} style={closeIconStyle}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

const modalContentStyle = {
    background: 'rgba(255, 193, 7, 0.5)', // 50% opacity
   // background:"#ffc107",
    //border: '1px solid white',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
    position: 'relative',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',

  };

const closeIconStyle = {
  position: 'absolute',      
  top: '5px',              
  right: '5px',            
  fontSize: '36px',          
  cursor: 'pointer',         
  zIndex: '100',             
};

export default Modal;
