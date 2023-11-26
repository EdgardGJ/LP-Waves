import React, { useState } from 'react';
import ParticleCanvas from './FractaCanvas';
import UserInteraction from './UserInteraction';
import p5 from 'p5';
import mathjs, { cos, formatDependencies, rotate, sin } from 'mathjs';
import ObservationComponent from './ObservationComponent';


function Memory() {
  const [interactionType, setInteractionType] = useState('default');
  const [particles, setParticles] = useState([]); // Define particles state
  const [particleState, setParticleState] = useState([]);
  let currentColor;
  let p;
  let centerX;
  let centerY;
  let trackingMode = false;


  

  const handleInteraction = (interactionType, interactionLogic) => {
    if (interactionType === 'Modo Exhibicion') {
      interactionType = 'seguimiento';
    }

      setInteractionType(interactionType);

      setParticleState(
        particles.map((particle) => ({
        position: particle.position.copy(),
        velocity: particle.velocity.copy(),
        inVorticeMode: particle.inVorticeMode,
        target: { x: 0, y: 0 },
      })))
    };

    

  const handleObservationModeChange = (selectedMode) => {
    if (selectedMode !== interactionType) {
      setInteractionType(selectedMode);
    }
  }
   

  const handleMenuSelection = (selectedOption) => {
    switch (selectedOption) {
      case 'Modo Exhibicion':
        interactionLogic();
      break;
      case 'Observacion de Datos':
        setInteractionType('observacion')
        break;
    }
    
  }

  const interactionLogic = (p, particles) => {
    
    switch (interactionType) {
      // Modalidades de exhibicion
      case 'seguimiento':
        let cursor;
        const colorPalette = ['#F8BD400', '#FA7268', '#7D4E57', '#379392', '#4FB0C6']
        
        // Logica de seguimiento utilixando el trackingmode
        // Dibuja y actualiza las particulas

        cursor = p.createVector(p.width / 2, p.height / 2);

        particles.forEach((particle) => {
          
          
          const direction = p5.Vector.sub(cursor, particle.position);
          direction.setMag(0.1);
          particle.velocity.add(direction);
            
    
          // Aplica limites a la velocidad
          const maxSpeed = 7;
          particle.velocity.limit(maxSpeed);
    
          // Actualiza la posicion
          particle.position.add(particle.velocity);
    
          // Rebota en los bordes
          if (particle.position.x < 0 || particle.position.x > p.width) {
            particle.velocity.y *= -1;
          }
          if (particle.position.y < 0 || particle.position.y > p.height) {
            particle.velocity.y *= -1;
          }

          if (p.millis() > particle.delay && p.millis() > particle.nextColorChange) {
            const currentColor = p.color(p.red(particle.color), p.green(particle.color), p.blue(particle.color), 150); // Aplica el color actual
            const nextColor = p.color(colorPalette[(colorPalette.indexOf(currentColor.toString()) + 1) % colorPalette.length])

            particle.color = p.lerpColor(currentColor, nextColor, 0.05);

            particle.nextColorChange = p.millis() + 200;
          }
          p.fill(particle.color);
          p.ellipse(particle.position.x, particle.position.y, particle.size, particle.size);
          
           // Actualiza la posicion del cursor al centro de la pantalla
      cursor.x = p.mouseX || p.width / 2;
      cursor.y = p.mouseY || p.height / 2
      trackingMode = true;
    
        });
       break;

      case 'vortice':
        // Logica de vortice 
        centerX = p.width / 2;
        centerY = p.height / 2;
        const angleIncrement = 0.001;
            
        particles.forEach((particle, index) => {
        if (particleState[index]) {
          particle.position = particleState[index].position.copy();
          particle.velocity = particleState[index].velocity.copy();
        }

          // Si no esta en modo vortice establece su punto de destino
        if (!particle.inVorticeMode) {
        const centerVector = p.createVector(centerX, centerY);
        const direction = p5.Vector.sub(centerVector, particle.position);
        particle.target = centerVector.copy(); // Establece el punto de destino al centro
        particle.inVorticeMode = true;
        }

        const direction = p5.Vector.sub(particle.target, particle.position);
        direction.rotate(angleIncrement); // Rota la direccion
        direction.setMag(0.1); // Ajusta la velocidad

        
        // Limites de velocidad
        const maxSpeed = 7;
        particle.velocity.add(direction);
        particle.velocity.limit(maxSpeed);

          // Limite area de dibujo
        if (particle.position.x < 0 || particle.position.x > p.width) {
          particle.velocity.y *= -1;
        }
        if (particle.position.y < 0 || particle.position.y > p.height) {
          particle.velocity.y *= -1;
        }

          // Actualizacion de posicion
        particle.position.add(particle.velocity);

        // Color

        // Tamaño
        const minSize = 5;
        const maxSize = 15;
        particle.size = p.random(minSize, maxSize);

        
        });
      break;

      case 'tesseract':
      centerX = p.width / 2;
      centerY = p.height / 2;
      const tesseractRadius = Math.min(centerX, centerY) * 0.4;
      const numVertices = 8;
      const speed = 0.002;

      const tesseractVertices = [];
      for (let i = 0; i < numVertices; i++) {
        
        const x = centerX + tesseractRadius * (i === 0 || i === 3 || i === 4 || i === 7 ? -1 : 1);
        const y = centerY + tesseractRadius * (i === 0 || i === 1 || i === 4 || i === 5 ? -1 : 1);
        const z = centerY + tesseractRadius * (i < 4 ? -1 : 1);
        tesseractVertices.push(p.createVector(x, y, z));
      }

      particles.forEach((particle, index) => {
        if (particleState[index]) {
          particle.position = particleState[index].position.copy();
          particle.velocity = particleState[index].velocity.copy();
        }

        const t = p.millis() * 0.001 * speed + (index / particles.length);
        const currentVertexIndex = Math.floor(t * numVertices) % numVertices;
        const nextVertexIndex = (currentVertexIndex + 1) % numVertices;
        const fraction = (t * numVertices) - currentVertexIndex;

        const startVertex = tesseractVertices[currentVertexIndex];
        const endVertex = tesseractVertices[nextVertexIndex];

        const targetX = startVertex.x + fraction * (endVertex.x - startVertex.x);
        const targetY = startVertex.y + fraction * (endVertex.y - startVertex.y);
        const targetZ = startVertex.z + fraction * (endVertex.z - startVertex.z);

        const target3D = p.createVector(targetX, targetY, targetZ);

        const direction = p5.Vector.sub(target3D, particle.position);
        direction.setMag(0.2);
        particle.velocity.add(direction);
        particle.velocity.limit(5);
        particle.position.add(particle.velocity);

        const maxDistance = tesseractRadius * 1.5;
        const distanceToCenter = particle.position.dist(p.createVector(centerX, centerY));
        if (distanceToCenter > maxDistance) {
          const centerDirection = p5.Vector.sub(p.createVector(centerX, centerY), particle.position);
          centerDirection.setMag(0.1);
          particle.velocity.add(centerDirection);
        }
      })
      break;
      
      // Agregar mas casos
      default:
        const colorPalette2 = ['#F8BD400', '#FA7268', '#7D4E57', '#379392', '#4FB0C6']
        
        
        // Dibuja y actualiza las particulas
        particles.forEach((particle) => {
          if (p.millis() > particle.delay && p.millis() > particle.nextColorChange) {
            const currentColor = p.color(p.red(particle.color), p.green(particle.color), p.blue(particle.color), 150); // Aplica el color actual
            const nextColor = p.color(colorPalette[(colorPalette.indexOf(currentColor.toString()) + 1) % colorPalette.length])

            particle.color = p.lerpColor(currentColor, nextColor, 0.05);

            particle.nextColorChange = p.millis() + 200;
        
            particle.update(currentColor);
            particle.display();
    }
  });
  
          
    }
  };

  return (
    <div>
      <UserInteraction 
      handleInteraction={handleInteraction} 
      handleObservationModeChange={handleObservationModeChange}
      />
      <ObservationComponent
      particles={particles}
      updateParticles={setParticles}
      selectedMode={interactionType}
      interactionLogic={interactionLogic}
      handleObservationModeChange={handleObservationModeChange}
      />
      
      <ParticleCanvas 
      interactionType={interactionType} 
      particles={particles} 
      trackingMode={interactionType === 'seguimiento'} 
      updateParticles={setParticles}
      interactionLogic={interactionLogic}
      />
    </div>
  );
}

export default Memory;