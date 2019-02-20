//Create the stage for the pixi app, size x y and background color
let app = new PIXI.Application(1000, 1000, {backgroundColor : 0xCD853F	});

//Append the document, add app to it so it is viewable
document.body.appendChild(app.view);

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//Declare a sprite variable. 
let sprite = PIXI.Sprite.fromImage("ant.png");

// Set the initial anchor position of the rotatable sprite (positioning of the sprite)
sprite.anchor.set(0.5);
sprite.x = app.screen.width / 2;
sprite.y = app.screen.height / 2;

// Enable the sprite to interactivity in relation to user input (in this case, a mouse click)
sprite.interactive = true;

// Shows hand cursor (interactivity related)
sprite.buttonMode = true;

// Pointers which normalize the mouse
sprite.on('pointerdown', onClick);

// Add the child, the sprite, to the app view
app.stage.addChild(sprite);

// function to handle the onClick event for the interactive sprite sprite 
function onClick () {
    //If alt key is pressed, true, scale positive
    if (event.altKey){
        sprite.scale.x += 0.1;
        sprite.scale.y += 0.1;
    } 
    //If shift key is pressed, true, scale negative
    if (event.shiftKey){
        sprite.scale.x -= 0.1;
        sprite.scale.y -= 0.1;
    }
    //If ctrl key is pressed, true, rotate left, otherwise, default, right
    if (event.ctrlKey){
        sprite.rotation -= 0.5;     
    } else {
        sprite.rotation += 0.5;
    }

}

// Create a texture from an image path for the mass sprites (in this case, worker ants)
let texture = PIXI.Texture.fromImage("ant.png");

// Scale mode for pixelation
texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

// for loop which utilizes the createImageSprite function and randomly places the ants on the app screen
for (let i = 0; i < 10; i++) {
    createImageSprite(
        Math.floor(Math.random() * app.screen.width),
        Math.floor(Math.random() * app.screen.height)
    );
}

//Function which handles the creation of the image, in this case a worker ant
function createImageSprite(x, y) {

    // Create ImageSprite from texture
    let imageSprite = new PIXI.Sprite(texture);

    // Enable ImageSprite interactivity, susceptible to user input
    imageSprite.interactive = true;

    // Hand cursor appears when hovering over ImageSprite
    imageSprite.buttonMode = true;

    // Set anchor point for the image, center it.
    imageSprite.anchor.set(0.5);

    // Image resizing, set according to image. 
    imageSprite.scale.set(1);

    // Events for the mouse when it comes to dragging, selecting, dropping etc
    imageSprite
         .on('mousedown', onDragStart)
         .on('mouseup', onDragEnd)
         .on('mouseupoutside', onDragEnd)
         .on('mousemove', onDragMove);

    // Sprite movement to the designated position
    imageSprite.x = x;
    imageSprite.y = y;
    
    // Add the imageSprite to the document, the pixi stage. 
    app.stage.addChild(imageSprite);
}

//Function which handles on drag start
function onDragStart(event) {
    //Store data to record movement
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    
}

//Function which handles on drag end
function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // Set data to null
    this.data = null;
    
}

//Function which handles drag move, places it on the dropped position and saves
function onDragMove() {
    if (this.dragging) {
        let newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

/*
Code using PixiJS v4 and native JavaScript
Program created through the aid of various tutorials and examples from the official pixiJS examples websites ( https://pixijs.io/examples )
Example 1 by Jovan
*/