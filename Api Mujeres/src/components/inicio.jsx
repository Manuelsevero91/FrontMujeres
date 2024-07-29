import React from 'react';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate('/login');
  };
  return (
    <div className="inicio-container">
      <div >
        <h1 className="inicio-title">Mujeres Destacadas </h1>
        <button className="inicio-btn" onClick={handleLoginRedirect}>
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};
export default Inicio;




