'use strict';

const canvas = document.getElementById('intro-background');
const ctx = canvas.getContext('2d');
const ellisColors = [
  "{{site.color.ellis-red}}",
  "{{site.color.ellis-green}}",
  "{{site.color.ellis-turquoise}}",
  "{{site.color.ellis-orange}}",
  "{{site.color.ellis-blue}}"
];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

class Boid {
  constructor(x, y) {
    this.position = { x: x, y: y };
    this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    this.acceleration = { x: 0, y: 0 };
    this.maxSpeed = 2;
    this.maxForce = 0.03;
    this.color = randomChoice(ellisColors);
  }

  // Update boid position based on velocity and acceleration
  update() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    // Limit speed
    let speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  // Apply a force to the boid's acceleration
  applyForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  // Wrap around edges of the canvas
  edges() {
    if (this.position.x < 0) this.position.x = canvas.width;
    if (this.position.y < 0) this.position.y = canvas.height;
    if (this.position.x > canvas.width) this.position.x = 0;
    if (this.position.y > canvas.height) this.position.y = 0;
  }

  // Separation: steer to avoid crowding neighbors
  separation(boids) {
    const desiredSeparation = 25;
    let steer = { x: 0, y: 0 };
    let count = 0;
    for (let other of boids) {
      let dx = this.position.x - other.position.x;
      let dy = this.position.y - other.position.y;
      let distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < desiredSeparation) {
        steer.x += dx / distance;
        steer.y += dy / distance;
        count++;
      }
    }
    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
      let mag = Math.hypot(steer.x, steer.y);
      if (mag > 0) {
        steer.x = (steer.x / mag) * this.maxSpeed - this.velocity.x;
        steer.y = (steer.y / mag) * this.maxSpeed - this.velocity.y;
        // Limit the force
        let steerMag = Math.hypot(steer.x, steer.y);
        if (steerMag > this.maxForce) {
          steer.x = (steer.x / steerMag) * this.maxForce;
          steer.y = (steer.y / steerMag) * this.maxForce;
        }
      }
    }
    return steer;
  }

  // Alignment: steer towards the average heading of local neighbors
  alignment(boids) {
    const neighborDist = 50;
    let sum = { x: 0, y: 0 };
    let count = 0;
    for (let other of boids) {
      let dx = this.position.x - other.position.x;
      let dy = this.position.y - other.position.y;
      let distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < neighborDist) {
        sum.x += other.velocity.x;
        sum.y += other.velocity.y;
        count++;
      }
    }
    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      let mag = Math.hypot(sum.x, sum.y);
      if (mag > 0) {
        sum.x = (sum.x / mag) * this.maxSpeed;
        sum.y = (sum.y / mag) * this.maxSpeed;
        let steer = {
          x: sum.x - this.velocity.x,
          y: sum.y - this.velocity.y
        };
        let steerMag = Math.hypot(steer.x, steer.y);
        if (steerMag > this.maxForce) {
          steer.x = (steer.x / steerMag) * this.maxForce;
          steer.y = (steer.y / steerMag) * this.maxForce;
        }
        return steer;
      }
    }
    return { x: 0, y: 0 };
  }

  // Cohesion: steer to move toward the average position of local neighbors
  cohesion(boids) {
    const neighborDist = 50;
    let sum = { x: 0, y: 0 };
    let count = 0;
    for (let other of boids) {
      let dx = this.position.x - other.position.x;
      let dy = this.position.y - other.position.y;
      let distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < neighborDist) {
        sum.x += other.position.x;
        sum.y += other.position.y;
        count++;
      }
    }
    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      // Create a vector pointing from the boid to the average location
      let desired = { x: sum.x - this.position.x, y: sum.y - this.position.y };
      let mag = Math.hypot(desired.x, desired.y);
      if (mag > 0) {
        desired.x = (desired.x / mag) * this.maxSpeed;
        desired.y = (desired.y / mag) * this.maxSpeed;
        let steer = { x: desired.x - this.velocity.x, y: desired.y - this.velocity.y };
        let steerMag = Math.hypot(steer.x, steer.y);
        if (steerMag > this.maxForce) {
          steer.x = (steer.x / steerMag) * this.maxForce;
          steer.y = (steer.y / steerMag) * this.maxForce;
        }
        return steer;
      }
    }
    return { x: 0, y: 0 };
  }

  // Run all behaviors, update state, check edges, and render
  run(boids) {
    let sep = this.separation(boids);
    let ali = this.alignment(boids);
    let coh = this.cohesion(boids);

    // Weight each force
    this.applyForce({ x: sep.x * 1.5, y: sep.y * 1.5 });
    this.applyForce({ x: ali.x * 1.0, y: ali.y * 1.0 });
    this.applyForce({ x: coh.x * 1.0, y: coh.y * 1.0 });

    this.update();
    this.edges();
    this.render();
  }

  // Render boid as a triangle pointing in the direction of velocity
  render() {
    let angle = Math.atan2(this.velocity.y, this.velocity.x);
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, 5);
    ctx.lineTo(-10, -5);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();

    // Draw second boid if at the edge
    if (this.position.x < 10 || this.position.x > canvas.width - 10 || this.position.y < 10 || this.position.y > canvas.height - 10) {
      ctx.save();
      let x = this.position.x;
      let y = this.position.y;
      if (this.position.x < 10) x = canvas.width + this.position.x;
      if (this.position.x > canvas.width - 10) x = this.position.x - canvas.width;
      if (this.position.y < 10) y = canvas.height + this.position.y;
      if (this.position.y > canvas.height - 10) y = this.position.y - canvas.height;
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-10, 5);
      ctx.lineTo(-10, -5);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }
}

// Create boids
const boids = [];
const boidCount = 100;

// Animation loop limited to 30fps
const fpsInterval = 1000 / 30;
let then = Date.now(),
  width = 0,
  height = 0;

function initialize() {
  boids.length = 0;
  for (let i = 0; i < boidCount; i++) {
    boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height));
  }
}


function resize() {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  initialize();
}


function animate() {
  requestAnimationFrame(animate);
  let now = Date.now();
  let elapsed = now - then;
  if (!document.hidden && elapsed > fpsInterval) {
    if (width !== canvas.offsetWidth || height !== canvas.offsetHeight) resize();
    then = now - (elapsed % fpsInterval);
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Update each boid
    boids.forEach(boid => boid.run(boids));
  }
}

animate();