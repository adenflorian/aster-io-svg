import './style.css';
import JSX from './custom-render'
import { NodeRef } from './NodeRef';
import { Keyboard, Keys, vec, Vector } from './excalibur/engine';

/** @jsx afreact.createElement */
/** @jsxFrag afreact.createFragment */

const playerContainerRef = new NodeRef<HTMLDivElement>();

global.thrusterVisualRef = playerContainerRef

const shipScale = 4

const ShipThrusterVisual = () => (
  <>
    <svg class="gamer-svg thruster">
      <path
        style={`transform: translate(50%, 50%) scale(${shipScale});`}
        d="M -1 4 L 0 7 L 1 4"
        stroke='white'
        fill='none'
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;help
  </>
)

const PlayerSvg = () => (
  <svg class="gamer-svg">
    <path
      style={`transform: translate(50%, 50%) scale(${shipScale});`}
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

const shipClonePositions = [
  vec(-1, -1), vec(0, -1), vec(1, -1),
  vec(-1, 0), vec(1, 0),
  vec(-1, 1), vec(0, 1), vec(1, 1),
]

type CloneRef = NodeRef<HTMLDivElement> & { offset: Vector }

const shipCloneRefs: CloneRef[] = []

const innerPlayerRef = new NodeRef<HTMLDivElement>()

const InnerPlayer = ({ ref2 }) => (
  <div
    class='player-inner'
    style="width: 50px; height: 50px; margin-left: -50%; margin-top: -50%; position: absolute;"
    ref={ref2}
  >
    <PlayerSvg></PlayerSvg>
    <ShipThrusterVisual />
  </div>
) as HTMLDivElement

var playerDiv = (
  <div
    class='player-container'
    style="left: 50%; top: 50%; position: absolute; width: 50px; height: 50px;"
    ref={playerContainerRef}
  >
    <InnerPlayer ref2={innerPlayerRef} />
    {shipClonePositions.map(x => {
      const newRef: CloneRef = {
        offset: x,
        ...new NodeRef<HTMLDivElement>(),
      }
      shipCloneRefs.push(newRef)
      return (
        <InnerPlayer ref2={newRef} />
      )
    })}
  </div>
)

const app = (
  <div
    class="app"
    style="width: 100%; height: 100vh; position: relative;"
  >
    {playerDiv}
  </div>
)

const keyboardInput = new Keyboard()

keyboardInput.init()

const accel = 2
const rotateSpeed = 3
const maxVel = 4

class Player {
  pos = vec(0, 0)
  vel = vec(0, 0)
  angularVel = 0
  rotation = Math.PI / 3

  update(delta: DOMHighResTimeStamp) {
    if (keyboardInput.isHeld(Keys.W)) {
      this.vel = this.vel.add(vec(0, accel * delta).rotate(-this.rotation))
    }
    if (keyboardInput.wasPressed(Keys.W)) {
      console.log('W')
      playerContainerRef.instance.classList.add('thrust')
    }
    if (keyboardInput.wasReleased(Keys.W)) {
      console.log('-W')
      playerContainerRef.instance.classList.remove('thrust')
    }
    if (keyboardInput.isHeld(Keys.A)) {
      this.rotation -= (rotateSpeed * delta)
    }
    if (keyboardInput.isHeld(Keys.D)) {
      this.rotation += (rotateSpeed * delta)
    }
    if (this.vel.size > maxVel) {
      this.vel.size = maxVel
    }

    this.pos = this.pos.add(this.vel)

    if (this.pos.y > window.innerHeight / 2) {
      this.pos.y = -window.innerHeight / 2
    }
    if (this.pos.y < -window.innerHeight / 2) {
      this.pos.y = window.innerHeight / 2
    }
    if (this.pos.x > window.innerWidth / 2) {
      this.pos.x = -window.innerWidth / 2
    }
    if (this.pos.x < -window.innerWidth / 2) {
      this.pos.x = window.innerWidth / 2
    }

    innerPlayerRef.instance.style.transform = `translate3d(${this.pos.x}px, ${-this.pos.y}px, 0px) rotate3d(0, 0, 1, ${this.rotation}rad)`

    shipCloneRefs.forEach(x => {
      x.instance.style.transform = `translate3d(${this.pos.x + ((window.innerWidth) * x.offset.x)}px, ${-this.pos.y + ((window.innerHeight) * x.offset.y)}px, 0px) rotate3d(0, 0, 1, ${this.rotation}rad)`
    })
  }
}

const player = new Player()

let lastTimestamp = 0

function loop(timeStamp: DOMHighResTimeStamp) {
  const delta = timeStamp - lastTimestamp
  lastTimestamp = timeStamp
  player.update(delta / 1000)
  keyboardInput.update()
  requestAnimationFrame(loop)
}

// setTimeout(() => {
//   location.reload();
// }, 15000)

requestAnimationFrame(loop)

document.body.appendChild(app)