// Matter.js module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Events = Matter.Events;

// Create an engine
const engine = Engine.create();

// Set default gravity (Earth)
engine.world.gravity.y = 1; // Default gravity for Earth

// Create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Create a ground and walls
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth, 60, { isStatic: true });
const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });
const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });

// Create a projectile (ball)
let projectile = Bodies.circle(200, window.innerHeight - 200, 20, {
    restitution: 0.8  // Bouncy effect
});
World.add(engine.world, [ground, leftWall, rightWall, projectile]);

// Variables for controlling the projectile launch
let launchAngle = 45;  // in degrees
let launchForce = 0.05; // force
let windSpeed = 0;      // wind speed (horizontal force)

// Launch button event listener
document.getElementById('launch').addEventListener('click', () => {
    // Convert angle to radians
    const angleRadians = (Math.PI / 180) * launchAngle;
    
    // Calculate the force vector based on the angle and force
    const forceVector = {
        x: launchForce * Math.cos(angleRadians),
        y: -launchForce * Math.sin(angleRadians) // Negative to go upward
    };
    
    // Apply the force to the projectile
    Body.applyForce(projectile, projectile.position, forceVector);
});

// Update angle, force, wind speed, and gravity values in real-time
document.getElementById('angle').addEventListener('input', (event) => {
    launchAngle = parseInt(event.target.value);
    document.getElementById('angleDisplay').innerText = launchAngle;
});

document.getElementById('force').addEventListener('input', (event) => {
    launchForce = parseFloat(event.target.value);
    document.getElementById('forceDisplay').innerText = launchForce;
});

document.getElementById('wind').addEventListener('input', (event) => {
    windSpeed = parseFloat(event.target.value);
    document.getElementById('windDisplay').innerText = windSpeed;
});

// Gravity selection for Earth, Moon, and Mars
document.getElementById('gravity').addEventListener('change', (event) => {
    const selectedGravity = event.target.value;
    
    // Adjust gravity based on the selected environment
    switch (selectedGravity) {
        case 'earth':
            engine.world.gravity.y = 1; // Earth's gravity
            break;
        case 'moon':
            engine.world.gravity.y = 0.16; // Moon's gravity (about 1/6 of Earth's)
            break;
        case 'mars':
            engine.world.gravity.y = 0.38; // Mars' gravity (about 1/3 of Earth's)
            break;
    }
    document.getElementById('gravityDisplay').innerText = selectedGravity;
});

// Reset the projectile after it stops
Events.on(engine, 'afterUpdate', function() {
    // Apply wind resistance (force applied horizontally)
    if (projectile.position.y < window.innerHeight) {
        Body.applyForce(projectile, projectile.position, { x: windSpeed * 0.001, y: 0 });
    }

    // Reset position if the projectile goes off-screen
    if (projectile.position.y > window.innerHeight || projectile.position.x > window.innerWidth || projectile.position.x < 0) {
        Body.setPosition(projectile, { x: 200, y: window.innerHeight - 200 });
        Body.setVelocity(projectile, { x: 0, y: 0 });
    }
});

// Run the engine and the renderer
Engine.run(engine);
Render.run(render);
