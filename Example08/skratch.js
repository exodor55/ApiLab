let app = new PIXI.Application(800, 600, {backgroundColor : 0x0});
document.body.appendChild(app.view);

//Get the texture for rope.
let starTexture = PIXI.Texture.fromImage('star.png')

let starAmount = 1000;
let cameraZ = 0;
let fov = 20;
let baseSpeed = 0.025;
let speed = 0;
let warpSpeed = 0;
let starStretch = 5;
let starBaseSize = 0.05;


//Create the stars
let stars = [];
for(let i = 0; i < starAmount; i++)
{
	let star = {
		sprite: new PIXI.Sprite(starTexture),
		z:0,
		x:0,
		y:0
	};
	star.sprite.anchor.x = 0.5;
	star.sprite.anchor.y = 0.7;
	randomizeStar(star,true);
	app.stage.addChild(star.sprite);
	stars.push(star);
}

function randomizeStar(star,initial)
{
	star.z = initial ? Math.random()*2000 : cameraZ + Math.random()*1000+2000;
	
	//Calculate star positions random so no star hits the camera.
	let deg = Math.random()*Math.PI*2;
	let distance = Math.random()*50+1;
	star.x = Math.cos(deg)*distance;
	star.y = Math.sin(deg)*distance;
}

//Change speed of stars every 5 seconds
setInterval(function(){
	warpSpeed = warpSpeed > 0 ? 0 : 1;
},5000)

// Listen for animate update
app.ticker.add(function(delta) {
	//Easing
	speed += (warpSpeed-speed)/20;
	cameraZ += delta*10*(speed+baseSpeed);
	for(let i = 0; i < starAmount; i++)
	{
		let star = stars[i];
		if(star.z < cameraZ)
			randomizeStar(star);
		
		//Star 3d position to 2d
		let z = star.z - cameraZ;
		star.sprite.x = star.x * (fov / z)*app.renderer.screen.width+app.renderer.screen.width/2;
		star.sprite.y = star.y * (fov / z)*app.renderer.screen.width+app.renderer.screen.height/2;
		
		//Star scale & rotation.
		let dxCenter = star.sprite.x - app.renderer.screen.width/2;
		let dyCenter = star.sprite.y - app.renderer.screen.height/2;
		let distanceCenter = Math.sqrt( dxCenter*dxCenter + dyCenter+dyCenter);
		let distanceScale = Math.max(0, (2000-z)/2000);
		star.sprite.scale.x = distanceScale*starBaseSize;
		//Star is looking towards center so that y axis is towards center.
		//Scale the star depending on how fast we are moving.
		star.sprite.scale.y = distanceScale*starBaseSize + distanceScale*speed*starStretch*distanceCenter/app.renderer.screen.width;
		star.sprite.rotation = Math.atan2(dyCenter, dxCenter)+Math.PI/2;
		
	}
});



// Scale mode 
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

let sprite = PIXI.Sprite.fromImage('frog.png');

// Set position
sprite.anchor.set(0.5);
sprite.x = app.screen.width / 1;
sprite.y = app.screen.height / 1;

// interactivity
sprite.interactive = true;

// Shows hand cursor
sprite.buttonMode = true;

// Touch and mouse
sprite.on('pointerdown', onClick);

// Use the mouse & touch events:

app.stage.addChild(sprite);

function onClick () {
    sprite.scale.x *= 0.9;
    sprite.scale.y *= 0.9;
}
