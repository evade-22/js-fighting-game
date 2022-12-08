const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576 

// c means context
c.fillRect(0 ,0, canvas.width, canvas.height)

// responsible for staying in place
const gravity = 0.7

const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/woods.png'
})

const shop = new Sprite({
    position:{
        x:370,
        y:150
    },
    imageSrc: './img/shop_anim.png',
    scale: 3,
    framesMax: 6
})

// constant for player
const player = new Fighter({
    position:{
        x:150,
        y:0
    },
    velocity:{
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Martial Hero/Sprites/Idle.png',
    framesMax: 8,
    scale: 2.9,
    offset:{
        x: 230,
        y: 200
    },
    sprites:{
        idle:{
            imageSrc: './img/Martial Hero/Sprites/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc: './img/Martial Hero/Sprites/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './img/Martial Hero/Sprites/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './img/Martial Hero/Sprites/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './img/Martial Hero/Sprites/Attack1.png',
            framesMax: 6
        },
        takeHit:{
            imageSrc: './img/Martial Hero/Sprites/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death:{
            imageSrc: './img/Martial Hero/Sprites/Death.png',
            framesMax: 6
        }
    },
        attackBox:{
            offset:{
                x: 100,
                y: 50
            },
            width: 209,
            height: 50
        }
})

// constant for player 2
const enemy = new Fighter({
    position:{
        x:800,
        y:100
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/Martial Hero 2/Sprites/Idle.png',
    framesMax: 4,
    scale: 2.9,
    offset:{
        x: 250,
        y: 215
    },
    sprites:{
        idle:{
            imageSrc: './img/Martial Hero 2/Sprites/Idle.png',
            framesMax: 4
        },
        run:{
            imageSrc: './img/Martial Hero 2/Sprites/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './img/Martial Hero 2/Sprites/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './img/Martial Hero 2/Sprites/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './img/Martial Hero 2/Sprites/Attack1.png',
            framesMax: 4
        },
        takeHit:{
            imageSrc: './img/Martial Hero 2/Sprites/Take hit.png',
            framesMax: 3
        },
        death:{
            imageSrc: './img/Martial Hero 2/Sprites/Death.png',
            framesMax: 7
        }
    },
        attackBox:{
            offset:{
                x: -201,
                y: 50
            },
            width: 201,
            height: 50
        }
})


// code for all the keys used in game
const keys ={
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    // line of code to help not infinitely move
    player.velocity.x = 0
    enemy.velocity.x = 0
    
    // player 1 movement conditioning
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }
    //jumping
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }

    // player 2 movement conditioning
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }
    //jumping
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detection for player collision
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && 
        player.isAttacking && player.framesCurrent === 4){
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    //if player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    //enemy collision
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && 
        enemy.isAttacking && enemy.framesCurrent === 2){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }
     //if enemy misses
     if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    //victor decider
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }


}

animate()

// code for any key press such as movements and attacks
window.addEventListener('keydown', (event) =>{
    if(!player.dead){
        switch (event.key){
            //player 1 movements
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
                player.lastKey = 'w'
                break
            case ' ':
                player.attack()
                break
        }
    }

        //player 2 movements
        if(!enemy.dead){
            switch(event.key){
                case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                lastKey = 'd'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
            }
        }
})

window.addEventListener('keyup', (event) =>{
    //player 1 keys
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //player 2 keys
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})

