import React, { useEffect } from 'react';
import p5 from 'p5';
import mathjs from 'mathjs';

const ParticleCanvas = () =>  {
 useEffect (() => {
  const s = (p) => {
    let particles = [];
    const maxParticles = 500;
    let cursor;
    let currentColor = p.color(p.random(255), p.random(255), p.random(255), 150);
    let nextColorChange = 0;

    p.setup = () => {
      p.createCanvas(window.innerWidth, window.innerHeight);
      p.noStroke();

      cursor = p.createVector(p.width / 2, p.height / 2);

      for ( let i = 0; i < maxParticles; i++) {
        const delay = i * 200; // cambia cada 200 milisegundos
        particles.push(new Particle(delay));
      }
    };

    p.draw = () => {
      p.background(0);

      // Cambia el color con un cierto retraso
      if (p.millis() > nextColorChange) {
        currentColor = p.color(p.random(255), p.random(255), p.random(255), 150);
        nextColorChange = p.millis() + 2000;
      }

      // Actualiza la posicion del cursor al centro de la pantalla
      cursor.x = p.mouseX || p.width / 2;
      cursor.y = p.mouseY || p.height / 2;


      // Dibuja y actualiza las particulas
      particles.forEach((particle) => {
        particle.update(currentColor);
        particle.display();
      });
    };

    class Particle {
      constructor(delay) {
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p.createVector(0, 0);
        this.size = p.random(5, 15);
        this.delay = delay;
        this.color = currentColor; // Mismo color paratodas las particulas
        this.maxSpeed = 7;

      }


      update(color) {
        if (p.millis() > this.delay) {
          this.color = color; // Aplica el color actual
        }

        // Calcula la atraccion hacia el cursor
        const direction = p5.Vector.sub(cursor, this.position);
        direction.setMag(0.1);
        this.velocity.add(direction);

        // Aplica limites a la velocidad
        this.velocity.limit(this.maxSpeed);

        // Actualiza la posicion
        this.position.add(this.velocity);

        // Rebota en los border
        if (this.position.x < 0 || this.position.x > p.width) {
          this.velocity.y *= -1;
        }
        if (this.position.y < 0 || this.position.y > p.height) {
          this.velocity.y *= -1;
        }

      }

      display() {
        p.fill(this.color);
        p.ellipse(this.position.x, this.position.y, this.size, this.size);
      }
    }
  }

  new p5(s);
 }, []);

  return <div id='particle-conteiner' />
};

export default ParticleCanvas;