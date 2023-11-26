import React, { useEffect, useRef, useState } from 'react';
import '../hojas de estilo/ObservationComponent.css'
import Draggable from 'react-draggable';
import p5 from 'p5';
<style>
@import url('https://fonts.cdnfonts.com/css/sciallo');
@import url('https://fonts.cdnfonts.com/css/brave-new-era-g98');
</style>

const ObservationComponent = ({selectedMode, interactionLogic, updateParticles }) => {
  const [formData, seletFormData] = useState({});
  const [observationFields, setObservationFields] = useState([]);
  const [simulationInterval, setSimulationInterval] = useState(null)
  const [frameRate, setFrameRate] =useState(30);

 const canvasWidth = 800;
 const canvasHeight = 600;

 const nodeRef = useRef(null)



  const handleInputChange = (field, value) => {
    seletFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

  useEffect(() => {
    return() => {
      // Limpia el intervalocuando el componente se desmonte
      clearInterval(simulationInterval);
    };
  }, []);

  const stormParticleLogic = (numericFormData) => {
    const { Intensity, ParticleCount, SpeedVariation } = formData;
    alert('Modo recibido')
    

    // Logica especifica para el modo StormParticle
    

    // Crear particulas con propiedades iniciales
    const particles = [];
    for (let i = 0; i < ParticleCount; i++) {
      const particle = {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 5,
        speed: Math.random() * SpeedVariation,
        direction: Math.random() * 360,
      };
      particles.push(particle);
    }
    alert('Particulas listas')

    alert(`Estado del intervalo: ${simulationInterval}`)

    // Funcion para actualizar el estado de las particulas en cada fotograma
    const updateParticlesInternal = (particles) => {
      alert('Particulas cargadas');
      particles.forEach((particle) => {
        particle.x += particle.speed * Math.cos(particle.direction);
        particle.y += particle.speed * Math.sin(particle.direction);

        if (particle.x < 0 || particle.x > canvasWidth || particle.y < 0 || particle.y > canvasHeight) {
          particle.x = Math.random() * canvasWidth;
          particle.y = Math.random() * canvasHeight;
        }
       return particle;
      });
      interactionLogic(particles)
      alert('Particulas completas')
    };


    // Iniciar la simulacion
    if (!simulationInterval) {
    const interval = setInterval(() => {
      alert('Iniciando modo stormParticle')
      updateParticlesInternal();
      
      // Dibujar las particulas en el lienzo
    }, 1000 / frameRate);

      setSimulationInterval(interval)
    }
  };

  const handleObservationModeChange = (newMode) => {
    
    if (newMode === 'stormParticle') {
      setObservationFields(['Intensity', 'ParticleCount', 'SpeedVariation']);
    } else {
      setObservationFields([]);
    }
    
  }

  const hanldeStartSimulation = (formData) => {
      if (Object.keys(formData).length === 0) {
        console.error('No hay datos del formulario para iniciar la simulacion')
        return;
      }

      const numericFormData = {};
      for (const field in formData) {
        const numericValue = parseFloat(formData[field]);
        // Validacion de datos proporcionados por el usuario
      if (!isNaN(numericValue)) {
        numericFormData[field] = numericValue;
      } else {
        console.error('Datos no válidos. Por favor, ingrese números válidos.');
      return;
    }
  }
    
    switch (selectedMode) {
      case 'stormParticle' :
        stormParticleLogic(numericFormData);
        break;
      default:
    }
  }

  const renderObservationForm = () => {
    switch(selectedMode) {
      case 'stormParticle':
        return (
          <Draggable nodeRef={nodeRef}>
          <div ref={nodeRef}
          className='formulary-container'>
            <p className='formulary-title'>StormParticle</p>
            {observationFields.map((field) => (
              <label key={field}>
                {field}:
                <input
                type='text'
                value={formData[field] || '' }
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={`Ejemplo ${field === 'Intensity' ? '10' : field === 'ParticleCount' ? '500' : '5'}`}
              />
              </label>
            ))}
            <button 
            className='buton-start'
            onClick={() => hanldeStartSimulation(formData)}>
              Start Simulation
            </button>
          </div>
          </Draggable>
        );
    break;

    default:
      return null;
    

    }
  };

  useEffect(() => {
    handleObservationModeChange(selectedMode);
  }, [selectedMode]);

  return (
    <div>
      {renderObservationForm()}
      
    </div>
  );
};

export default ObservationComponent;