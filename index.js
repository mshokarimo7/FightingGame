const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw(){
        // spriteBox
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attackBox 
        c.fillStyle = 'green'
        if(this.isAttacking){  
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, 
            this.attackBox.width, this.attackBox.height)
        }
    }

    update(){
        // making sure the attack boxes are following their parent (i.e. player)
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.draw()

        // movement 
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity 
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack(){
        this.isAttacking = true
        /* 
        using a timer so that the attack goes for 100 miliseconds and the sword
        is drawn back, if we didnt do this then the player would be in attack state 
        until the sword collides with the enemy 
        */
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}

const player = new Sprite(
    {
        position: {x: 0, y: 0},
        velocity: {x: 0, y: 0},
        color: 'red',
        offset: {x: 0, y: 0}
    }  
)
const enemy = new Sprite(
    {
        position: {x: 350, y: 100},
        velocity: {x: 0, y: 0},
        color: 'blue',
        offset: {x: -50, y: 0}
    }
)

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

function rectangularCollision({rectangle1, rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector("#displayText").style.display = "flex"
    if(player.health === enemy.health){
        document.querySelector("#displayText").innerHTML = "Tie"
    }
    else if(player.health > enemy.health ){
        document.querySelector("#displayText").innerHTML = "Player wins!"
    }
    else if(enemy.health > player.health){
        document.querySelector("#displayText").innerHTML = "Enemy wins!"
    }
}

let timer = 30
let timerId

function decreaseTimer(){
    if(timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        document.querySelector("#timer").innerHTML = timer
        timer--
    }
    if(timer === 0){
        determineWinner({player: player, enemy: enemy, timerId: timerId})
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    // player movement
    player.velocity.x = 0
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
    }
    else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
    }
    
    // enemy movement
    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    }

    // detecting attack collisions, player on enemy
    if(rectangularCollision({rectangle1: player, rectangle2: enemy}) && 
    player.isAttacking){
            player.isAttacking = false
            enemy.health -= 20
            document.querySelector("#enemyHealth").style.width = enemy.health + "%"
    }

    // detecting attack collisions, enemy on player
    if(rectangularCollision({rectangle1: enemy, rectangle2: player}) && 
    enemy.isAttacking){
            enemy.isAttacking = false
            player.health -= 20
            document.querySelector("#playerHealth").style.width = player.health + "%"
    }

    // end game based on health 
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player: player, enemy: enemy, timerId: timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            keys.w.pressed = true
            player.lastKey = 'w'
            break
        case ' ':
            player.attack()
            break


        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            keys.ArrowUp.pressed = true
            enemy.lastKey = 'ArrowUp'
            break
        case 'Enter':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        // enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.w.pressed = false
            break
    }
})

