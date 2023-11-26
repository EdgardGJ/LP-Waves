import React, { useState } from 'react';
import ParticleCanvas from './FractaCanvas';
import UserInteraction from './UserInteraction';
import p5 from 'p5';
import mathjs, { cos, formatDependencies, rotate, sin } from 'mathjs';
import ObservationComponent from './ObservationComponent';


function Memory() {
  const [interactionType, setInteractionType] = useState('seguimiento');
  const [particles, setParticles] = useState([]); // Define particles state
  const [particleState, setParticleState] = useState([]);
  let p;
  let centerX;
  let centerY;

  const handleInteraction = (interactionType, interactionLogic) => {
      setInteractionType(interactionType);

      setParticleState(
        particles.map((particle) => ({
        position: particle.position.copy(),
        velocity: particle.velocity.copy(),
        inVorticeMode: particle.inVorticeMode,
        target: { x: 0, y: 0 },
      })))
    };

   
  const hanldeStartSimulation = (formData) => {
    hanldeStartSimulation(formData);
  }

  const interactionLogic = (p, particles) => {
    switch (interactionType) {
      // Modalidades de exhibicion
      case 'seguimiento':
        // Logica de seguimiento utilixando el trackingmode
        // Dibuja y actualiza las particulas
        particles.forEach((particle, index) => {
          
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
      // Dibuja y actualiza las particulas
      particles.forEach((particle) => {
        
      });
          
    }
  };

  return (
    <div>
      <UserInteraction 
      handleInteraction={handleInteraction} 
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