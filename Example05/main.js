//Set the stage, create the canvas size. In this case, I set it to scale according to window height/width.
let app = new PIXI.Application(window.innerWidth, window.innerHeight);
//Add the stage to the document, make it viewable.
document.body.appendChild(app.view);
//Create a stage variable
let stage = app.stage;

//Create a circle brush, a brush which we will use as an eraser to erase a mask.
//Create the brush using the pixi JS graphics class.
let brush = new PIXI.Graphics();
//Set the brush fill, in this case, 0xffffff
brush.beginFill(0xffffff);

//Set the brush size, in this case 100.
brush.drawCircle(0, 0, 100);
//End fill when needed
brush.endFill();

//Pixi loader is a way to load ready graphics on document ready. This way, pixi can easily and smoothly access them.
PIXI.loader.add("textureNature", "nature.jpg")
PIXI.loader.add("textureSand", "sand.jpg")
//Load pixi loader on setup, practically document ready
PIXI.loader.load(setup);

//The aformentioned setup function
function setup(loader, resources) {
    
    //Create a new pixi sprite, the initial background, which can be identified with "texture1" as we have specified
    let background = new PIXI.Sprite(resources["textureNature"].texture);
    //add the background to the stage
    stage.addChild(background);
    background.width = app.screen.width;
    background.height = app.screen.height;

    
    let imageToReveal = new PIXI.Sprite(resources["textureSand"].texture)
    stage.addChild(imageToReveal);
	imageToReveal.width = app.screen.width;
    imageToReveal.height = app.screen.height;

    //Create a variable for render texture, important to the overall masking
    let renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

    //Make the render texture sprite a new pixi sprite, with the value render texture
    let renderTextureSprite = new PIXI.Sprite(renderTexture);
    //Add to stage
    stage.addChild(renderTextureSprite);
    //As the name implies, image to be revealed in concurrence
    imageToReveal.mask = renderTextureSprite;

    //Allow the stage to be interactive, make it susceptible to the events below. 
    app.stage.interactive = true;
    app.stage.on('pointerdown', pointerDown);
    app.stage.on('pointerup', pointerUp);
    app.stage.on('pointermove', pointerMove);

    //Spoiler disable dragging, for the time being (default mode)
    let dragging = false;
    
    //Functions which activate on pointerMove
    function pointerMove(event) {
        //If statement which checks if dragging is true, and executes the following
        if (dragging) {
            brush.position.copy(event.data.global);
            app.renderer.render(brush, renderTexture, false, null, false);
        }
    }
    
    //Function tied to pointerdown, sets dragging to true, activates pointermove, which uses the brush
    function pointerDown(event) {
        dragging = true;
        pointerMove(event);
        
    }

    //Function tied to pointer up, sets it to false, In other words, inactive. 
    function pointerUp(event) {
        dragging = false;
    }
}

//Code by Jovan
//Example source from the official website: https://pixijs.io/examples/#/demos/mask-render-texture.js
