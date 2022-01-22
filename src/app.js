import './style.css';
import * as afreact from './custom-render'

/** @jsx afreact.createElement */
/** @jsxFrag afreact.createFragment */

const shipThrusterVisual = (
  <svg class="gamer-svg">
    <path
      style="transform: translate(50%, 50%) scale(16);"
      d="M -1 4 L 0 7 L 1 4"
      stroke='white'
      fill='none'
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
)

const playerSvg = (
  <svg class="gamer-svg">
    <path
      style="transform: translate(50%, 50%) scale(16);"
      d="M -5 7 L 0 -8 L 5 7 M 4 4 L -4 4"
      stroke='white'
      fill='none'
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
)

const innerPlayer = (
  <div
    class='player-inner'
    style="width: 50px; height: 50px; margin-left: -50%; margin-top: -50%; "
  >
    {playerSvg}
    {shipThrusterVisual}
  </div>
)

var playerDiv = (
  <div
    class='player-container'
    style="left: 50%; top: 50%; position: absolute; width: 50px; height: 50px;"
  >
    {innerPlayer}
  </div>
)

global.player = playerDiv

const app = (
  <div
    class="app"
    style="width: 100%; height: 100vh; position: relative;"
  >
    {playerDiv}
  </div>
)

class Vector2 {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  rotate(degrees) {
    // TODO
    return vec()
  }
}

function vec(x = 0, y = 0) {
  return new Vector2(x, y)
}

console.log(playerDiv)

const accel = vec(0, 0.0001)

class Player {
  pos = vec()
  vel = vec(0, 0)
  angularVel = 0
  rotation = 33

  update() {
    this.vel = vec(this.vel.x + accel.x, this.vel.y + accel.y)
    this.pos = vec(this.pos.x + this.vel.x, this.pos.y + this.vel.y)
    // this.rotation = Date.now() / 30
    innerPlayer.style.transform = `translate3d(${this.pos.x}px, ${-this.pos.y}px, 0px) rotate3d(0, 0, 1, ${this.rotation}deg) `
  }
}

const player = new Player()

function loop() {
  player.update()
  requestAnimationFrame(loop)
}

setTimeout(() => {
  location.reload();
}, 15000)

requestAnimationFrame(loop)

document.body.appendChild(app)