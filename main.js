//Create the stage for the pixi app, size x y and background color

let app = new PIXI.Application(1000, 1000, {backgroundColor : 0xCD853F	});
document.body.appendChild(app.view);

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//Declare sprite
let sprite = PIXI.Sprite.fromImage("ant.png");

// Set the initial anchor position of the rotatable sprite (positioning of the sprite)
sprite.anchor.set(0.5);
sprite.x = app.screen.width / 2;
sprite.y = app.screen.height / 2;

// Enable the sprite to interactivity in relation to user input
sprite.interactive = true;

// Shows hand cursor
sprite.buttonMode = true;

// Pointers which normalize the mouse
sprite.on('pointerdown', onClick);

// Add child to the app
app.stage.addChild(sprite);

// function to handle onClick for the large sprite 
function onClick () {
    //If alt key is pressed, true, scale positive
 if(event.altKey){
    sprite.scale.x += 0.1;
    sprite.scale.y += 0.1;
 } 
   //If shift key is pressed, true, scale negative
 if(event.shiftKey){
    sprite.scale.x -= 0.1;
    sprite.scale.y -= 0.1;
 }
   //if ctrl key is pressed, true, rotate left, otherwise, default, right
 if(event.ctrlKey){
      sprite.rotation -= 0.5;     
} else {
    sprite.rotation += 0.5;
}

}

// create a texture from an image path
let texture = PIXI.Texture.fromImage('ant.png');

// Scale mode for pixelation
texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

for (let i = 0; i < 10; i++) {
    createImageSprite(
        Math.floor(Math.random() * app.screen.width),
        Math.floor(Math.random() * app.screen.height)
    );
}

//Function which handles the creation of the image
function createImageSprite(x, y) {

    // Create ImageSprite from Texture
    let imageSprite = new PIXI.Sprite(texture);

    // Enable ImageSprite interactivity, susceptible to user input
    imageSprite.interactive = true;

    // Hand cursor appears when hovering over ImageSprite
    imageSprite.buttonMode = true;

    // Set anchor point for the image, center it.
    imageSprite.anchor.set(0.5);

    // Image resizing, set according to image. 
    imageSprite.scale.set(1);

    // Events for the mouse
    
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

function onDragStart(event) {
    //Store data to record movement
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // Set data to null
    this.data = null;
    
}

function onDragMove() {
    if (this.dragging) {
        let newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}
