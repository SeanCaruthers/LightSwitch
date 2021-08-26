
![lightswitch](https://user-images.githubusercontent.com/20529369/130880148-c257c930-d2a4-45d9-acbf-5154f6522a01.gif)

<dl>
  <dt>Program</dt>
  <dd>LightSwitch</dd>
  <dt>Author</dt>
  <dd>Sean Caruthers</dd>
  <dt>Date</dt>
  <dd>2020-08-02</dd>
  <dt>Description</dt>
  <dd>LightSwitch is a NP-Hard game that is based off of 3CNF.</dd>
  <dt>Goal</dt>
  <dd>Turn on all of the lights by flipping switches.</dd>
  <dt>Rules</dt>
  <dd>
    <p>The player starts with j light connected to k switches via 3 wires.</p>
    <p>Each light is connected to the switches via a direct wire or an inverted wire.</p>
    <dl>
      <dt>There are four possible states for each switch wire combo:</dt>
      <dd>
        <ul>
          <li>Switch on and direct wire = current running</li>
          <li>Switch off and inverted wire = current running</li>
          <li>Switch on and inverted wire  = no current</li>
          <li>Switch off and direct wire   = no current</li>
        </ul>
      </dd>
    </dl>
  </dd>                     
    <p>A light will turn on if it is receiving current from at least one switch..</p>
    <p>A light will turn off it is is not receiving current from any switches..</p>  
  <dt>Setup </dt>
  <dd>
    <p>The user is prompted to enter two numbers to determine the difficulty level of the game.</p>
    <dl>
      <dt>There are four possible states for each switch wire combo:</dt>
      <dd><ul>
        <li>The first number corresponds to the number of lights.</li>
        <li>The second number corresponds to the number of switches.</li>
        </ul>
      </dd>
    </dl>
    <p>Once the choice is made, the screen will populate with the game variables.</p>            
  </dd>
  </dl>
