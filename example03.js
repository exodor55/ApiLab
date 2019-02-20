let app = new PIXI.Application(screen.width, screen.height, {backgroundColor : 0xFFFFFF});
document.body.appendChild(app.view);

let bol = false;

// create texture from image
let texture = PIXI.Texture.fromImage('peter.png');

// create second texture
let secondTexture = PIXI.Texture.fromImage('stewie.png');

// create a new Sprite by using the texture
let dude = new PIXI.Sprite(texture);

// center the sprites anchor point
dude.anchor.set(0.5);

// move the sprite to the center of the screen
dude.x = app.screen.width / 2;
dude.y = app.screen.height / 2;

app.stage.addChild(dude);

// make the sprite interactive
dude.interactive = true;
dude.buttonMode = true;

dude.on('pointertap', function() {
    bol = !bol;
    if (bol) {
        dude.texture = secondTexture;
    }
    else {
        dude.texture = texture;
    }
});

app.ticker.add(function() {
    // just for fun, let's rotate mr rabbit a little
    dude.rotation += 0.01;
});







//second example

//Aliase
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;


//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader
  .add("Family.png")
  .load(setup);

//Define any variables that are used in more than one function
let fam, state;

function setup() {

  //Create the picture sprite 
  fam = new Sprite(resources["Family.png"].texture);
  fam.y = 96; 
  fam.vx = 0;
  fam.vy = 0;
  app.stage.addChild(fam);

  //Capture the keyboard arrow keys
  let left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  //Left arrow key press
  left.press = () => {
    //Change the pictures velocity when the key is pressed
    fam.vx = -5;
    fam.vy = 0;
  };
  
  //Left arrow key release
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the picture isn't moving vertically:
    //Stop the picture
    if (!right.isDown && fam.vy === 0) {
      fam.vx = 0;
    }
  };

  //Up
  up.press = () => {
    fam.vy = -5;
    fam.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && fam.vx === 0) {
      fam.vy = 0;
    }
  };

  //Right
  right.press = () => {
    fam.vx = 5;
    fam.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && fam.vy === 0) {
      fam.vx = 0;
    }
  };

  //Down
  down.press = () => {
    fam.vy = 5;
    fam.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && fam.vx === 0) {
      fam.vy = 0;
    }
  };

  //Set the game state
  state = play;
 
  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){

  //Update the current game state:
  state(delta);
}

function play(delta) {

  //Use the fam's velocity to make it move
  fam.x += fam.vx;
  fam.y += fam.vy
}

//The keyboard function
function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  // downHandler
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //upHandler
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}