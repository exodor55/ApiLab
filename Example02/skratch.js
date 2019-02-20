//BASICS/Basics

let app = new PIXI.Application(screen.width, screen.height, {backgroundColor : 0xebf441});
document.body.appendChild(app.view);

// create a new Sprite from an image path
let putin = PIXI.Sprite.fromImage('PUTIN3.png')

// center the sprite's anchor point
putin.anchor.set(0.5);

// move the sprite to the center of the screen
putin.x = app.screen.width / 2;
putin.y = app.screen.height / 2;

app.stage.addChild(putin);

// Listen for animate update
app.ticker.add(function(delta) {
    // creates frame-independent transformation
    putin.rotation += 0.1 * delta;
});
//Key press "Z" rotation stops
document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyZ') {
    alert('Did you put the beard on Putin properly?????????????')
  }
});
//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;


//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader
  .add("beard.png")
  .load(setup);

//Define any variables that are used in more than one function
let beard, state;

function setup() {

  //Create the `beard` sprite 
  beard = new Sprite(resources["beard.png"].texture);
  beard.y = 96; 
  beard.vx = 0;
  beard.vy = 0;
  app.stage.addChild(beard);

  //Adding keyboard arrow keys
  let left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  //Left arrow key press 
  left.press = () => {
    //Change the beard's velocity when the key is pressed
    beard.vx = -5;
    beard.vy = 0;
  };
  
  //Left arrow key release
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the beard isn't moving vertically:
    //Stop the beard
    if (!right.isDown && beard.vy === 0) {
      beard.vx = 0;
    }
  };

  //Up
  up.press = () => {
    beard.vy = -5;
    beard.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && beard.vx === 0) {
      beard.vy = 0;
    }
  };

  //Right
  right.press = () => {
    beard.vx = 5;
    beard.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && beard.vy === 0) {
      beard.vx = 0;
    }
  };

  //Down
  down.press = () => {
    beard.vy = 5;
    beard.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && beard.vx === 0) {
      beard.vy = 0;
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

  //Use the beard's velocity to make it move
  beard.x += beard.vx;
  beard.y += beard.vy
}

//The "keyboard" helper function
function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The 'downHandler'
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The "upHandler"
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Add Event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}




