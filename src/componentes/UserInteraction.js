import React, { useState } from 'react';
import '../hojas de estilo/UserInteraction.css'

const UserInteraction = ({ handleInteraction }) => {
    const interactionModes = ['seguimiento', 'vortice', 'tesseract']
    const [interactionState, setInteractionState] = useState('seguimiento');

    const handleButtonClick = () => {
        //Encuentra el indice actual en el array
        const currentIndex = interactionModes.indexOf(interactionState);

        // Calcula el proximo indice
        const nextIndex = (currentIndex + 1) % interactionModes.length;

        // Obtiene el proximo modo de interaccion segun el indice
        const nextInteractionMode = interactionModes[nextIndex];

        // Actualiza el estado de interacion
        setInteractionState(nextInteractionMode);

        // Llama a la funcion handleInteraction para cambiar el modo
        handleInteraction(nextInteractionMode);
    }

    return (
        <div className='boton-container'>
            <button onClick={handleButtonClick} className='boton-particulas'>
                {interactionState === 'seguimiento' ? 'Vórtice' : interactionState === 'vortice' ? 'Tesseract' : 'Seguimiento'}
            </button>
        </div>
    );
};

export default UserInteraction;