// Create our 'main' state that will contain the game
var mainState = {
    preload: function() {
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
		game.load.image('frog', 'assets/frog.png');
        game.load.image('pipe', 'assets/pipe.png');

    },


    create: function() {
         // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.  

		// Change the background color of the game to blue
		game.stage.backgroundColor = '#71c5cf';

		// Set the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Display the frog at the position x=100 and y=245
		this.frog = game.add.sprite(100, 245, 'frog');

		// Add physics to the frog
		// Needed for: movements, gravity, collisions, etc.
		game.physics.arcade.enable(this.frog);

		// Add gravity to the frog to make it fall
		this.frog.body.gravity.y = 1000;  

		// Call the 'jump' function when the spacekey is hit
		var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);     
        
        // Create an empty group
        this.pipes = game.add.group(); 
        
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 
        
        // Display the score in the top left
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", 
            { font: "30px Arial", fill: "#ffffff" });
        
	},
	
	update: function() {
		// This function is called 60 times per second    
        // It contains the game's logic 
		
		// If the frog is out of the screen (too high or too low)
		// Call the 'restartGame' function
		if (this.frog.y < 0 || this.frog.y > 490)
			this.restartGame();
        
        // Restart each time the frog collides with a pipe from the pipes group.
        game.physics.arcade.overlap(
            this.frog, this.pipes, this.restartGame, null, this);
	},
	
	// Make the frog jump 
	jump: function() {
		// Add a vertical velocity to the frog
		this.frog.body.velocity.y = -350;
	},

	// Restart the game
	restartGame: function() {
		// Start the 'main' state, which restarts the game
		game.state.start('main');
        
	},
    
    addOnePipe: function(x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 

        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);   
        // Increase the score by 1 each time new pipes are created.
        this.score += 1;
        this.labelScore.text = this.score;
    },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');