import { leaderboard } from "../InitGame";

export default class GameOver extends Phaser.Scene {
  _playerText: Phaser.GameObjects.BitmapText;

  private _music: Phaser.Sound.BaseSound;
  private _tile1: Phaser.GameObjects.TileSprite;
  private _tile2: Phaser.GameObjects.TileSprite;
  private _tile3: Phaser.GameObjects.TileSprite;

  private _salvini1: Phaser.GameObjects.Image;
  private _salvini2: Phaser.GameObjects.Image;
  private _floris: Phaser.GameObjects.Image;

  private _container1: Phaser.GameObjects.Container;
  private _container2: Phaser.GameObjects.Container;

  private _text1: Phaser.GameObjects.Text;
  private _text2: Phaser.GameObjects.Text;
  private _text3: Phaser.GameObjects.Text;
  private _score:number=0;
  private _finalscore:number=0;
  private _level:number=0;
  constructor() {
    super({
      key: "GameOver",
    });
  }

  create() {
   // console.log("create gameover");

  this._score=this.registry.get("score");
  this._finalscore=this.registry.get("finalscore");
  this._level= this.registry.get("level");

    this._container2 = this.add.container(300, 330).setAlpha(0);
    this._container2.setSize(300, 302);

    this._container1 = this.add.container(0, 330).setAlpha(0);
    this._container1.setSize(300, 302);

    this._tile1 = this.add
      .tileSprite(0, 0, 300, 158, "lines")
      .setOrigin(0)
      .setScale(2);

    this._tile2 = this.add
      .tileSprite(0, 0, 300, 302, "lines")
      .setOrigin(0)
      .setScale(1)
      .setAlpha(0.5)
      .setTint(0x00ff00, 0x00ff00, 0x00ff00, 0x00ff00);

    this._tile3 = this.add
      .tileSprite(0, -30, 150, 152, "lines")
      .setOrigin(0)
      .setScale(2);

    this._music = this.sound.add("gameover");
    this._music.play(undefined, {
      loop: true,
      volume: 0.2,
    });

    this._salvini1 = this.add.image(300, 180, "salvini-1").setAlpha(0);

    this.tweens.add({
      targets: this._salvini1,
      x: {
        from: 200,
        to: 300,
      },
      alpha: 1,
      delay: 500,
      duration: 500,
      ease: "Sine.easeOut",
    });

    this._floris = this.add.image(0, 0, "floris").setOrigin(0);
    this._salvini2 = this.add.image(0, 0, "salvini-2").setOrigin(0);

    let _config = {
      font: "45px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
      wordWrap: true,
      wordWrapWidth: 1000,
    };

    this.add
      .text(300, 680, "GAME OVER", _config)
      .setStroke("#000000", 10)
      .setAlpha(1)
      .setOrigin(0)
      .setFontFamily('"Press Start 2P"')
      .setDepth(1001)
      .setOrigin(0.5);

    _config = {
      font: "20px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2,
      wordWrap: true,
      wordWrapWidth: 1000,
    };

    this._text1 = this.add
      .text(300, 270, "Ma posso continuare \n la partita? No?", _config)
      .setStroke("#000000", 10)
      .setAlpha(0)
      .setOrigin(0)
      .setFontFamily('"Press Start 2P"')
      .setDepth(1001)
      .setOrigin(0.5);

    this.tweens.add({
      targets: this._text1,
      x: {
        from: 250,
        to: 300,
      },
      alpha: 1,
      delay: 800,
      duration: 500,
      ease: "Sine.easeOut",
    });
    let _text:string;
    let _win:Boolean=this.registry.get("win");
    this.registry.set("win",false);
    if(_win){_text="Se ha finito\nil gioco no!"}else{_text="Se ha finito\nle vite no!"}
    this._text2 = this.add
      .text(150, 250, _text, _config)
      .setStroke("#000000", 10)
      .setOrigin(0)
      .setFontFamily('"Press Start 2P"')
      .setDepth(1001)
      .setOrigin(0.5);

    this._text3 = this.add
      .text(150, 250, "AH, non posso?", _config)
      .setStroke("#000000", 10)
      .setOrigin(0)
      .setFontFamily('"Press Start 2P"')
      .setDepth(1001)
      .setOrigin(0.5);

    this._container1.add([this._tile2, this._floris, this._text2]);
    this._container2.add([this._tile3, this._salvini2, this._text3]);
    this.tweens.add({
      targets: this._container1,
      alpha: 1,
      delay: 1800,
      duration: 500,
    });

    this.tweens.add({
      targets: this._container2,
      alpha: 1,
      delay: 2800,
      duration: 500,
    });

    this.add
      .bitmapText(50, 900, "arcade", "SCORE   YOURNAME")
      .setTint(0xff8200);
    this.add
      .bitmapText(50, 940, "arcade", this._finalscore+"")
      .setTint(0xffffff);

    this._playerText = this.add
      .bitmapText(300, 940, "arcade", "")
      .setTint(0xffffff)
      .setText("");

    //  Do this, otherwise this Scene will steal all keyboard input
    this.input.keyboard.enabled = false;

    this.scene.launch("InputPanel");

    let panel = this.scene.get("ScoreInput");

    panel.events.off("updateName", this.updateName, this);
    panel.events.off("submitName", this.submitName, this);

    panel.events.on("updateName", this.updateName, this);
    panel.events.on("submitName", this.submitName, this);
  }

  startGame(): void {
    this.scene.start("Intro");
  }

  updateName(name: string) {
   // console.log("updatename", name);
    this._playerText.setText(name);
  }
  submitName(name: string) {
    //console.log("submitName", name);
    this.scene.stop("ScoreInput");

    leaderboard.insertScore({
      score: this._finalscore,
      name: name,
      level: this._level,
      date: Date.now()
    });
    
    this.registry.set("score", 0);
    this.registry.set("level", 0);
    this.registry.set("finalscore", 0);

    this._music.stop();
    this.scene.stop("GameOver");
    this.scene.stop("ScoreInput");
    this.scene.start("Intro");
    this.scene.bringToTop("Intro");
  }

  update(time: number, delta: number) {
    this._tile1.tilePositionX += 14;
    this._tile2.tilePositionX += 10;
    this._tile3.tilePositionX += 14;
  }
}
