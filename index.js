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
        imageSrc: "./img/samuraiMack/IdleRight.png",
        framesMax: 8,
        scale: 2.5,
        offset: {x: 215, y: 155},
        sprites: {
            idleRight: {
                imageSrc: "./img/samuraiMack/IdleRight.png",
                framesMax: 8
            },
            idleLeft: {
                imageSrc: "./img/samuraiMack/IdleLeft.png",
                framesMax: 8
            },
            runRight: {
                imageSrc: "./img/samuraiMack/RunRight.png",
                framesMax: 8
            },
            runLeft: {
                imageSrc: "./img/samuraiMack/RunLeft.png",
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
            AttackRight: {
                imageSrc: "./img/samuraiMack/Attack1.png",
                framesMax: 6
            },
            AttackLeft: {
                imageSrc: "./img/samuraiMack/Attack1.png",
                framesMax: 6
            },
            takeHit: {
                imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
                framesMax: 4
            },
            death: {
                imageSrc: "./img/samuraiMack/Death.png",
                framesMax: 6
            }
        },
        attackBox: {
            offset: {x: 100, y: 50},
            width: 150,
            height: 50
        },
        directionRight: true,
        directionLeft: false
    }  
)

const enemy = new Fighter(
    {
        position: {x: 350, y: 100},
        velocity: {x: 0, y: 0},
        color: 'blue',
        imageSrc: "./img/kenji/IdleLeft.png",
        framesMax: 4,
        scale: 2.5,
        offset: {x: 215, y: 170},
        sprites: {
            idleLeft: {
                imageSrc: "./img/kenji/IdleLeft.png",
                framesMax: 4
            },
            idleRight: {
                imageSrc: "./img/kenji/IdleRight.png",
                framesMax: 4
            },
            runRight: {
                imageSrc: "./img/kenji/RunRight.png",
                framesMax: 8
            },
            runLeft: {
                imageSrc: "./img/kenji/RunLeft.png",
                framesMax: 8
            },
            jump: {
                imageSrc: "./img/kenji/Jump.png",
                framesMax: 2
            },
            fall: {
                imageSrc: "./img/kenji/Fall.png",
                framesMax: 2
            },
            AttackRight: {
                imageSrc: "./img/kenji/Attack1Right.png",
                framesMax: 4
            },
            AttackLeft: {
                imageSrc: "./img/kenji/Attack1.png",
                framesMax: 4
            },
            takeHit: {
                imageSrc: "./img/kenji/Take hit.png",
                framesMax: 3
            },
            death: {
                imageSrc: "./img/kenji/Death.png",
                framesMax: 7
            }
        },
        attackBox: {
            offset: {x: -165,y: 50},
            width: 150,
            height: 50
        },
        directionRight: false,
        directionLeft: true
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

    // rendering background and shop--------------------------------
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.04)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // rendering player and enemy-----------------------------------
    player.update()
    enemy.update()

    // player movement----------------------------------------------
    player.velocity.x = 0
    if(keys.a.pressed && !keys.d.pressed){
        player.velocity.x = -5
        player.switchSprite('runLeft')
        player.directionLeft = true
        player.directionRight = false
        if(player.dead){
            player.velocity.x = 0
        }
    }
    else if(keys.d.pressed && !keys.a.pressed){
        player.velocity.x = 5
        player.switchSprite('runRight')
        player.directionLeft = false
        player.directionRight = true
        if(player.dead){
            player.velocity.x = 0
        }
    }
    else{
        if (player.directionRight){
            player.switchSprite('idleRight')
        }
        else{
            player.switchSprite('idleLeft')
        }
    }
    
    // jumping and falling
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    }
    else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }
    
    // enemy movement------------------------------------------------
    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed && !keys.ArrowRight.pressed){
        enemy.velocity.x = -5
        enemy.switchSprite('runLeft')
        enemy.directionLeft = true
        enemy.directionRight = false
        if(enemy.dead){
            enemy.velocity.x = 0
        }
    }
    else if(keys.ArrowRight.pressed && !keys.ArrowLeft.pressed){
        enemy.velocity.x = 5
        enemy.switchSprite('runRight')
        enemy.directionLeft = false
        enemy.directionRight = true
        if(enemy.dead){
            enemy.velocity.x = 0
        }
    }
    else{
        if(enemy.directionRight){
            enemy.switchSprite('idleRight')
        }
        else{
            enemy.switchSprite('idleLeft')
        }
    }
    // enemy jumping and falling
    if (enemy.velocity.y < 0 ){
        if(enemy.velocity.x > 0){
            enemy.switchSprite('jumpRight')
        }
        else{
            enemy.switchSprite('jump')
        }
    }
    else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    // detecting attack collisions, PLAYER on ENEMY; and enemy gets hit----------------
    if(rectangularCollision({rectangle1: player, rectangle2: enemy}) && 
    player.isAttacking && player.framesCurrent === 4){
            enemy.takeHit()
            player.isAttacking = false
            gsap.to('#enemyHealth', {width: enemy.health + "%"})
    }

    // if player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    // detecting attack collisions, ENEMY on PLAYER; and player get hit----------------
    if(rectangularCollision({rectangle1: enemy, rectangle2: player}) && 
    enemy.isAttacking && enemy.framesCurrent === 2){
            player.takeHit()
            enemy.isAttacking = false
            gsap.to('#playerHealth', {width: player.health + "%"})
    }

    // if enemy misses
    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    // end game based on health------------------------------------
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player: player, enemy: enemy, timerId: timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if(!player.dead){
        switch (event.key){
            // player keys----------------------------------------------
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
                player.playerAttack()
                break
        }
    }

    if(!enemy.dead){
        switch (event.key){
            // enemy keys----------------------------------------------
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
                enemy.enemyAttack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key){
        // player keys----------------------------------------------
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        // enemy keys-----------------------------------------------
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

