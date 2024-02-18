const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite(
    {
        position: {x: 0, y: 0},
        imageSrc: "./img/background.png",
        scale: 1,
        framesMax: 1
    }
)

const shop = new Sprite(
    {
        position: {x: 630, y: 160},
        imageSrc: "./img/shop.png",
        scale: 2.5,
        framesMax: 6
    }
)

const player = new Fighter(
    {
        position: {x: 0, y: 0},
        velocity: {x: 0, y: 0},
        color: 'red',
        offset: {x: 0, y: 0},
        imageSrc: "./img/samuraiMack/Idle.png",
        framesMax: 8,
        scale: 2.5,
        offset: {x: 215, y: 155},
        sprites: {
            idle: {
                imageSrc: "./img/samuraiMack/Idle.png",
                framesMax: 8
            },
            run: {
                imageSrc: "./img/samuraiMack/Run.png",
                framesMax: 8
            },
            jump: {
                imageSrc: "./img/samuraiMack/Jump.png",
                framesMax: 2
            },
            fall: {
                imageSrc: "./img/samuraiMack/Fall.png",
                framesMax: 2
            },
            attack1: {
                imageSrc: "./img/samuraiMack/Attack1.png",
                framesMax: 6
            }
        }
    }  
)
const enemy = new Fighter(
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


decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)

    // rendering background and shop
    background.update()
    shop.update()

    // rendering player and enemy 
    player.update()
    //enemy.update()

    // player movement
    player.velocity.x = 0
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else{
        player.switchSprite('idle')
    }
    // jumping and falling
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    }
    else if(player.velocity.y > 0){
        player.switchSprite('fall')
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

