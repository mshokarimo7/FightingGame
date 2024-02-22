class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        /* we are also creating a framesMax variable since we have a single class for 
        both background and shop. Since we want to cut out the shop in segments of 1/6th,
        we implemented a way of cutting out segments of the whole image in the c.drawImage 
        function. This cutting then also affects the background and essentially cuts the 
        background image into 6 parts, thus drawing only the 1/6th part of the image. To 
        avoid this, framesMax is created to cut out the necessary images into the amount of 
        frames within a respective image input. */
        this.framesMax = framesMax 
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw(){
        c.drawImage(this.image, 
            this.framesCurrent * (this.image.width/this.framesMax), // x crop location
            0,                                                      // y crop location
            // making sure we crop out the first frame, since there are 6 frames
            this.image.width / this.framesMax,                      // x crop width
            this.image.height,                                      // y crop height

            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            /* making sure we set the width of the draw to 1/6th of the whole wide image
            if we don't, we will end up stretching the shop to the full width of the 
            inputted wide image(with the 6 animations/shops) */
            (this.image.width / this.framesMax) * this.scale, // x draw width 
            this.image.height * this.scale)                   // y draw height
    }

    animateFrames(){
        this.framesElapsed++

        if(this.framesElapsed % this.framesHold === 0){
            /* subtracting 1 so that if we only have framesMax == 1, then we dont cut out 
            the background from 1024th pixel in the x direction
            in case of 6 frames, we then have 5, and it draws 0, 1, 2, 3, 4, 5 with the 5th 
            frame being the last iteration of the "this.framesCurrent++" happening */
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            }
            else{
                this.framesCurrent = 0
            }
        }
    }

    update(){
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({position, velocity, color = 'red', imageSrc, scale = 1, 
    framesMax = 1, offset = {x: 0, y: 0}, sprites,
    attackBox = {offset:{}, width: undefined, height: undefined},
    directionRight, directionLeft}) {
        // calling the constructor of the parent i.e. Sprite
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        this.directionRight = directionRight
        this.directionLeft = directionLeft

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        console.log(this.sprites)
    }

    update(){
        
        this.draw()
        if(!this.dead){
            this.animateFrames()
        }

        // making sure the attack boxes are following their parent (i.e. player)
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y 

        // drawing the attack box
        /*c.fillRect(this.attackBox.position.x, this.attackBox.position.y, 
            this.attackBox.width,
            this.attackBox.height)*/


        // movement 
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // gravity 
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96){
            this.velocity.y = 0
            this.position.y = 330
        } else {
            this.velocity.y += gravity
        }
    }

    enemyAttack(){
        if(this.directionRight){
            this.switchSprite('AttackRight')
        }
        else {
            this.switchSprite('AttackLeft')
        }
        this.isAttacking = true
    }

    playerAttack(){
        if(this.directionRight){
            this.switchSprite('AttackRight')
        }
        else {
            this.switchSprite('AttackLeft')
        }
        this.isAttacking = true
    }

    takeHit(){
        this.health -= 20

        if(this.health <= 0){
            this.switchSprite('death')
        }
        else{
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite){
        /* making sure the attack goes through all the animation frames, before
        we continue over to the switch statement to check for other actions 
        */
        if(this.image === this.sprites.AttackLeft.image && 
            this.framesCurrent < this.sprites.AttackLeft.framesMax - 1){
                return
        }
        else if(this.image === this.sprites.AttackRight.image && 
            this.framesCurrent < this.sprites.AttackRight.framesMax - 1){
                return
        }

        // overriding when figher gets hit 
        if(this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1){
                return
        }
        
        // overriding when fighter dies 
        if(this.image === this.sprites.death.image ){
            /* making sure the death animation has finished before setting the 
            death boolean to true*/
            if(this.framesCurrent === this.sprites.death.framesMax - 1){
                this.dead = true
            }
            return
        }

        // regular animation states 
        switch(sprite){
            case 'idleRight':
                if(this.image !== this.sprites.idleRight.image){
                    this.image = this.sprites.idleRight.image
                    this.framesMax = this.sprites.idleRight.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'idleLeft':
                if(this.image !== this.sprites.idleLeft.image){
                    this.image = this.sprites.idleLeft.image
                    this.framesMax = this.sprites.idleLeft.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'runRight':
                if(this.image != this.sprites.runRight.image){
                    this.image = this.sprites.runRight.image
                    this.framesMax = this.sprites.runRight.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'runLeft':
                if(this.image != this.sprites.runLeft.image){
                    this.image = this.sprites.runLeft.image
                    this.framesMax = this.sprites.runLeft.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jumpRight':
                if(this.image != this.sprites.jumpRight.image){
                    this.image = this.sprites.jumpRight.image
                    this.framesMax = this.sprites.jumpRight.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jumpLeft':
                if(this.image != this.sprites.jumpLeft.image){
                    this.image = this.sprites.jumpLeft.image
                    this.framesMax = this.sprites.jumpLeft.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'fall':
                if(this.image != this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'AttackLeft':
                if(this.image != this.sprites.AttackLeft.image){
                    this.image = this.sprites.AttackLeft.image
                    this.framesMax = this.sprites.AttackLeft.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'AttackRight':
                if(this.image != this.sprites.AttackRight.image){
                    this.image = this.sprites.AttackRight.image
                    this.framesMax = this.sprites.AttackRight.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'takeHit':
                if(this.image != this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'death':
                if(this.image != this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break


        }
    }
}