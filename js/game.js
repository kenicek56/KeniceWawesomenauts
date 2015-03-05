/* Game namspace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0,
		EnemyBaseHealth: 10,
		PlayerBaseHealth: 10,
		EnemyCreepHealth: 10,
		playerHealth: 10,
		EnemyCreepAttack: 1,
		playerAttack: 1,
		//24
		//orcBaseDamage:10,
		//orcBaseHealth:100,
		//orcBaseDefense: 0,
		playerAttackTimer: 300,
		creepAttackTimer: 300,
		playerMoveSpeed: 5,
		creepMoveSpeed: 5,
		gameManager: "",
		heroDeathManger: "",
		player: "",
		exp: 0,
		gold: 0,
		exp1: 0,
		exp2: 0,
		exp3: 0,
		exp4: 0,
		win: ""
	},
	
	// hi
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	//sizes my level
	if (!me.video.init("screen",  me.video.CANVAS, 1067, 600, true, '1.0')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(this, debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);
},

	// Run on game resources loaded.
	"loaded" : function () {
		// places my players and bases on the screen.
            me.pool.register("player", game.PlayerEntity, true);
            me.pool.register("PlayerBase", game.PlayerBaseEntity);
            me.pool.register("EnemyBase", game.EnemyBaseEntity);
            me.pool.register("EnemyCreep", game.EnemyCreep, true);
		    me.pool.register("GameManager", game.GameTimerManager);
		    me.pool.register("HeroDeathManger", game.HeroDeathManger);
		

		    me.state.set(me.state.MENU, new game.TitleScreen());
		    me.state.set(me.state.PLAY, new game.PlayScreen());

		// Start the game.
		me.state.change(me.state.MENU);
	}
};
