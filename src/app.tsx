import './style.css';
import JSX from './custom-render'
import { NodeRef } from './NodeRef';
import { vec } from './vector';

/** @jsx afreact.createElement */
/** @jsxFrag afreact.createFragment */

const ShipThrusterVisual = () => (
  <>
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
    hello
  </>
)

const PlayerSvg = () => (
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

const innerPlayerRef = new NodeRef<HTMLDivElement>()

const InnerPlayer = () => (
  <div
    class='player-inner'
    style="width: 50px; height: 50px; margin-left: -50%; margin-top: -50%;"
    ref={innerPlayerRef}
  >
    <PlayerSvg></PlayerSvg>
    <ShipThrusterVisual />
  </div>
) as HTMLDivElement

var playerDiv = (
  <div
    class='player-container'
    style="left: 50%; top: 50%; position: absolute; width: 50px; height: 50px;"
  >
    <InnerPlayer />
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

const accel = vec(0, 0.001)

class Player {
  pos = vec(0, 0)
  vel = vec(0, 0)
  angularVel = 0
  rotation = Math.PI / 3

  update() {
    this.vel = this.vel.add(accel.rotate(-this.rotation))
    this.pos = this.pos.add(this.vel)
    // this.rotation = Date.now() / 3
    innerPlayerRef.instance.style.transform = `translate3d(${this.pos.x}px, ${-this.pos.y}px, 0px) rotate3d(0, 0, 1, ${this.rotation}rad) `
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