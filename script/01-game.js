class Game { //Todo: Make all fields private
	#config;
	#sound;
	#mouse;
	#grid;
	#button;

	constructor(znakeConf) {
		let me = this;
		this.#importConfig(znakeConf);
		this.#mouse = new Mouse(this);
		this.#grid = new Grid(this, document.getElementById('grid-container'), this.#config.grid);
		this.infoboard = new Infoboard('stats', [infoboardKeysEnum.Score], [infoboardKeysEnum.Age, 0]);
		this.control = new Control(this, this.#config.keys);
		this.overlay = new Overlay(this, this.#config.devMode);
		this.feeder = new Feeder(this, this.#grid, this.#config.numberOfFoodCellsAtOnce);
		this.#button = new Button(document.getElementById('button'), () => me.#start(), () => me.#restart());
	}

	#importConfig(znakeConf) {
		this.#config = {}
		for (let key in znakeConf)
			this.#config[key] = znakeConf[key];
		if (this.#config["grid.height"] < 4)
			throw "Grid height must be at least 4"
		if (this.#config["grid.width"] < 4)
			throw "Grid width must be at least 4"
	}

	onSplashClicked() {
		this.#initialiseSound();
		let me = this;
		Crosshairs(() => me.#sound.mouseInBeep(), () => me.#sound.mouseOutBeep());
		this.worm = new Worm(this, this.#grid, this.#config.startAtCentre, this.#config.stepTime);
		this.control.attach(function (dir) { me.worm.input(dir) });
		this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	}

	#initialiseSound() {
		if (isUndefined(this.#sound) || isUndefined(this.#sound.audioCtx)) {
			this.#sound = new znakeSound(this.#config.soundVolume);
		}
	}

	#start() {
		this.#button.beRestart();
		this.#run();
		this.control.enable();
		this.feeder.dropFoodInitial();
	}

	#restart() {
		if (this.isPaused) {
			this.overlay.popDown();
			this.isPaused = false;
		} else {
			this.stopRunning();
		}
		this.worm.disappear();
		this.worm = new Worm(this, this.#grid, this.#config.startAtCentre, this.#config.stepTime);
		let me = this;
		this.control.attach(function (dir) { me.worm.input(dir) });
		this.control.enable();
		this.worm.run();
		this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	}

	#run() {
		this.worm.run();
	}

	stopRunning() {
		this.worm.stop();
	}

	togglePause() {
		if (this.isPaused) {
			this.#run();
			this.isPaused = false;
			this.overlay.popDown();
		}
		else {
			this.stopRunning();
			this.isPaused = true;
			this.overlay.popUp();
		}
	}

	onWormBorn(replacedFoodCell = false) {
		if (replacedFoodCell)
			this.feeder.dropFood();
	}

	onStepTaken(age) {
		this.infoboard.set(infoboardKeysEnum.Age, age);
	}

	onWormDied() {
		this.stopRunning();
		this.control.disable();
	}

	onFoodEaten(foodCell) {
		this.#sound.foodBeep();
		this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
		this.worm.speedUp();
		this.feeder.dropFood();
	}
}
