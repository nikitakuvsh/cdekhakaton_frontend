import React, { useEffect, useState } from "react";
import './InformationModal.css';

export default function InformationModal({ message, isError, onClose, messageError }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isClosing) {
      const closeTimer = setTimeout(onClose, 500);
      return () => clearTimeout(closeTimer);
    }
  }, [isClosing, onClose]);

  return (
    <div className={`info-modal ${isError ? 'info-modal--error' : 'info-modal--success'} ${isClosing ? 'info-modal--closing' : ''}`}>
      <div className="info-modal__content">
        <span className="info-modal__close" onClick={() => setIsClosing(true)}>&times;</span>
        <p>{message}</p>
        <p>{messageError}</p>
      </div>
    </div>
  );
}
