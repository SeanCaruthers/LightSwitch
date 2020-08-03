/* ----------------------------------------------------------------------------------------

Program       :      LightSwitch

Author        :      Sean Caruthers

Date          :      2020-08-02

Description   :      LightSwitch is a NP-Hard game that is based off of 3CNF.

Goal          :      Turn on all of the lights by flipping switches

Rules         :      The player starts with j light connected to k switches via 3 wires.  
                     Each light is connected to the switches via a direct wire or an inverted wire. 
                     There are four possible states for each switch wire combo:

                         Switch on and direct wire    = current running
                         Switch off and inverted wire = current running
                         Switch on and inverted wire  = no current
                         Switch off and direct wire   = no current

                     A light will turn on if it is receiving current from at least one switch.
                     A light will turn off it is is not receiving current from any switches.
                     
          
Setup       :        The user is prompted to enter two numbers to determine the difficulty
                     level of the game:
                          
                          The first number corresponds to the number of lights.
                          The second number corresponds to the number of switches.
                     
                     Once the choice is made, the screen will populate with the game variables.


Citations   :
                    For information on getting the DOM element screen location
                    https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
                    
                    For information on using canvas
                    https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

                    For information on browser size properties
                    https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight

                    For information on clearing the canvas
                    https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect
            

------------------------------------------------------------------------------------------*/
let overview = "<h1>LightSwitch</h1><br><h2>Description:</h2><p> LightSwitch is a NP-Hard game that is based off of 3CNF</p><br><h2>Rules</h2><p> The player starts with j light connected to k switches via 3 wires.</p><p>Each light is connected to the switches via a direct wire or an inverted wire.</p><p>If you are playing with wires visible, then inverted wires are displayed in blue and direct wires are displayed in red.<ol>There are four possible states for each switch wire combo<li> Switch on and direct wire = current running</li><li> Switch off and inverted wire = current running</li><li>Switch on and inverted wire  = no current</li><li>Switch off and direct wire = no current</li></ol><p>A light will turn on if it is receiving current from at least one switch.</p><p>A light will turn off it is is not receiving current from any switches.</p><br><h2>Goal:</h2><p>Turn on all of the lights by flipping switches</p><br><br><h3>Author:</h3><p>Sean Caruthers</p><br><h4>Tips</h4><ul><li>If playing a game with many wires, you may want to remove the wires from your visibility as they quickly become cluttered.</li><li>Lights show how many valid connections that they have.  For example, a light with no black dots means that all switches connect to the light have current</li><li>Alternatively, a light that is completely black has not current running to it</li><li>You can attempt to play with many lights and switches, but be aware that trying 1000 lights and switches takes at least 10 to 15 seconds to initialize, due to the amount of DOM elements required</li></ul> ";

          



// set up our game variables
let num_wires = 3;
let num_lights = 20;
let num_switches = 10;
let lights = [];
let switches = [];
let wires = [];
let visible_wires = false;
let start_time;


// set up our DOM elements
const body = document.body;
const main = domCreate(body, 'main');

// setup canvas
let client_w = body.width;
let client_h = body.height;
const canvas = domCreate(body, 'canvas', {width : client_w, height : client_h});
const cvs = canvas.getContext('2d');

// setup game divs
let status_box = domCreate(body, 'div', {id : 'status'});
let light_box = domCreate(main, 'div', {id : 'lights'})
let switch_box = domCreate(main, 'div', {id : 'switches'})



// create a setup form for our game
let description = domCreate(body, 'details', {id : 'description', innerHTML: overview, open: 'true'});
domCreate(description, 'summary', {textContent: 'description'});


let setup = domCreate(main, 'form');
let fieldset = domCreate(setup, 'fieldset');
let legend = domCreate(fieldset, 'legend', {textContent : 'Setup game variables'});

let label_a = domCreate(fieldset, 'label', {textContent : 'Lights'});
let input_a = domCreate(fieldset, 'input', {type : 'number', required : "true", value: "20"});

let label_b = domCreate(fieldset, 'label', {textContent: 'Switches'});
let input_b = domCreate(fieldset, 'input', {type : 'number', required : "true", value: "10"});

let label_c = domCreate(fieldset, 'label', {textContent: 'View Wires'});
let input_c = domCreate(fieldset, 'input', {type : 'checkbox'});


let setup_btn = domCreate(fieldset, 'button', {type : 'submit', 'id': 'submit'});
setup_btn.addEventListener('click', setupGame);


window.addEventListener('resize', function(event){
    // in case of window resize, redraw our wires

    if(visible_wires)
    {
        renderWires();
    }
    
    event.preventDefault();
});





// set up our game classes





class Switch{
    // a class for our switches

    constructor(element)
    {
        // our switch constructor
        this.element = element;
        this.wires = [];
        this.position = randBool();
        this.updateSwitch();
    }

    addWire(wire)
    {
        this.wires.push(wire);
    }

    updateSwitch()
    {
        if(this.position)
        {
            this.element.textContent = '\u2350'
        }
        else
        {
            this.element.textContent = '\u2357'
        }
    }

}





class Wire{
    // a class for our wires

    constructor(origin, target, type)
    {
        // our wire constructor
        this.origin = origin;
        this.target = target;

        // 1 for directed and 0 for inverted
        this.type = type;

        origin.wires.push(this);
        target.wires.push(this);

        this.drawWire(origin, target);

    }

    liveWire()
    {
        // a function for checking whether the wire has current flowing through it
        if((this.origin.position && this.type) ||
           (!this.origin.position && !this.type))
        {
            return 1;
        }
        return 0;
    }

    drawWire()
    {
        let a = this.origin.element.getBoundingClientRect();
        let b = this.target.element.getBoundingClientRect();


        if(this.type){
            cvs.strokeStyle = 'red';
           
        }
        else{
            cvs.strokeStyle = 'blue';
        }

        cvs.beginPath();
        cvs.moveTo((a.left + a.right) / 2, a.top);
        cvs.lineTo((b.left + b.right) / 2, b.bottom);
        cvs.stroke();
        cvs.closePath();

      
    }

}


    

class Light{
    // a class for our lights
    
    constructor(element)
    {
        // our light constructor
        this.element = element;
        this.child = domCreate(this.element, 'div');
        this.wires = []
        this.status = null;
        this.live_wires = 0;
        this.setupWires()
        
    }

    setupWires()
    {

        // generate random, unique number in the range (0 to # switches)
        let stack = [];
        let rand;
        
        while(stack.length < num_wires)
        {
            rand = Math.floor(Math.random()*switches.length);
            if(!stack.includes(rand)){
                stack.push(rand);
            }
        }

        let origin;
        let target;
        let wire_type;
        let wire;

        // use these numbers to setup a switch -> wire -> light connection
        while(stack.length > 0)
        {
            // setup the new wire variables

            origin = switches[stack.pop()];
            target = this;
            wire_type = randBool();

            // add the wire to the switch and light
            wire = new Wire(origin, target, wire_type);
            wires.push(wire);
        }

     

    }

    updateStatus(){
        // a function for checking if the light is on

        let status;
        this.live_wires = 0

        // check each wire for a live connection
        for(let wire of this.wires)
        {

            if(wire.liveWire())
            {
                this.live_wires++;
            }
        }
        
        // if a connection is found, turn the light on
        if(this.live_wires){
            this.turnOn();
        }
        else{
            this.turnOff();
        }
    }


    turnOn(){
        this.child.textContent = this.live_wires;
        this.element.textContent = "";
        for(let i = 3 - this.live_wires; i > 0; i--){
            this.element.textContent += "\u2587\n"
        }
        this.status = 1;
        this.element.setAttribute('class', 'on');
    }

    turnOff(){
        this.element.textContent = "";
        this.status = 0;
        this.element.setAttribute('class', 'off');
    }
}





function renderWires(){
    // make sure that wires exist
    if(wires.length > 0){

        

        // redraw the wires after timeout
        setTimeout(function(){
            // clear the canvas and reset the size
            cvs.clearRect(0, 0, canvas.width, canvas.height);

            canvas.width = document.body.clientWidth;
            canvas.height = document.body.clientHeight;
            for(wire of wires){
                wire.drawWire();
            }
        }, 1000);
    }
}




function checkLights()
{
    // a function for updating our lights
    for(let light of lights){
        light.updateStatus();
    }
}



function setupGame(event)
{
    // event listener function for our setup button
    event.preventDefault();

    // retrieve our input
    num_lights = input_a.value;
    num_switches = input_b.value;
    visible_wires = input_c.checked;
    console.log(visible_wires);


    // validate our input
    if(!(num_lights >= 1 && num_switches >= 3))
    {
        alert('There must be at least one light and at least three switches');
        return
    }

    let i;
    
    // create our switch pieces
    for(i = 0; i < num_switches; i++)
    {
        createPiece(i, 'switch', switchClick);
    }
            
    // create our lights
    for(i = 0; i < num_lights; i++)
    {
        createPiece(i, 'light');
    }

    description.parentElement.removeChild(description);
    setup.parentElement.removeChild(setup);
    checkLights();
    startingPosition();

    if(visible_wires)
    {
        setTimeout(renderWires(), 1000);
    }
    start_time = new Date().getTime();
    
    
}


function victoryCheck()
{

    let finish_time = new Date().getTime() - start_time;
    if(lights.every(element => element.status)){
        alert(`Victory!\nLights: ${num_lights}\nSwitches: ${num_switches}\nTime: ${finish_time/1000} seconds`);
    }

}



function startingPosition()
{
    let count = 0;
    // if all of the lights are on at the start of the game, then flip some switches
    while(lights.every(element => element.status)){
        flipSwitches();
        checkLights();
        count++;

        if(count >= 10){
            alert('invalid starting position, please refresh');
        }
    }
}


function flipSwitches()
{
    // flip switches to a random position
    switches.forEach(element => element.position = randBool());
}


function randBool()
{
    // return a random number 0 or 1
    return Math.floor(Math.random()*2);
}

    
function createPiece(x, type, func)
{
    // a function for creating our game pieces
    
    let piece;
    let obj;
    
    // if we are creating a switch, set up in the switchBox w/ the event listener
    if(type === 'switch')
    {
        
        piece = domCreate(switch_box, 'button', {textContent : `s${x}`, id : 'switch', value: '1'});
        obj = new Switch(piece);
        piece.addEventListener('click', func.bind(obj));
        switches.push(obj);
    }
    
    // if we are creating a light, set up in lightBox and create three wires
    if(type === 'light')
    {

        let wiretype;
        let origin;
        
        piece = domCreate(light_box, 'div', {id : 'light'});
        
        lights.push(new Light(piece));
            
    }
}



function switchClick(event)
{

    // if the light is on
    if(this.position)
    {
        this.position = 0;
    }
    else
    {
        this.position = 1;

    }
    this.updateSwitch();
    checkLights();
    victoryCheck();
    
    event.preventDefault();
    
}


function domCreate(parent, tag, attributes = false, style = false)
{
     /* 
        Description:
             Create a new DOM element with a specified parent, tag, 
             attributes and style
       Parameters:
       
            parent = a DOM element that will serve as the table's parent
            tag = a valid html tag
       Default Parameters:
            attributes = a JSON object that holds attribute key and value pairs
            attribute example: {textContent : 'text', method : 'GET'}
            style = a JSON object that holds style key and value pairs
            style example: {backgroundColor : 'skyblue', margin : '5px'}
            
            Notes: If passing a style object, but not a attribute object to the function
                  A boolean value of false will need to be provided in the attribute
                  argument place in order for the function to work properly
              
                   Example:
                        let style = {backgroundColor : 'skyblue', margin : '5px'};
                        domCreate(document.body, 'main', false, style); 
                  
       Post-Conditions:
       
            The function adds the specified tag to the parent element provided.  
            The child element will be modified according to the attribute and style
            objects
       Returns:
            The new DOM element
     */

    let child = document.createElement(tag);
    
    if(attributes)
    {
        let keys = Object.keys(attributes);
        for(let prop of keys)
        {
            eval( "child." + prop + " = " + '"' + attributes[prop] + '"');
        }
    }
    
    if(style)
    {
        let keys = Object.keys(style);
        for(let prop of keys)
        {
            eval( "child.style." + prop + " = " + '"' + style[prop] + '"');
        }
    }
    parent.appendChild(child);
    
    return child;
}
