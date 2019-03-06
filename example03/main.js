let app = new PIXI.Application(screen.width, screen.height);
document.body.appendChild(app.view);

// Create background image
let background = PIXI.Sprite.fromImage("fam.png");
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);

let shaderFrag = `
precision mediump float;

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

void main() {
  //pixel coords are inverted in framebuffer
  vec2 pixelPos = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
  if (length(mouse - pixelPos) < 25.0) {
      gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0) * 0.7; //yellow circle, alpha=0.7
  } else {
      gl_FragColor = vec4( sin(time), mouse.x/resolution.x, mouse.y/resolution.y, 1) * 0.5; // blend with underlying image, alpha=0.5
  }
}
`;

let container = new PIXI.Container();
container.filterArea = app.screen;
app.stage.addChild(container);
let filter = new PIXI.Filter(null, shaderFrag);
container.filters = [filter];

// Animate the filter
app.ticker.add(function(delta) {
    let v2 = filter.uniforms.mouse;
    let global = app.renderer.plugins.interaction.mouse.global;
    v2[0] = global.x; v2[1] = global.y;
    filter.uniforms.mouse = v2;

    v2 = filter.uniforms.resolution;
    v2[0] = app.screen.width;
    v2[1] = app.screen.height;
    filter.uniforms.resolution = v2;
});



//
document.body.appendChild(app.view);

// create some textures from an image path
let textureButton = PIXI.Texture.fromImage('monkey.png');
let textureButtonDown = PIXI.Texture.fromImage('fart.png');
let textureButtonOver = PIXI.Texture.fromImage('griffin.png');

let buttons = [];

let buttonPositions = [
    1500, 280,
    605, 260,
    1040, 600,
    580, 850,
    1500, 800
];

for (let i = 0; i < 5; i++) {

    let button = new PIXI.Sprite(textureButton);
    button.buttonMode = true;

    button.anchor.set(0.5);
    button.x = buttonPositions[i*2];
    button.y = buttonPositions[i*2 + 1];

    // make the button interactive...
    button.interactive = true;
    button.buttonMode = true;

    button
        // Mouse eventListener
        
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);

        // Use mouse-only events
        // .on('mousedown', onButtonDown)
        // .on('mouseup', onButtonUp)
        // .on('mouseupoutside', onButtonUp)
        // .on('mouseover', onButtonOver)
        // .on('mouseout', onButtonOut)

        // Use touch-only events
        // .on('touchstart', onButtonDown)
        // .on('touchend', onButtonUp)
        // .on('touchendoutside', onButtonUp)

    // add it to the stage
    app.stage.addChild(button);

    // add button to array
    buttons.push(button);
}

// set values
buttons[0].scale.set(1.2);
buttons[2].rotation = Math.PI / 10;
buttons[3].scale.set(0.8);
buttons[4].scale.set(0.8,1.2);
buttons[4].rotation = Math.PI;

function onButtonDown() {
    this.isdown = true;
    this.texture = textureButtonDown;
    this.alpha = 1;
}

function onButtonUp() {
    this.isdown = false;
    if (this.isOver) {
        this.texture = textureButtonOver;
    }
    else {
        this.texture = textureButton;
    }
}

function onButtonOver() {
    this.isOver = true;
    if (this.isdown) {
        return;
    }
    this.texture = textureButtonOver;
}

function onButtonOut() {
    this.isOver = false;
    if (this.isdown) {
        return;
    }
    this.texture = textureButton;
}
