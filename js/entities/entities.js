game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
              image: "player",
              width: 64,
              height: 64,
              spritewidth: "64",
              spriteheight: "64",           
              getShape: function(){
                  return(new me.Rect(0, 0, 64, 64)).toPolygon();
              }
        }]);
    
    // move 5 units to the right
    //represent our current position
    // need to add collision so player won't fall
    this.body.setVelocity(5, 20); // 20 make y location has change 
    
    this.facing = "right";
    //keep track of what time it is for the date
    this.now = new Date().getTime();
    this.lastHit = this.now;
    this.lastAttack = new Date().getTime(); //haven't use the attack variable yet   
    
    //no matter the player screen is going to follow him
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    
    
    this.renderable.addAnimation("idle", [78]);
    
    //walk animation on the spritesheet, 8o milisecond between frame
    this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
    
    //Animation for character attack
    this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    
    //set currentAnimation to idle
    this.renderable.setCurrentAnimation("idle");
    
    },
    //delta changing time it happens
    update: function(delta){
        this.now = new Date().getTime();
        //press the right button, set to walk
        if(me.input.isKeyPressed("right")){
            //move from the current position
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);// switch from facing the left to right
        }
        
        //move player to the left
        else if(me.input.isKeyPressed("left")){
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.facing = "left";
            this.flipX(false);
        }      
        else
        {
            this.body.vel.x = 0;
        }
        
        //make a new if statement focusing on jumping
          if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
              this.body.jumping = true;// Melon has jumping variable
              this.body.vel.y -= this.body.accel.y * me.timer.tick;
              me.audio.play("jump");
          }
                
        
        //Make your character Attack by pressing a
        if(me.input.isKeyPressed("attack")){
            if(!this.renderable.isCurrentAnimation("attack")){
                //set current animation to attack and then set it to idle
                this.renderable.setCurrentAnimation("attack", "idle");
                //next time we start this sequence begin with first animation
                this.renderable.setAnimationFrame();
            }
        }
                        
        else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else if(!this.renderable.isCurrentAnimation("attack"))
        {
            this.renderable.setCurrentAnimation("idle");
        }
        
        
        // passing parameters to the collideHandler
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        //call the update function
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(response){
        if(response.b.type === 'EnemyBaseEntity'){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            //player fall on top of the tower
            if(ydif < -40 && xdif < 70 && xdif > -35){
                this.body.falling = false;
                this.body.vel.y = -1;
            }            
            //make player moves right
            else if(xdif > -30 && this.facing === 'right'&& (xdif < 0)){
                this.body.vel.x = 0;
                this.pos.x = this.pos.x -1;
            }
            // coming from the right side and prevent from overlapping
            else if(xdif < 70 && this.facing === 'left' && xdif > 0){
                this.body.vel.x = 0;
                this.pos.x = this.pos.x + 1; 
            }
            
            //if we're attacking by making contact with the base, lose health
            if(this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= 300){
                this.lastHit = this.now;
                response.b.loseHealth();
            }
        }
    }    
});


game.PlayerBaseEntity = me.Entity.extend({
    init : function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
             image: "tower",
             width: 100,
             height: 100,
             spritewidth: "100",
             spriteheight: "100",
             
             getShape: function(){
                 //lower to make the base to 70
                 return (new me.Rect(0, 0, 100, 70)).toPolygon();
             }
        }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerBase";
        
        //not burning animation
        this.renderable.addAnimation("idle", [0]);
        //broken tower
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
        
    },
    // check to see if the tower is broken
    update:function(delta){
        if(this.health <= 0){
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },

    loseHealth: function(damage){
        this.health = this.health - damage;
    },
    
    onCollision: function(){
        
    }
});



game.EnemyBaseEntity = me.Entity.extend({
    init : function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
             image: "tower",
             width: 100,
             height: 100,
             spritewidth: "100",
             spriteheight: "100",
             
             getShape: function(){
                 //lower the base to 70 to make it align with the floor
                 return (new me.Rect(0, 0, 100, 70)).toPolygon();
             }
        }])
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = "EnemyBaseEntity";
        
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
        
    },
    
    update:function(delta){
        if(this.health <= 0){
            this.broken = true;
        this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    onCollision: function(){
        
    },
    
    loseHealth: function(){
        this.health--;
    }
});

//create a new class call Enemy Creep

game.EnemyCreep = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
        image: "creep1",
        width: 32,
        height: 64,
        spritewidth: "32",
        spriteheight: "64",
        
        getShape: function(){
            return (new me.Rect(0, 0, 32, 64)).toPolygon();
        }
        
     }]);
       
        this.health = 10;
        this.alwaysUpdate = true;
        //this lets us know if the enemy is attacking
        this.attacking = false;
        // this keeps track of when our creep last attacked anything
        this.lastAttacking = new Date().getTime();
        // keeps track of the last time our creep hit anything
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);
        this.type = "EnemyCreep";
        
        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
        
    },
    
    update: function(delta){
        this.now = new Date().getTime();
// make sthe creep move
        this.body.vel.x-= this.body.accel.x * me.timer.tick;

me.collision.check(this, true, this.collideHandler.bind(this), true);


//updates the creeps movements 
        this.body.update(delta);

         this._super(me.Entity, "update", [delta]);

        return true;
    },
collideHandler: function(response){
    if(response.b.type==='PlayerBase'){
        this.attacking=true;
       // this.lastAttacking=this.now;
        this.body.vel.x = 0;
        this.pos.x = this.pos.x + 1;
        if((this.now-this.lastHit >= 1000)){
            this.lastHit = this.now;
            response.b.loseHealth(1);
        }
    }
}

});

game.GameManager = Object.extend({
init: function(x, y, settings){
this.now = new Date().getTime();
this.lastCreep = new Date().getTime();
this.alwaysUpdate = true;
},
update: function(){
this.now = new Date().getTime();

if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
    this.lastCreep = this.now;
    var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
    me.game.world.addChild(creepe, 5);
    }
    return true;
}

});
