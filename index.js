const canvas = document.querySelector('canvas') // html game canvas/console  1
const context = canvas.getContext('2d') // 2d context

const scoreElement = document.querySelector('#scoreElement')
console.log('score')

console.log(context) // log to console

canvas.width = innerWidth // canvas dimensions
canvas.height = innerHeight

class PacManBoundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40 // boundary dimensions
        this.height = 40
        this.image = image
    }

    draw() {
        // context.fillStyle = 'blue' // draw function
        // context.fillRect(this.position.x, this.position.y, // fill in pacman boundary
        //                  this.width, this.height)
        context.drawImage(this.image, this.position.x, this.position.y)
    }
}

class PacManPlayer { // mr. pacman
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation = 0
    }

    draw() { // draw pacman
        context.save()
        context.translate(this.position.x, this.position.y)
        context.rotate(this.rotation)
        context.translate(-this.position.x, -this.position.y)
        context.beginPath()
        context.arc(this.position.x, this.position.y,
            this.radius, this.radians, Math.PI * 2 - this.radians)
        context.lineTo(this.position.x, this.position.y)
        context.fillStyle = 'yellow'
        context.fill()
        context.closePath()
        context.restore()
    }

    update() { // update pacman
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate

        this.radians += this.openRate
    }
}

class PacManGhost { // ghost
    static speed = 2
    constructor({ position, velocity, color = 'red' }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCol = []
        this.speed = 2
        this.scared = false
    }

    draw() { // draw pacman
        context.beginPath()
        context.arc(this.position.x, this.position.y,
            this.radius, 0, Math.PI * 2)
        context.fillStyle = this.scared ? 'blue' : this.color
        context.fill()
        context.closePath()
    }

    update() { // update pacman
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class PacManPellet { // pellet
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw() { // draw pacman player
        context.beginPath()
        context.arc(this.position.x, this.position.y,
            this.radius, 0, Math.PI * 2)
        context.fillStyle = 'cyan'
        context.fill()
        context.closePath()
    }
}

class PacManPowerUp { // powerup
    constructor({ position }) {
        this.position = position
        this.radius = 7
    }

    draw() { // draw pacman player
        context.beginPath()
        context.arc(this.position.x, this.position.y,
            this.radius, 0, Math.PI * 2)
        context.fillStyle = 'cyan'
        context.fill()
        context.closePath()
    }
}

const pellets = [] // to store pellets
const powerUps = [] // store powerups
const boundaries = [] // to store boundaries locations
const ghosts = [ // store ghosts
    new PacManGhost({
        position: {
            x: PacManBoundary.width * 7 + PacManBoundary.width / 2,
            y: PacManBoundary.height + PacManBoundary.height / 2
        },
        velocity: {
            x: PacManGhost.speed,
            y: 0
        }
    }),
    new PacManGhost({
        position: {
            x: PacManBoundary.width * 6 + PacManBoundary.width / 2,
            y: PacManBoundary.height * 3 + PacManBoundary.height / 2
        },
        velocity: {
            x: PacManGhost.speed,
            y: 0
        },
        color: 'orange'
    }),
    new PacManGhost({
        position: {
            x: PacManBoundary.width * 5 + PacManBoundary.width / 2,
            y: PacManBoundary.height * 4 + PacManBoundary.height / 2
        },
        velocity: {
            x: PacManGhost.speed,
            y: 0
        },
        color: 'pink'
    })
]

const player = new PacManPlayer({
    position: {
        x: PacManBoundary.width + PacManBoundary.width / 2,
        y: PacManBoundary.height + PacManBoundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ''
let score = 0

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'], // matrix for map
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src) { // create images
    const image = new Image()
    image.src = src
    return image
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: PacManBoundary.width * j,
                            y: PacManBoundary.height * i
                        },
                        image: createImage('./img/pipeHorizontal.png')
                    })
                )
                break
            case '|':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: PacManBoundary.width * j,
                            y: PacManBoundary.height * i
                        },
                        image: createImage('./img/pipeVertical.png')
                    })
                )
                break
            case '1':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: PacManBoundary.width * j,
                            y: PacManBoundary.height * i
                        },
                        image: createImage('./img/pipeCorner1.png')
                    })
                )
                break
            case '2':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: PacManBoundary.width * j,
                            y: PacManBoundary.height * i
                        },
                        image: createImage('./img/pipeCorner2.png')
                    })
                )
                break
            case '3':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: PacManBoundary.width * j,
                            y: PacManBoundary.weight * i
                        },
                        image: createImage('./img/pipeCorner3.png')
                    })
                )
                break
            case '4':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: PacManBoundary.width * j,
                            y: PacManBoundary.height * i
                        },
                        image: createImage('./img/pipeCorner4.png')
                    })
                )
                break
            case 'b':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: PacManBoundary.width * j,
                            y: PacManBoundary.height * i
                        },
                        image: createImage('./img/block.png')
                    })
                )
                break
            case '[':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        image: createImage('./img/capLeft.png')
                    })
                )
                break
            case ']':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        image: createImage('./img/capRight.png')
                    })
                )
                break
            case '_':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        image: createImage('./img/capBottom.png')
                    })
                )
                break
            case '^':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        image: createImage('./img/capTop.png')
                    })
                )
                break
            case '+':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        image: createImage('./img/pipeCross.png')
                    })
                )
                break
            case '.':
                pellets.push(
                    new PacManPellet({
                        position: {
                            x: j * PacManBoundary.width + PacManBoundary.width / 2,
                            y: i * PacManBoundary.height + PacManBoundary.height / 2
                        },
                    })
                )
                break
            case '5':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorTop.png')
                    })
                )
                break
            case '6':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorRight.png')
                    })
                )
                break
            case '7':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorBottom.png')
                    })
                )
                break
            case '8':
                boundaries.push(
                    new PacManBoundary({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        image: createImage('./img/pipeConnectorLeft.png')
                    })
                )
                break

            case 'p':
                powerUps.push(
                    new PacManPowerUp({
                        position: {
                            x: j * PacManBoundary.width,
                            y: i * PacManBoundary.height
                        },
                        image: createImage('./img/pipeConnectorLeft.png')
                    })
                )
                break
        }
    })
})

function circleCollidesWithRectangle({ circle, rectangle }) { // detects when pacman hits
    const padding = PacManBoundary.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y
        <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x
        >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y
        >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x
        <= rectangle.position.x + rectangle.width + padding
    )
}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    context.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, velocity: {
                            x: 0,
                            y: -5
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -5
            }
        }

    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, velocity: {
                            x: -5,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -5
            }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, velocity: {
                            x: 0,
                            y: 5
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 5
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleCollidesWithRectangle({
                    circle: {
                        ...player, velocity: {
                            x: 5,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 5
            }
        }
    }

    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
    if (Math.hypot( // ghost collides with pacman
            ghost.position.x - player.position.x,
            ghost.position.y - player.position.y) <
            ghost.radius + player.radius) {
                if (ghost.scared) {
                    ghosts.splice(i, 1)
                } else {
                cancelAnimationFrame(animationId)
                console.log('GAME OVER!!!')
            }
        }
    }

    if (pellets.length === 0) {
        console.log('WINNER!!!')
        cancelAnimationFrame(animationId)
    }

    for (let i = powerUps.length - 1; 0 <= i; i--) { // powerup collected
        const powerUp = powerUps[i]
        powerUp.draw()
        if (Math.hypot(powerUp.position.x - player.position.x, // player colliding with powerup
            powerUp.position.y - player.position.y) <
            powerUp.radius + player.radius)
            {
                powerUps.splice(i, 1)

                ghosts.forEach(ghost => {
                    ghost.scared = true
                    console.log(ghost.scared)
                    
                    setTimeout(() => {
                        ghost.scared = false
                    }, 5000) // duration of "scared" phase in ghosts
                    
                })
            }
    }
    
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (Math.hypot(pellet.position.x - player.position.x,
            pellet.position.y - player.position.y) <
            pellet.radius + player.radius) {
            console.log('colliding')
            pellets.splice(i, 1)
            score += 5
            scoreElement.innerHTML = score
        }
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: boundary
            })
        ) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    player.update()

    ghosts.forEach((ghost) => {
        ghost.update()
        const collisions = []
        boundaries.forEach((boundary) => {
            if (
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('right')
            }

            if (
                !collisions.includes('left') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('left')
            }

            if (
                !collisions.includes('up') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('up')
            }

            if (
                !collisions.includes('down') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('down')
            }
        })

        if (collisions.length > ghost.prevCol.length)
            ghost.prevCol = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCol)) {
            console.log('gogo')

            console.log(collisions)
            console.log(ghost.prevCol)
            if (ghost.velocity.x > 0) ghost.prevCol.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCol.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCol.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCol.push('down')

            const routes = ghost.prevCol.filter(collision => {
                return !collisions.includes(collision)
            })

            console.log({ routes })

            const direction = routes[Math.floor(Math.random() * routes.length)]
            console.log(direction)

            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break
                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break
                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break
                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break
            }

            ghost.prevCol = []
        }

        // console.log(collisions)

    })

    if (player.velocity.x > 0 ) player.rotation = 0
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
    }

    console.log(keys.d.pressed)
    console.log(keys.s.pressed)
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
    }

    console.log(keys.d.pressed)
    console.log(keys.s.pressed)
})

