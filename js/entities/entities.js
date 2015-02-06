game.PlayerEntity = me.Entity.extend({
	//setting function
	init: function(x, y, settings) {
		//extending the function
		this._super(me.Entity, 'init', [x, y, {
			//setting the player image and its width and height
			image: "player", 
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",

			getShape: function(){
				//new shift
				//rectangle to make the character walk into it
				//setting it to the right size
				return (new me.Rect (0, 0, 64, 64)).toPolygon(); 
			}
		}]);
		//setting the velocity
		this.body.setVelocity(5, 20);
		this.facing = "right";
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		//makes the player stand in idle position
		this.renderable.addAnimation("idle" , [78]);
		//makes the playeer walk in a cool animated way
		this.renderable.addAnimation("walk", [117, 118 , 119 , 120 , 121 , 122 , 123 , 124 , 125], 80);
		//
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
		//when the player is not moving he is idle
		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		//checking if the right key is pressed
		if (me.input.isKeyPressed("right")) {
			//adds to  the position of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.facing = "right";
			this.flipX(true);

			//if other key is pressed it wont work
		}
		 else if (me.input.isKeyPressed("left")){
		 	this.facing = "left";
        	this.body.vel.x -=this.body.accel.x * me.timer.tick;
			this.flipX(false);
		 else {
			this.body.vel.x = 0; 
		}

		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling) {
          this.jumping = true;
          this.body.vel.y -= this.body.accel.y * me.timer.tick;
    }

		if(this.body.vel.x !== 0) {


			if(me.input.isKeyPressed("attack")){
				if(!this.renderable.isCurrentAnimation("attack")){
					console.log(!this.renderable.isCurrentAnimation("attack"));
					this.renderable.setCurrentAnimation("attack" , "idle");
					this.renderable.setAnimationFrame();
					}
		        }
		        else if(this.body.vel.x !== 0){

		// states tat if the right key is pressed he is walkig 	
		if(!this.renderable.isCurrentAnimation("walk")){
			this.renderable.setCurrentAnimation("walk");
	}
}
// if he isnt walking then he is idle
       else {

	this.renderable.setCurrentAnimation("idle");
}
if(me.input.isKeyPressed("attack")){
		
	if(!this.renderable.isCurrentAnimation("attack")){
		console.log(!this.renderable.isCurrentAnimation("attack"));
		//sets the current animation to attack and once that is over
	//goes back to the idle animation
	this.renderable.setCurrentAnimation("attack" , "idle");
	//makes it so that the next time we start this sequence we begin
	//from the first animation, not wherever we left off when we
	//switched to another animation
	this.renderable.setAnimationFrame();
	}
}
        me.collision.check(this, true, this.collideHandler.bind(this), true);
		//updating the game
		this.body.update(delta);
// udated the player
//reaches to the constructor of Entity
		this._super(me.Entity, "update" , [delta]);
		return true;
		collideHandler: function(response) {
		if(response.b.type==='EnemyBaseEntity') {
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;
			
			console.log("xdif " + xdif + " ydif " + ydif);

			if(xdif>-35 && this.facing==='right' && (xdif<0)) {
				this.body.vel.x = 0;
				this.pos.x = this.pos.x -1;
			}else if(xdif<70 && this.facing==='left' && xdif>0) {
				this.body.vel.x = 0;
				this.pos.x = this.pos.x +1;

 //			}
		}
	}
});

// settings for the players base
game.PlayerBaseEntity = me.Entity.extend ({
	init : function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			//adding the tower image , and setting its size
             image: "tower",
             width: 100,
             height: 100,
             spritewidth: "100",
             spriteheight: "100",
             getShape: function() {
             	//setting the rectangle thats for the tower
             	return (new me.Rect(0, 0, 100, 80)).toPolygon();
             }
		}]);
        //the health of the power .. if you hit it more than 10 times , then it will blow up
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		// ,akes the tower colidable
		this.body.onCollision = this.onCollision.bind(this);
// declares what type of entity
		this.type = "PlayerBaseEntity";
// classes that animate my bases
		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},

	update:function(delta) {
		//the tower when it has no hits yet , (health is at 0 )
           if(this.health<=0) {
           	this.broken = true;
            this.renderable.setCurrentAnimation("broken");
           }
           this.body.update(delta);
           // updates when or if the base is hit
           this._super(me.Entity, "update", [delta]);
           return true;
	},

	onCollision: function() {

	}

});

//setting for the enemy base
game.EnemyBaseEntity = me.Entity.extend ({
	init : function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
             //adding the tower image , and setting its size
             image: "tower",
             width: 100,
             height: 100,
             spritewidth: "100",
             spriteheight: "100",
             getShape: function() {
             	//setting the rectangle thats for the tower
             	return (new me.Rect(0, 0, 100, 80)).toPolygon();
             }
		}]);
        //the health of the power .. if you hit it more than 10 times , then it will blow up
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "EnemyBaseEntity";
/// classses that animate my base
		this.renderable.addAnimation("idle" , [0]);
		this.renderable.addAnimation("broken" , [1]);
		this.renderable.setCurrentAnimation("idle");
	},

	update:function(delta) {
		// if the halth is less or = to 0 it will show the animated base being destroyed
           if(this.health<=0) {
           	this.broken = true;
           	this.renderable.setCurrentAnimation("broken");
           
           }
           this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function() {
		
	}

});