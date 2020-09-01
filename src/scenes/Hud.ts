import GamePlaySlurp from "./GamePlaySlurp";
import Food from "./Food";

export default class Hud extends Phaser.Scene {
  private _scoreText: Phaser.GameObjects.Text;
  private _score: number=0;
  private _isPaused: boolean = false;
  private _updateScore: Phaser.Events.EventEmitter;
  private _levelPauseContainer: Phaser.GameObjects.Container;
  private _music: Phaser.Sound.BaseSound;
  private _gamePlay: Phaser.Scene;
  private _foods:Array<string>;
  private _foodName:Phaser.GameObjects.Text;
  private _isDisplayingFood:boolean=false;

 

  constructor() {
    super({
      key: "Hud",
    });
  }

  preload() {}

  create() {
    this._isDisplayingFood=false;
    this._foods=[];

    this.game.events.on(Phaser.Core.Events.BLUR, () => {
      this.handleLoseFocus()
    })

    this.game.events.on(Phaser.Core.Events.FOCUS, () => {
      this.handleLoseFocus()
    })
  
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden)
      {
        return
      }
      this.handleLoseFocus()
    })

    this._music = this.sound.add("game");
    this._music.play(undefined, {
      loop: true,
      volume: 0.1,
    });

    this._gamePlay = <Phaser.Scene>this.scene.get("GamePlaySlurp");

    this._gamePlay.events.off("updateScore", this.updateScore, this);
    this._updateScore = this._gamePlay.events.on(
      "updateScore",
      this.updateScore,
      this
    );

    this._gamePlay.events.off("gameover", this.gameOver, this);
    this._gamePlay.events.on("gameover", this.gameOver, this);

    this._gamePlay.events.off("incomingBoss", this.incomingBoss, this);
    this._gamePlay.events.on("incomingBoss", this.incomingBoss, this);

    this._gamePlay.events.off("boss-dead", this.restartMusic, this);
    this._gamePlay.events.on("boss-dead", this.restartMusic, this);

    this._isPaused = false;
    this._score = 0;


    this._scoreText = this.add.text(20, 20, "0", {
      font: "30px",
      fill: "#ffffff",
      stroke: "#ff7f00",
      strokeThickness: 6,
      wordWrap: true,
      wordWrapWidth: 1000,
    }).setFontFamily('"Press Start 2P"').setOrigin(0);

    this._foodName = this.add.text(580, 20, "", {
      font: "30px",
      fill: "#718400",
      stroke: "#ffffff",
      strokeThickness: 6,
      wordWrap: true,
      wordWrapWidth: 1000,
    }).setFontFamily('"Press Start 2P"').setOrigin(1,0);

    this._levelPauseContainer = this.add.container(0, 0).setDepth(100001);
    this._levelPauseContainer
      .add([
        this.add.image(0, 0, "black-screen").setAlpha(0.7).setOrigin(0),
        this.add
          .text(300, 512, "PAUSED")
          .setTint(0xffffff)
          .setOrigin(.5)
          .setAlpha(1)
          .setFontSize(30).setFontFamily('"Press Start 2P"')
      ])
      .setAlpha(0);

    this.input.keyboard.on("keydown-P", (event: Event) => {
      if (this._isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    });
  }

  update() {}

  setScore(score: number) {
    this._score += score;
    this._scoreText.setText(this._score + "");
  }

  private updateScore(parameters: Array<any>): void {
    //console.log(parameters[0])
    this.setScore(parameters[0])
    
    if(parameters[1]!="")this._foods.push(parameters[1]);
    this.displayFood();
    this.registry.set("score", this._score);
  }

  private displayFood(): void {

    if(this._isDisplayingFood) return;
    this._isDisplayingFood=true;
    this._foodName.setAlpha(0)

  this._foodName.setText(this._foods[0]);

  this.tweens.add({targets:this._foodName,alpha:1,yoyo:true,duration:500,onComplete:()=>{
    this._foods.splice(0,1);
    this._isDisplayingFood=false;
    if(this._foods.length>0) this.displayFood();
  }})

 



  }

  private pauseGame() {
    this._levelPauseContainer.setAlpha(1);
  
    this._music.pause();
    this.game.scene.pause("GamePlaySlurp");
    this._isPaused = true;
  }
  private resumeGame() {
    this._levelPauseContainer.setAlpha(0);
    this.game.scene.resume("GamePlaySlurp");
    this._music.resume();
   
    this._isPaused = false;
  }

  handleLoseFocus(){

    if( this.game.scene.isActive("Hud")){

      if( this.game.scene.isActive("GamePlaySlurp")){
        this.pauseGame();
      }else{
        this.resumeGame();
      }
    }

  
   
  }

  private incomingBoss(){
    this._music.stop()
    this._music = this.sound.add("alarm");
    this._music.play(undefined, {
      loop: false,
      volume: 0.1,
    });

    this._music.once('complete', ()=>{
      console.log("complete")
      this._music.stop();
      this._music = this.sound.add("boss-music");
      this._music.play(undefined, {
        loop: true,
        volume: 0.1,
      });

    });
  }

  restartMusic(){
    console.log("restartMusic")
    this._music.stop()
    this._music = this.sound.add("game");
    this._music.play(undefined, {
      loop: true,
      volume: 0.1,
    });
  }

 

  private gameOver() {
    this._music.stop();
    this.scene.stop("Hud");
    this.scene.stop("GamePlaySlurp");
    if (this.sys.game.device.input.touch) {
      this.scene.stop("Joy");
    }
    this.scene.start("GameOver");
    this.scene.start("ScoreInput");
    this.scene.bringToTop("GameOver");
    this.scene.bringToTop("ScoreInput");
  }
}
