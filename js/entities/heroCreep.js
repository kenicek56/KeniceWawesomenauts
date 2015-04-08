//create a new class call Enemy Creep

game.heroCreep = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
        image: "creep2",
        width: 100,
        height: 85,
        spritewidth: "100",
        spriteheight: "85",
        
        getShape: function(){
            return (new me.Rect(0, 0, 100, 85)).toPolygon();
        }
        
     }]);
       
        this.health = game.data.heroCreepHealth;
        this.alwaysUpdate = true;
        //this lets us know if the enemy is attacking
        this.attacking = false;
        // this keeps track of when our creep last attacked anything
        this.lastAttacking = new Date().getTime();
        // keeps track of the last time our creep hit anything
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
        this.body.setVelocity(3, 60);
        this.type = "heroCreep";
        this.flipX(true);
        
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4], 80);
        this.renderable.setCurrentAnimation("walk");
        
    },

    loseHealth: function(damage) {
        this.health = this.health - damage;
        me.audio.play("enemykill");
    },
    
    update: function(delta){
        if(this.health <=0) {
            me.game.world.removeChild(this);
        }

        this.now = new Date().getTime();
// make sthe creep move
        this.body.vel.x+= this.body.accel.x * me.timer.tick;

me.collision.check(this, true, this.collideHandler.bind(this), true);


//updates the creeps movements 
        this.body.update(delta);

         this._super(me.Entity, "update", [delta]);

        return true;
    },
collideHandler: function(response){
    if(response.b.type==='EnemyBaseEntity'){
        this.attacking=true;
       // this.lastAttacking=this.now;
        this.body.vel.x = 0;
        //krrps moving the creep to the right to maintain its position
        this.pos.x = this.pos.x + 1;
        //checks that it has been atb least 1 second since this creep hit a base
        if((this.now-this.lastHit >= 1000)){
           //updates the lasthit timer
            this.lastHit = this.now;
            //makes the player call its losehealth function and passes it a
            // damage of 1
            response.b.loseHealth(game.data.playerAttack);
        }
    }else if (response.b.type==='EnemyCreep'){
        var xdif = this.pos.x - response.b.pos.x;
        this.attacking=true;
        // this.lastAttacking=this.now;
        this.body.vel.x = 0;
        //keeps moving the creep to the right to maintain its position
        this.pos.x = this.pos.x + 1;
        
        //checks that it has been atb least 1 second since this creep hit a base
        if((this.now-this.lastHit >= 1000 && xdif>0)){
           //updates the lasthit timer
            this.lastHit = this.now;
            //makes the player base call its losehealth function and passes it a
            // damage of 1
            response.b.loseHealth(game.data.playerAttack);
        }
    }
}

});

