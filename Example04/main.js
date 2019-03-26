//Set up canvas by creating a new Pixi.application, set pixel size and background color in hex.
let app = new PIXI.Application(1000, 600, {backgroundColor : 0x36454f});
//Add the canvas to a viewable space through the DOM.
document.body.appendChild(app.view);

//Create a container for the bubbles, using the pixi container. 
//Container will be used to store sprites inside later on. 
let container = new PIXI.Container();
//Add the container to the stage through addChild. 
app.stage.addChild(container);

//Create a texture from an image, in this case, I have picked a bubble.
let texture = PIXI.Texture.fromImage('bubbles.png');

//Loop through the bubbles, giving them various traits. In this case, create 20 bubbles. To increase bubble amount, increase the number.
//Bubbles are to be placed inside the container.
for (let i = 0; i < 20; i++) {
    //Create the actual bubble from the previously declared texture
    let bubble = new PIXI.Sprite(texture);
    //Set the bubble scale, as the bubble is too big (in this instance), we scale it down.
    bubble.scale.set(0.05);
    //Tint the bubbles in various colors, using Math.random on a hex code. Aesthetic reasoning, for this example.
    bubble.tint = Math.random() * 0xFFFFFF;
    //Bubble X axis positioning
    bubble.x = (i % 5) * 30;
    //Bubble Y axis positioning
    bubble.y = Math.floor(i / 4) * 30;
    //Bubble tilt
    bubble.rotation = Math.random() * (Math.PI * 4)
    //Add bubble to the container
    container.addChild(bubble);
}

//Create a new BaseRenderTexture, set size etc
let brt = new PIXI.BaseRenderTexture(500, 500, PIXI.SCALE_MODES.LINEAR, 1);
//Create a new RenderTexture, add the base render texture to it. 
let rt = new PIXI.RenderTexture(brt);

//Create a new sprite, and add a render texture to it
let sprite = new PIXI.Sprite(rt);

//Sprite.x position
sprite.x = 450;
//Sprite.y position
sprite.y = 60;
//Add the sprite to the stage, using addChild.
app.stage.addChild(sprite);

/*
 All randomly generated bubbles are part of the container. Anything you to do the container, will be done to the bubbles.
 Examples include, rotation, location, size
 */

//Container positioning, according to x or y axis.
container.x = 250;
container.y = 250;

//Simple of things you can add, for example, to scale the container (and thus influence all bubbles):
//container.scale.set(NUMBER);

//initial rotation speed of the container with the bubbles
let containerRotationValue = 0.03;

//function which handles rotation increase once button is clicked
function containerRotationIncrease(){
    //Inrease rotation speed by 0.01
    containerRotationValue += 0.01;
    //debug console log
    console.log(containerRotationValue);
}

//Add a pixi ticker, essentially a part which refreshes. In this case, we're adding the container and a rotation sequence.
app.ticker.add(function(delta) {
    app.renderer.render(container, rt);
    //Rotation of the container, the speed at which it rotates
    container.rotation -= containerRotationValue * delta;
});

//Code by Jovan
//Example source from the official website: https://pixijs.io/examples/#/basics/render-texture.js