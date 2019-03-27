//mouse trail + slots demo

let app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

PIXI.loader
    .add("examples/assets/eggHead.png","bearpng.png")
	.add("examples/assets/flowerTop.png","instapng.png")
	.add("examples/assets/helmlok.png","bee1.png")
	.add("examples/assets/skully.png","Magnif.png")
    .load(onAssetsLoaded);

let REEL_WIDTH = 160;
let SYMBOL_SIZE = 150;

//onAssetsLoaded handler builds the example.
function onAssetsLoaded()
{
	//Create different slot symbols.
	let slotTextures = [
		PIXI.Texture.fromImage("examples/assets/eggHead.png"),
		PIXI.Texture.fromImage("examples/assets/flowerTop.png"),
		PIXI.Texture.fromImage("examples/assets/helmlok.png"),
		PIXI.Texture.fromImage("examples/assets/skully.png")
	];

	//Build the reels
	let reels = [];
	let reelContainer = new PIXI.Container();
	for( let i = 0; i < 5; i++)
	{
		let rc = new PIXI.Container();
		rc.x = i*REEL_WIDTH;
		reelContainer.addChild(rc);
		
		let reel = {
			container: rc,
			symbols:[],
			position:0,
			previousPosition:0,
			blur: new PIXI.filters.BlurFilter()
		};
		reel.blur.blurX = 0;
		reel.blur.blurY = 0;
		rc.filters = [reel.blur];
		
		//Build the symbols
		for(let j = 0; j < 4; j++)
		{
			let symbol = new PIXI.Sprite(slotTextures[ Math.floor(Math.random()*slotTextures.length)]);
			//Scale the symbol to fit symbol area.
			symbol.y = j*SYMBOL_SIZE;
			symbol.scale.x = symbol.scale.y = Math.min( SYMBOL_SIZE / symbol.width, SYMBOL_SIZE/symbol.height);
			symbol.x = Math.round((SYMBOL_SIZE - symbol.width)/2);
			reel.symbols.push( symbol );
			rc.addChild(symbol);
		}
		reels.push(reel);
	}
	app.stage.addChild(reelContainer);
	
	//Build top & bottom covers and position reelContainer
	let margin = (app.screen.height - SYMBOL_SIZE*3)/2;
	reelContainer.y = margin;
	reelContainer.x = Math.round(app.screen.width - REEL_WIDTH*5);
	let top = new PIXI.Graphics();
	top.beginFill(0,1);
	top.drawRect(0,0, app.screen.width, margin);
	let bottom = new PIXI.Graphics();
	bottom.beginFill(0,1);
	bottom.drawRect(0,SYMBOL_SIZE*3+margin,app.screen.width, margin);
	
	//Add play text
	let style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 36,
		fontStyle: 'italic',
		fontWeight: 'bold',
		fill: ['#ffffff', '#00ff99'], // gradient
		stroke: '#4a1850',
		strokeThickness: 5,
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 440
	});
	
	let playText = new PIXI.Text('KICK IT', style);
	playText.x = Math.round((bottom.width - playText.width)/2);
	playText.y = app.screen.height-margin + Math.round((margin-playText.height)/2);
	bottom.addChild(playText);
	
	//Add header text
	let headerText = new PIXI.Text('LUCKY SLOTS!', style);
	headerText.x = Math.round((top.width - headerText.width)/2);
	headerText.y = Math.round((margin-headerText.height)/2);
	top.addChild(headerText);
	
	app.stage.addChild(top);
	app.stage.addChild(bottom);
	
	//Set the interactivity.
	bottom.interactive = true;
	bottom.buttonMode = true;
	bottom.addListener("pointerdown", function(){
		startPlay();
	});
	
	let running = false;
	
	//Function to start playing.
	function startPlay(){
		if(running) return;
		running = true;
		
		for(let i = 0; i < reels.length; i++)
		{
			let r = reels[i];
			let extra = Math.floor(Math.random()*3);
			tweenTo(r, "position", r.position + 10+i*5+extra, 2500+i*600+extra*600, backout(0.6), null, i == reels.length-1 ? reelsComplete : null);
		}
	}
	
	//Reels done handler.
	function reelsComplete(){
		running = false;
	}
	
	// Listen for animate update.
	app.ticker.add(function(delta) {
		//Update the slots.
		for( let i = 0; i < reels.length; i++)
		{
			let r = reels[i];
			//Update blur filter y amount based on speed.
			//This would be better if calculated with time in mind also. Now blur depends on frame rate.
			r.blur.blurY = (r.position-r.previousPosition)*8;
			r.previousPosition = r.position;
			
			//Update symbol positions on reel.
			for( let j = 0; j < r.symbols.length; j++)
			{
				let s = r.symbols[j];
				let prevy = s.y;
				s.y = (r.position + j)%r.symbols.length*SYMBOL_SIZE-SYMBOL_SIZE;
				if(s.y < 0 && prevy > SYMBOL_SIZE){
					//Detect going over and swap a texture. 
					//This should in proper product be determined from some logical reel.
					s.texture = slotTextures[Math.floor(Math.random()*slotTextures.length)];
					s.scale.x = s.scale.y = Math.min( SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE/s.texture.height);
					s.x = Math.round((SYMBOL_SIZE - s.width)/2);
				}
			}
		}
	});
}

//Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
let tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete)
{
	let tween = {
		object:object,
		property:property,
		propertyBeginValue:object[property],
		target:target,
		easing:easing,
		time:time,
		change:onchange,
		complete:oncomplete,
		start:Date.now()
	};
	
	tweening.push(tween);
	return tween;
}
// Listen for animate update.
app.ticker.add(function(delta) {
	let now = Date.now();
	let remove = [];
	for(let i = 0; i < tweening.length; i++)
	{
		let t = tweening[i];
		let phase = Math.min(1,(now-t.start)/t.time);
		
		t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
		if(t.change) t.change(t);
		if(phase == 1)
		{
			t.object[t.property] = t.target;
			if(t.complete)
				t.complete(t);
			remove.push(t);
		}
	}
	for(let i = 0; i < remove.length; i++)
	{
		tweening.splice(tweening.indexOf(remove[i]),1);
	}
});

//Basic lerp funtion.
function lerp(a1,a2,t){
	return a1*(1-t) + a2*t;
}

//Backout function
backout = function(amount) {
		return function(t) {
			return (--t*t*((amount+1)*t + amount) + 1);
		};
};
   


//Get the texture for rope.
let trailTexture = PIXI.Texture.fromImage('ww.png')
let historyX = [];
let historyY = [];
//historySize determines how long the trail will be.
let historySize = 20;
//ropeSize determines how smooth the trail will be.
let ropeSize = 100;
let points = [];

//Create history array.
for( let i = 0; i < historySize; i++)
{
	historyX.push(0);
	historyY.push(0);
}
//Create rope points.
for(let i = 0; i < ropeSize; i++)
{
	points.push(new PIXI.Point(0,0));
}

//Create the rope
let rope = new PIXI.mesh.Rope(trailTexture, points);

//Set the blendmode
rope.blendmode = PIXI.BLEND_MODES.ADD;

app.stage.addChild(rope);

// listen for animate update
app.ticker.add(function(delta) {
	//read mouse points, this could be done also in mousemove/touchmove update. For simplicity it is done here for now.
	//when implemeting this properly, make sure to implement touchmove as interaction plugins mouse might not update on certain devices.
	let mouseposition = app.renderer.plugins.interaction.mouse.global;
	
	//Update the mouse values to history
	historyX.pop();
	historyX.unshift(mouseposition.x);
	historyY.pop();
	historyY.unshift(mouseposition.y);
	//Update the points to correspond with history.
	for( let i = 0; i < ropeSize; i++)
	{
		let p = points[i];
		
		//Smooth the curve with cubic interpolation to prevent sharp edges.
		let ix = cubicInterpolation( historyX, i / ropeSize * historySize);
		let iy = cubicInterpolation( historyY, i / ropeSize * historySize);
		
		p.x = ix;
		p.y = iy;
		
	}
});


function clipInput(k, arr)
{
	if (k < 0)
		k = 0;
	if (k > arr.length - 1)
		k = arr.length - 1;
	return arr[k];
}

function getTangent(k, factor, array)
{
	return factor * (clipInput(k + 1, array) - clipInput(k - 1,array)) / 2;
}

function cubicInterpolation(array, t, tangentFactor)
{
	if (tangentFactor == null) tangentFactor = 1;
	
	let k = Math.floor(t);
	let m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
	let p = [clipInput(k,array), clipInput(k+1,array)];
	t -= k;
	let t2 = t * t;
	let t3 = t * t2;
	return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + ( -2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}