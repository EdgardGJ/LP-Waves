import React, { useEffect, useState } from 'react';
import '../hojas de estilo/UserInteraction.css'
import logo from '../Image/LP-waves-logo.png'
<style>
@import url('https://fonts.cdnfonts.com/css/downlink');
@import url('https://fonts.cdnfonts.com/css/brave-new-era-g98');
@import url('https://fonts.cdnfonts.com/css/ysabeau-infant');
@import url('https://fonts.cdnfonts.com/css/sciallo');
</style>


const UserInteraction = ({ handleInteraction, handleMenuSelection, handleObservationModeChange }) => {
    const [currentMode, setCurrentMode] = useState('')
    const [menuOpen, setMenuOpen] = useState(false)
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)

    const handleButtonClick = () => {
        
        setMenuOpen(!menuOpen);
    }

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const handleMenuOptionClick = (option) => {
        
        setShowWelcomeMessage(false)
        
        if (currentMode === 'Modo Exhibicion' && option === 'Modo Exhibicion') {
            alert('Ya estas en modo exhibición carnal');
        } else {
            handleInteraction(option);
            setCurrentMode(option);
        }
        if (currentMode === 'Observacion de Datos' && option === 'stormParticle' && setMenuOpen === menuOpen) {
            setMenuOpen(!menuOpen)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcomeMessage(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='boton-container'>
            {/* Boton del menu */}
            <button 
            className='menu-button'
            onClick={handleButtonClick}>
                Menú
            </button>
            <img src={logo} />

            {showWelcomeMessage && (
                <div className='welcome-message'>
                    <p className='title-welcome'>
                        Bienvenido a LP Wave
                    </p>
                    <p className='sub-message'>
                        Interactua en tiempo real con las particulas en el Modo Exhibión o en Observacion de Datos y conoce sus distintos comportamientos.
                    </p>
                </div>
            )}

            {menuOpen && (
                <div className='menu-options'>
                    <p className='select-message'>Seleccione una opción</p>
                <div className={`menu-options ${menuOpen ? 'show' : 'hide'}`}> 
                <div 
                id='exhibicion-button'
                className='menu-option' 
                onClick={() => handleMenuOptionClick('Modo Exhibicion')}
                title='El modo exhibición te permite conocer algunos comportamientos predeterminados de las particulas'>
                    Modo Exhibición
                </div>

                {currentMode === 'Modo Exhibicion' && (
                    <>
                        <button className='exhibicion-modes'
                         onClick={() => handleInteraction('seguimiento')}>
                            Cambiar a seguimiento
                        </button>
                        <button className='exhibicion-modes'
                        onClick={() => handleInteraction('vortice')}>
                            Cambiar a vórtice
                        </button>
                        <button className='exhibicion-modes'
                        onClick={() => handleInteraction('tesseract')}>
                            Cambiar a Tesseract
                        </button>
                        
                    </>
                )}

                <div 
                id='observacion-button'
                className='menu-option' 
                onClick={() =>handleMenuOptionClick('Observacion de Datos')}
                title='Interactua de forma directa con las particulas para crear simulaciones' >
                    Observación de Datos
                </div>
                {currentMode === 'Observacion de Datos' && (
                    <>
                        <button 
                        className='observacion-modes'
                        onClick={() => handleMenuOptionClick('stormParticle')}>
                            StormParticle
                        </button>
                        
                        
                    </>
                )}
                </div> 


                
                </div>
            )}

           
        </div>
    );
};

export default UserInteraction;