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
    framesMax = 1, offset = {x: 0, y: 0}, sprites}) {
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
            offset: offset,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        console.log(this.sprites)
    }

    update(){
        // making sure the attack boxes are following their parent (i.e. player)
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.draw()
        this.animateFrames()

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

    attack(){
        this.switchSprite('attack1')
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

    switchSprite(sprite){
        /* making sure the attack goes through all the animation frames, before
        we continue over to the switch statement to check for other actions 
        */
        if(this.image === this.sprites.attack1.image && 
            this.framesCurrent < this.sprites.attack1.framesMax - 1){
            return
        }
        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if(this.image != this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if(this.image != this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
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
            case 'attack1':
                if(this.image != this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }
}