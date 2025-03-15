'use strict';

// /*!
//  * ML in PL Jekyll Theme - Intro animation
//  * This script animates the intro background
//  */

//     bgParticles = [], // Background particles
//     mgParticles = [], // Middle ground particles
//     fgParticles = [], // Foreground particles
//     connectionDistanceThreshold = 125,
//     backgroundColor = "{{ site.color.background }}",
//     bgParticlesCfg = {
//         colors: "#EEE",
//         lineColors: "#EEE",
//         sizeMin: 4,
//         sizeRange: 3,
//         speedMax: 0.4,
//         groups: [[0, 1], [0, 2], [1, 2]],
//         density: 0.00015
//     },
//     mgParticlesCfg = {
//         colors: "#AAA",
//         lineColors: "#AAA",
//         sizeMin: 2,
//         sizeRange: 2,
//         speedMax: 0.6,
//         groups: [[]], // This group of particles has no connecting lines
//         density: 0.00015
//     },
//     fgParticlesCfg = {
//         colors: {"{{ site.color.main }}": 0.2, "#000000": 0.8},
//         lineColors: {"#000": 0.3, "#222": 0.3, "#444": 0.3},
//         sizeMin: 2,
//         sizeRange: 5,
//         speedMax: 0.8,
//         groups: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4], [0], [1], [2], [3], [4], [0], [1], [2], [3], [4], [0], [1], [2], [3], [4]],
//         density: 0.0003
//     };

// // Helper functions
// function randomChoice(arr) {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

// function rulletChoice(dict){
//     let total = 0;
//     for (let key in dict) total += dict[key];
//     let r = Math.random() * total;
//     for (let key in dict){
//         r -= dict[key];
//         if (r < 0) return key;
//     }
// }

// // Standard Normal variate using Box-Muller transform.
// function gaussianRandom(mean=0, stdev=1) {
//     let u = 1 - Math.random(); //Converting [0,1) to (0,1)
//     let v = Math.random();
//     let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
//     // Transform to the desired mean and standard deviation:
//     return z * stdev + mean;
// }

// function distVec2d(vec1, vec2){
//     return Math.sqrt(Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2));
// }

// function wrappedDistVec2d(vec1, vec2){
//     let dist = distVec2d(vec1, vec2);
//     if (dist > width / 2) dist = width - dist;
//     return dist;
// }

// function drawParticle(p){
//     ctx.fillStyle = p.color;
//     ctx.beginPath();
//     ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI, false);
//     ctx.fill();
// }

// function drawLine(p1, p2){
//     ctx.beginPath();
//     ctx.moveTo(p1.x, p1.y);
//     ctx.lineTo(p2.x, p2.y);
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = p1.lineColor;
//     ctx.stroke();
// }

// function updateParticle(p){
//     let prevSinVal = Math.sin(p.x / p.posFreq) * p.posAmp;
//     p.x += p.velX;
//     let nextSinVal = Math.sin(p.x / p.posFreq) * p.posAmp;
//     p.y += p.velY * (prevSinVal - nextSinVal);

//     p.size = p.baseSize + Math.sin(p.x / p.sizeFreq) * p.sizeAmp / 2 + p.sizeAmp / 2;

//     // Wrap around the left and right
//     if(p.x < -connectionDistanceThreshold) p.x = width + connectionDistanceThreshold; 
//     else if(p.x > width + connectionDistanceThreshold) p.x = -connectionDistanceThreshold;
//     if(p.y + p.size >= height) p.velY *= -1;
// }

// function drawParticles(particles){
//     // Update position of particles
//     for (let p of particles) updateParticle(p);

//     // Draw lines between particles in the same group
//     for (let i = 0; i < particles.length - 1; i++){
//         // Skip particles that are not in any group - can't connect to any other particle
//         if (particles[i].groups.length === 0) continue;

//         for(let j = i + 1;  j < particles.length; j++){
//             const p1 = particles[i],
//                   p2 = particles[j];

//             // This part can be done faster by creating indexes for groups, but I'm too lazy to implement it
//             if(distVec2d(p1, p2) > connectionDistanceThreshold) continue;

//             for (let g of p1.groups){  
//                 if (p2.groups.includes(g)){
//                     drawLine(p1, p2);
//                     break;
//                 }
//             }
//         }
//     }

//     // Draw all particles
//     for (let p of particles) drawParticle(p);
// }

// function draw(){
//     ctx.fillStyle = backgroundColor;
//     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//     drawParticles(bgParticles);
//     drawParticles(mgParticles);
//     drawParticles(fgParticles);
// }

// function createParticles(x, y, width, height, particlesCfg) {
//     let newParticlesCount = width * height * particlesCfg.density,
//         newParticles = [];

//     // Create new particles
//     for(let i = 0; i < newParticlesCount; i++){
//         newParticles.push({
//             x: Math.random() * (width + 2 * connectionDistanceThreshold) + x - connectionDistanceThreshold,
//             y: gaussianRandom(0, 1) * 2 / 5 * height + y,
//             velX: (Math.random() * 2 - 1) * particlesCfg.speedMax,
//             velY: 1,
//             posFreq: Math.random() * 100 + 100,
//             posAmp: Math.random() * 100,
//             sizeFreq: Math.random() * 50 + 50,
//             sizeAmp: Math.random() * 2 + 1,
//             baseSize: Math.random() * particlesCfg.sizeRange + particlesCfg.sizeMin,
//             size: 1,
//             color: typeof particlesCfg.colors === "string" ? particlesCfg.colors : rulletChoice(particlesCfg.colors),
//             lineColor: typeof particlesCfg.lineColors === "string" ? particlesCfg.lineColors : rulletChoice(particlesCfg.lineColors),
//             groups: randomChoice(particlesCfg.groups),
//         });
//     }

//     return newParticles;
// }

// function spawnParticles(x, y, width, height) {
//     bgParticles.push(...createParticles(x, y, width, height, bgParticlesCfg));
//     mgParticles.push(...createParticles(x, y, width, height, mgParticlesCfg));
//     fgParticles.push(...createParticles(x, y, width, height, fgParticlesCfg));
// }

// function removeOutOfBoundsParticles(particles) {
//     return particles.filter(function(p){
//         return !(p.x < 0 || p.x > width || p.y < 0 || p.y > height);
//     });
// }

// function resize() {
//     width = canvas.offsetWidth;
//     height = canvas.offsetHeight;
//     canvas.width = width;
//     canvas.height = height;

//     // Reset and generate new particles 
//     // (this is easier than trying to resize the existing ones)
//     bgParticles = [];
//     mgParticles = [];
//     fgParticles = [];
//     spawnParticles(0, 0, width, height);
// }

// function render() {
//     const now = Date.now();
//     let timeElapsed = now - then;

//     // Stop animation when tab is not visible to save resources
//     if(document.hidden){
//         then = now;
//         timeElapsed = 0;
//     }

//     // Limit framerate
//     if (timeElapsed >= framesInterval){
//         // Get ready for next frame by setting then=now,
//         // also, adjust for screen refresh rate
//         then = now - (timeElapsed % framesInterval);

//         // Check if resize is needed
//         if(width !== canvas.offsetWidth || height !== canvas.offsetHeight) resize();

//         // Update animation
//         draw();
//     }
//     requestAnimationFrame(render);
// }

// render();


// A simple 2D vector class
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }
    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        let m = this.mag();
        if (m !== 0) this.div(m);
        return this;
    }
    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
        return this;
    }
    heading() {
        return Math.atan2(this.y, this.x);
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static dist(v1, v2) {
        return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
    }
}

// Flock class to manage all boids
class Flock {
    constructor() {
        this.boids = [];
    }
    run() {
        for (let boid of this.boids) {
            boid.run(this.boids);
        }
    }
    addBoid(b) {
        this.boids.push(b);
    }
}

// # .ellis-bg-red {
//     # background-color:
//     # }
//     # .ellis-bg-green {
//     #   background-color:#b2e684
//     # }
//     # .ellis-bg-turquoise {
//     #   background-color:#4bc5be
//     # }
//     # .ellis-bg-orange {
//     #   background-color:#e38e48
//     # }
//     # .ellis-bg-blue {
//     #   background-color:#6a9bdd
//     # }

const canvas = document.getElementById("intro-background"),
    ctx = canvas.getContext("2d"),
    fps = 30,  // To make it less cpu intensive, we only update the canvas every 30 frames
    framesInterval = 1000 / 30,
    ellisColors = [
        "{{site.color.ellis-red}}",
        "{{site.color.ellis-green}}",
        "{{site.color.ellis-turquoise}}",
        "{{site.color.ellis-orange}}",
        "{{site.color.ellis-blue}}"
    ];

let then = 0,
    width = 0,
    flock;


// Boid class for individual agents
class Boid {
    constructor(x, y) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.acceleration = new Vector(0, 0);
        this.size = 3;
        this.maxSpeed = 3;
        this.maxForce = 0.05;
        // Using hsl for color; generates a random hue.
        // this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        // choose a random color from the ellisColors array
        this.color = ellisColors[Math.floor(Math.random() * ellisColors.length)];
    }

    run(boids) {
        this.flock(boids);
        this.update();
        this.borders();
        this.render();
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    flock(boids) {
        let separation = this.separate(boids);
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);

        // Weight forces arbitrarily
        separation.mult(1.5);
        alignment.mult(1.0);
        cohesion.mult(1.0);

        this.applyForce(separation);
        this.applyForce(alignment);
        this.applyForce(cohesion);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    // Steer towards a target
    seek(target) {
        let desired = Vector.sub(target, this.position);
        desired.normalize();
        desired.mult(this.maxSpeed);
        let steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    // Draw a triangle rotated to the boid's direction
    render() {
        let theta = this.velocity.heading() + Math.PI / 2;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(theta);
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2);
        ctx.lineTo(-this.size, this.size * 2);
        ctx.lineTo(this.size, this.size * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();
    }

    // Wraparound borders
    borders() {
        if (this.position.x < -this.size) this.position.x = canvas.width + this.size;
        if (this.position.y < -this.size) this.position.y = canvas.height + this.size;
        if (this.position.x > canvas.width + this.size) this.position.x = -this.size;
        if (this.position.y > canvas.height + this.size) this.position.y = -this.size;
    }

    // Separation: steer away from nearby boids
    separate(boids) {
        let desiredSeparation = 25.0;
        let steer = new Vector(0, 0);
        let count = 0;
        for (let other of boids) {
            let d = Vector.dist(this.position, other.position);
            if (d > 0 && d < desiredSeparation) {
                let diff = Vector.sub(this.position, other.position);
                diff.normalize();
                diff.div(d); // Weight by distance
                steer.add(diff);
                count++;
            }
        }
        if (count > 0) steer.div(count);
        if (steer.mag() > 0) {
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    // Alignment: steer towards the average velocity of neighbors
    align(boids) {
        let neighborDist = 50;
        let sum = new Vector(0, 0);
        let count = 0;
        for (let other of boids) {
            let d = Vector.dist(this.position, other.position);
            if (d > 0 && d < neighborDist) {
                sum.add(other.velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            let steer = Vector.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return new Vector(0, 0);
        }
    }

    // Cohesion: steer towards the average position of neighbors
    cohesion(boids) {
        let neighborDist = 50;
        let sum = new Vector(0, 0);
        let count = 0;
        for (let other of boids) {
            let d = Vector.dist(this.position, other.position);
            if (d > 0 && d < neighborDist) {
                sum.add(other.position);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum);
        } else {
            return new Vector(0, 0);
        }
    }
}

// Global variables for canvas and flock
// let canvas, ctx, flock, then = Date.now();

window.onload = function () {
    // Create a new flock and add initial boids
    flock = new Flock();
    for (let i = 0; i < 100; i++) {
        let b = new Boid(canvas.width / 2, canvas.height / 2);
        flock.addBoid(b);
    }


    // Start the animation loop
    requestAnimationFrame(draw);
};

function resize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
}


function draw() {
    const now = Date.now();
    let timeElapsed = now - then;

    // Stop animation when tab is not visible to save resources
    if (document.hidden) {
        then = now;
        timeElapsed = 0;
    }
    // Clear the canvas
    // ctx.fillStyle = 'white';
    ctx.fillStyle = "#ffffff";
    // console.log(canvas.width, canvas.height);
    console.log(canvas.offsetWidth, canvas.offsetHeight);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // ctx.fillRect(0, 0, 1000, 1000);

    // Run the flocking simulation
    flock.run();

    requestAnimationFrame(draw);
}