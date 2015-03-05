game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
		//loading level 01 
		me.levelDirector.loadLevel("level01");

		
		me.state.current().resetPlayer(0, 420);

		var gameTimerManager = me.pool.pull("GameTimerManager", 0 , 0, {});
		me.game.world.addChild(gameTimermanager, 0);

		var heroDeathManger = me.pool.pull("HeroDeathManger", 0 , 0, {});
		me.game.world.addChild(heroDeathManger, 0);

        var experienceManger = me.pool.pull("ExperienceManger", 0 , 0, {});
		me.game.world.addChild(experienceManger, 0);

		//when clicking right, character moves right
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.SPACE, "jump");
		me.input.bindKey(me.input.KEY.A, "attack");
		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
		me.audio.playTrack("sugar");
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},

	resetPlayer: function(x, y) {
		//adding the player.
	game.data.player = me.pool.pull("player", x, y, {});
	//adding him into the game/ on the screen
	     me.game.world.addChild(game.data.player, 5);	
	}
});