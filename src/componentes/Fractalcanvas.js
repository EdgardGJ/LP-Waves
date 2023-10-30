import React, { useEffect } from 'react';
import p5 from 'p5';
import mathjs from 'mathjs';

const ParticleCanvas = () =>  {
 useEffect (() => {
  const s = (p) => {
    let particles = [];
    const maxParticles = 500;
    let cursor;
    let currentColor = 0;
    let colors = [];
    let colorIndex = 0;
    let colorChangeTimer = 0;
    let colorChangeInterval = 500; // cambiar cada dos segundo

    p.setup = () => {
      p.createCanvas(window.innerWidth, window.innerHeight);
      p.noStroke();

      cursor = p.createVector(p.width / 2, p.height / 2);

      // Definir una paleta de colores suaves
      colors = [p.color(255, 0, 0, 150), p.color(0, 255, 0, 150), p.color(0, 0, 255, 150)];

      for ( let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    };

    p.draw = () => {
      p.background(0);

      // Actualiza la posicion del cursor al centro de la pantalla
      cursor.x = p.mouseX || p.width / 2;
      cursor.y = p.mouseY || p.height / 2;

      // Cambia el color suavemnte 
      if (p.millis() - colorChangeTimer > colorChangeInterval) {
        colorChangeTimer = p.millis();
        colorIndex = (colorIndex + 1) % colors.length;
      }

      // Dibuja y actualiza las particulas
      particles.forEach((particle) => {
        particle.update();
        particle.display(colors[colorIndex]);
      });
    };

    class Particle {
      constructor() {
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p.createVector(0, 0);
        this.size = p.random(5, 15);
        this.maxSpeed = 5;

      }


      update() {
        // Calcula la atraccion hacia el cursor
        const direction = p5.Vector.sub(cursor, this.position);
        direction.setMag(0.1);
        this.velocity.add(direction);

        // Aplica limites a la velocidad
        
        this.velocity.limit(this.maxSpeed);

        // Actualiza la posicion
        this.position.add(this.velocity);

      }

      display(color) {
        p.fill(color);
        p.ellipse(this.position.x, this.position.y, this.size, this.size);
      }
    }
  }

  new p5(s);
 }, []);

  return <div id='particle-conteiner' />
};

export default ParticleCanvas;