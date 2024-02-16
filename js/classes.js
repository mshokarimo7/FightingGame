class Sprite {
    constructor({position, imageSrc}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    update(){
        this.draw()
    }
}

class Fighter {
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