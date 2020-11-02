import { leaderboard } from "../InitGame";
import { GameData } from "../GameData";
import GamePlaySlurp from "./GamePlaySlurp";
import Player from "./Player";

export default class Intro extends Phaser.Scene {
  private _Game: GamePlaySlurp;
  private _logo: Phaser.GameObjects.Image;
  private _play: Phaser.GameObjects.Text;
  private _captain: Phaser.GameObjects.Image;
  private _f: Phaser.GameObjects.Text;
  private _d: Phaser.GameObjects.Text;
  private _howtoplayText: Phaser.GameObjects.BitmapText;
  private _howtoplayContainer: Phaser.GameObjects.Container;
  private _creditsText: Phaser.GameObjects.BitmapText;
  private _creditsContainer: Phaser.GameObjects.Container;
  private _player: Player;
  private _foodGroup: Phaser.GameObjects.Group;
  private _foodTween: Phaser.Tweens.Tween;
  private _highscores: Array<any>;
  private _highscoresText: Array<Phaser.GameObjects.BitmapText>;
  private _sky1: Phaser.GameObjects.TileSprite;
  private _sky2: Phaser.GameObjects.TileSprite;
  private _sky3: Phaser.GameObjects.TileSprite;
  private _sky4: Phaser.GameObjects.TileSprite;
  private _music: Phaser.Sound.BaseSound;
  private _status: number;
  private _highscoresColors: Array<number> = [
    0xff0000,
    0xffff00,
    0x15880c,
    0x0c69bf,
    0xff8200,
  ];

  private _bossFaces: Array<Phaser.GameObjects.Sprite> = [];
  private _bossCaps: Array<Phaser.GameObjects.Sprite> = [];
  private _bossDecorations: Array<Phaser.GameObjects.Sprite> = [];
  private _bossTexts: Array<Phaser.GameObjects.Text> = [];
  private _bossContainer: Phaser.GameObjects.Container;
  private _bestLevel: number = 0;

  constructor() {
    super({
      key: "Intro",
    });
  }

  preload() {
    /* this.load.scenePlugin(
      "rexgesturesplugin",
      "assets/js/rexgestures.js",
      "rexGestures",
      "rexGestures"
    );*/
  }

  create() {
    this._bossFaces = [];
    this._bossCaps = [];
    this._bossDecorations = [];
    this._bossTexts = [];

    this._bestLevel = this.registry.get("bestlevel");

    this.cameras.main.setBackgroundColor("#6fd1ec");

    this.input.keyboard.on("keydown-O", (event: Event) => {
      this.game.renderer.snapshot((image: any) => {
        let mimeType = "image/png";
        var imgURL = image.src;
        var dlLink = document.createElement("a");
        dlLink.download = "snapshot";
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [
          mimeType,
          dlLink.download,
          dlLink.href,
        ].join(":");
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
      });
    });

    let _config = {
      font: "20px",
      fill: "#4ab7d8",
      stroke: "#ffffff",
      strokeThickness: 6,
      wordWrap: true,
      wordWrapWidth: 1000,
    };

    this._howtoplayText = this.add
      .bitmapText(20, 980, "arcade", "Come si gioca??", 20)
      .setAlpha(1)
      .setOrigin(0)
      .setInteractive()
      .on("pointerup", () => {
        this.openHowToPlay();
      });

    this._howtoplayContainer = this.add.container(0, 0);

    this._howtoplayContainer
      .add([
        this.add.image(0, 0, "black-screen").setAlpha(0.9).setOrigin(0),
        this.add.image(0, 0, "how-to").setOrigin(0),
        this.add
          .text(300, 30, "Come si gioca?")
          .setTint(0xffffff)
          .setOrigin(0.5)
          .setAlpha(1)
          .setFontSize(30)
          .setFontFamily('"Press Start 2P"'),
      ])
      .setAlpha(0)
      .setDepth(100001)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 600, 1024),
        Phaser.Geom.Rectangle.Contains
      )
      .on("pointerup", () => {
        this.closeHowToPlay();
      });

    this._creditsText = this.add
      .bitmapText(580, 980, "arcade", "Crediti", 20)
      .setAlpha(1)
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerup", () => {
        this.openCredits();
      });

    this._creditsContainer = this.add.container(0, 0);

    let _button = this.add
      .image(300, 610, "button")
      .setInteractive()
      .on("pointerdown", () => {
        window.open("https://sh4rko.itch.io/", "_blank");
      });

    this._creditsContainer
      .add([
        this.add.image(0, 0, "black-screen").setAlpha(0.9).setOrigin(0),

        _button,
        this.add.image(0, 0, "credits").setOrigin(0),

        this.add
          .text(300, 30, "Crediti")
          .setTint(0xffffff)
          .setOrigin(0.5)
          .setAlpha(1)
          .setFontSize(30)
          .setFontFamily('"Press Start 2P"'),
      ])
      .setAlpha(0)
      .setDepth(100001)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 600, 1024),
        Phaser.Geom.Rectangle.Contains
      )
      .on("pointerup", () => {
        this.closeCredits();
      });

    this._sky1 = this.add
      .tileSprite(0, 0, 320, 173, "sky-1")
      .setScale(2)
      .setOrigin(0);
    this._sky2 = this.add
      .tileSprite(0, 346, 320, 48, "sky-2")
      .setScale(2)
      .setOrigin(0)
      .setAlpha(1);
    this._sky3 = this.add
      .tileSprite(0, 346 + 48 * 2, 320, 80, "sky-3")
      .setScale(2)
      .setOrigin(0)
      .setAlpha(1);
    this._sky4 = this.add
      .tileSprite(0, 346 + 48 * 2 + 80 * 2, 320, 171, "sky-4")
      .setScale(2)
      .setOrigin(0)
      .setAlpha(1);
    //console.log("create intro");

    this._music = this.sound.add("intro");
    this._music.play(undefined, {
      loop: true,
      volume: 0.1,
    });

    this._highscores = [];
    if (leaderboard != undefined)
      this._highscores = leaderboard.getHighscores();
    this._status = 0;
    this._highscoresText = [];
    this._highscoresText.push(
      this.add
        .bitmapText(300, 450, "arcade", "Top Capitons")
        .setAlpha(0)
        .setOrigin(0.5)
        .setTint(0xffffff)
    );

    if (this._highscores.length > 0) {
      for (let i = 0; i < 5; i++) {
        this._highscoresText.push(
          this.add
            .bitmapText(
              30,
              500 + i * 70,
              "arcade",
              i +
                1 +
                "ND " +
                this.fixNames(this._highscores[i].name) +
                " " +
                this._highscores[i].score +
                " LVL" +
                this._highscores[i].level
            )
            .setTint(this._highscoresColors[i])
            .setOrigin(0)
            .setAlpha(0)
            .setFontSize(24)
        );
      }
    }

    //this.add.image(0, 0, "bg").setOrigin(0);

    this._logo = this.add
      .image(this.game.canvas.width / 2 - 80, 100, "cherry")
      .setOrigin(0.5)
      .setAlpha(0);

    this._captain = this.add
      .image(this.game.canvas.width / 2 - 80, 150, "captain")
      .setOrigin(0.5)
      .setAlpha(1);

    _config = {
      font: "40px",
      fill: "#ff8200",
      stroke: "#ffffff",
      strokeThickness: 8,
      wordWrap: true,
      wordWrapWidth: 1000,
    };
    this._play = this.add
      .text(300, 600, "GIOCA", _config)
      .setAlpha(1)
      .setOrigin(0.5)
      .setFontFamily('"Press Start 2P"')
      .setInteractive()
      .on("pointerup", () => {
        this._music.stop();
        this.scene.stop("Intro");

        this.scene.start("GamePlaySlurp");
        this.scene.bringToTop("GamePlaySlurp");
        this.scene.start("Hud");
        this.scene.bringToTop("Hud");
        if (this.sys.game.device.input.touch) {
          this.scene.start("Joy");
          this.scene.bringToTop("Joy");
        }
      });

    _config = {
      font: "80px",
      fill: "#b72025",
      stroke: "#ffffff",
      strokeThickness: 10,
      wordWrap: true,
      wordWrapWidth: 1000,
    };

    this._f = this.add
      .text(180 - 80, 244, "F", _config)
      .setAlpha(1)
      .setOrigin(0.5)
      .setFontFamily('"Press Start 2P"');

    this._d = this.add
      .text(440 - 80, 244, "D", _config)
      .setAlpha(1)
      .setOrigin(0.5)
      .setFontFamily('"Press Start 2P"');

    this.introIn();

    //@ts-ignore
    /* this._swipeInput = this.rexGestures.add
      .swipe({ velocityThreshold: 1000, dir: 1 })
      .on("swipe", (swipe: any) => {}, this);
      */

    this._player = new Player({ scene: this, x: 490, y: 150 });
    this._player.setAlpha(0);

    this.add.tween({
      targets: this._player,
      y: 210,
      alpha: 1,
      delay: 1000,
      duration: 500,
      onComplete: () => {
        let _frutti: Phaser.Sound.BaseSound = this.sound.add("frutti");
        _frutti.play(undefined, {
          loop: false,
          volume: 0.5,
        });

        this.add.tween({
          targets: this._player,
          y: this._player.y + 20,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      },
    });

    var circle = new Phaser.Geom.Circle(300, 600, 250);

    this._foodGroup = this.add.group();

    for (var i = 0; i < 16; i++) {
      this._foodGroup.add(
        this.add
          .sprite(0, 0, "food")
          .setFrame(Phaser.Math.RND.integerInRange(0, 63))
          .setScale(4)
          .setDepth(i)
      );
    }

    Phaser.Actions.PlaceOnCircle(this._foodGroup.getChildren(), circle);

    this._foodTween = this.tweens.addCounter({
      from: 250,
      to: 175,
      duration: 3000,
      delay: 2000,
      ease: "Sine.easeInOut",
      repeat: -1,
      yoyo: true,
    });

    this._bossContainer = this.add.container(0, 0).setAlpha(0);

    //zingarelli
    const _sprite1face: Phaser.GameObjects.Sprite = this.add
      .sprite(90, 450, "faces")
      .setFrame(0)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite1face);
    const _sprite1cap: Phaser.GameObjects.Sprite = this.add
      .sprite(90 + 10, 450 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite1cap);
    const _sprite1decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(90 + 10, 450 - 45, "food")
      .setFrame(61)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite1decoration);
    const _sprite1text: Phaser.GameObjects.Text = this.add
      .text(10 + 80, 450 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite1text);

    //dimiao
    const _sprite2face: Phaser.GameObjects.Sprite = this.add
      .sprite(300, 450, "faces")
      .setFrame(2)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite2face);
    const _sprite2cap: Phaser.GameObjects.Sprite = this.add
      .sprite(300 + 10, 450 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite2cap);
    const _sprite2decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(300 + 10, 450 - 45, "food")
      .setFrame(3)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite2decoration);
    const _sprite2text: Phaser.GameObjects.Text = this.add
      .text(220 + 80, 450 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite2text);

    //astrolina
    const _sprite3face: Phaser.GameObjects.Sprite = this.add
      .sprite(500, 450, "faces")
      .setFrame(4)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite3face);
    const _sprite3cap: Phaser.GameObjects.Sprite = this.add
      .sprite(500 + 8, 450 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite3cap);
    const _sprite3decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(500 + 10, 450 - 45, "food")
      .setFrame(67)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite3decoration);
    const _sprite3text: Phaser.GameObjects.Text = this.add
      .text(420 + 80, 450 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite3text);

    //frignero
    const _sprite4face: Phaser.GameObjects.Sprite = this.add
      .sprite(90, 650, "faces")
      .setFrame(6)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite4face);
    const _sprite4cap: Phaser.GameObjects.Sprite = this.add
      .sprite(90 + 6, 650 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite4cap);
    const _sprite4decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(90, 650 - 45, "food")
      .setFrame(69)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite4decoration);
    const _sprite4text: Phaser.GameObjects.Text = this.add
      .text(10 + 80, 650 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite4text);

    //bossanova
    const _sprite5face: Phaser.GameObjects.Sprite = this.add
      .sprite(300, 650, "faces")
      .setFrame(8)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite5face);
    const _sprite5cap: Phaser.GameObjects.Sprite = this.add
      .sprite(300 + 8, 650 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite5cap);
    const _sprite5decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(300 + 5, 650 - 45, "food")
      .setFrame(48)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite5decoration);
    const _sprite5text: Phaser.GameObjects.Text = this.add
      .text(220 + 80, 650 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite5text);

    //renzie
    const _sprite6face: Phaser.GameObjects.Sprite = this.add
      .sprite(500, 650, "faces")
      .setFrame(10)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite6face);
    const _sprite6cap: Phaser.GameObjects.Sprite = this.add
      .sprite(500 + 8, 650 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite6cap);
    const _sprite6decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(500 + 5, 650 - 45, "food")
      .setFrame(28)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite6decoration);
    const _sprite6text: Phaser.GameObjects.Text = this.add
      .text(420 + 80, 650 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite6text);

    //loshi
    const _sprite7face: Phaser.GameObjects.Sprite = this.add
      .sprite(90, 850, "faces")
      .setFrame(12)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite7face);
    const _sprite7cap: Phaser.GameObjects.Sprite = this.add
      .sprite(90 + 6, 850 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite7cap);
    const _sprite7decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(90, 850 - 45, "food")
      .setFrame(23)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite7decoration);
    const _sprite7text: Phaser.GameObjects.Text = this.add
      .text(10 + 80, 850 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite7text);

    //giuseppi
    const _sprite8face: Phaser.GameObjects.Sprite = this.add
      .sprite(300, 850, "faces")
      .setFrame(14)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite8face);
    const _sprite8cap: Phaser.GameObjects.Sprite = this.add
      .sprite(300 + 8, 850 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite8cap);
    const _sprite8decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(300 + 3, 850 - 45, "food")
      .setFrame(72)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite8decoration);
    const _sprite8text: Phaser.GameObjects.Text = this.add
      .text(220 + 80, 850 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite8text);

    //vicienzo
    const _sprite9face: Phaser.GameObjects.Sprite = this.add
      .sprite(500, 850, "faces")
      .setFrame(16)
      .setScale(2)
      .setTintFill(0x000000);
    this._bossFaces.push(_sprite9face);
    const _sprite9cap: Phaser.GameObjects.Sprite = this.add
      .sprite(500 + 8, 850 - 45, "cap-generic")
      .setScale(0.5)
      .setFrame(0)
      .setTintFill(0x000000);
    this._bossCaps.push(_sprite9cap);
    const _sprite9decoration: Phaser.GameObjects.Sprite = this.add
      .sprite(500 + 5, 850 - 45, "food")
      .setFrame(71)
      .setScale(1)
      .setTintFill(0x000000);
    this._bossDecorations.push(_sprite9decoration);
    const _sprite9text: Phaser.GameObjects.Text = this.add
      .text(420 + 80, 850 + 50, "???", {})
      .setFontFamily('"Press Start 2P"')
      .setOrigin(0.5);
    this._bossTexts.push(_sprite9text);

    const _names: Array<string> = [
      "Zingarelli",
      "Di Miao",
      "Astrolina",
      "Frignero",
      "Bossanova",
      "Renzie",
      "Loschi",
      "Giuseppi",
      "Vicienzo",
    ];
    const _tints: Array<number> = [
      0xff0000,
      0x059cc7,
      0xff00ff,
      0x00ff00,
      0xffff00,
      0x664488,
      0xf68cf2,
      0xffffff,
      0x7a420b,
    ];

    //let _bestLevel=this.registry.get("bestlevel");

    for (let i = 0; i < 9; i++) {
      if (this._bestLevel > i + 1) {
        this._bossContainer.add(this._bossFaces[i].clearTint());
        this._bossContainer.add(
          this._bossCaps[i].clearTint().setTint(_tints[i])
        );
        this._bossContainer.add(this._bossDecorations[i].clearTint());
        this._bossContainer.add(this._bossTexts[i].setText(_names[i]));
      } else {
        this._bossContainer.add(this._bossFaces[i]);
        this._bossContainer.add(this._bossCaps[i]);
        this._bossContainer.add(this._bossDecorations[i]);
        this._bossContainer.add(this._bossTexts[i]);
      }
    }

    this.startChange();
  }

  openHowToPlay(): void {
    this._howtoplayContainer.setAlpha(1);
  }
  closeHowToPlay(): void {
    this._howtoplayContainer.setAlpha(0);
  }

  openCredits(): void {
    this._creditsContainer.setAlpha(1);
  }
  closeCredits(): void {
    this._creditsContainer.setAlpha(0);
  }

  fixNames(_name: string) {
    if ((_name + "").length == 1) return _name + "         ";
    if ((_name + "").length == 2) return _name + "        ";
    if ((_name + "").length == 3) return _name + "       ";
    if ((_name + "").length == 4) return _name + "      ";
    if ((_name + "").length == 5) return _name + "     ";
    if ((_name + "").length == 6) return _name + "    ";
    if ((_name + "").length == 7) return _name + "   ";
    if ((_name + "").length == 8) return _name + "  ";
    if ((_name + "").length == 9) return _name + " ";
    if ((_name + "").length == 10) return _name + "";
  }

  startChange() {
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        if (this._status == 3) this._status = 0;
        switch (this._status) {
          case 0:
            this.introAnimOut();
            this._status += 1;
            break;
          case 1:
            this.highscoresOut();
            this._status += 1;
            break;
          case 2:
            this.bossOut();
            this._status += 1;
            break;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  introAnimIn() {
    this.tweens.add({ targets: [this._play, this._foodGroup], alpha: 1 });
    this.tweens.add({
      targets: this._foodGroup.getChildren(),
      alpha: 1,
      onComplete: () => {},
    });
  }
  introAnimOut() {
    this.tweens.add({
      targets: [this._play, this._foodGroup],
      alpha: 0,
      onComplete: () => {
        this.highscoresIn();
      },
    });

    this.tweens.add({ targets: this._foodGroup.getChildren(), alpha: 0 });
  }

  highscoresIn() {
    this.tweens.add({
      targets: this._highscoresText,
      duration: 500,
      alpha: 1,

      delay: (
        target: any,
        targetKey: any,
        value: any,
        targetIndex: any,
        totalTargets: any,
        tween: any
      ) => {
        return targetIndex * 100;
      },
    });
  }

  highscoresOut() {
    this.tweens.add({
      targets: this._highscoresText,
      duration: 500,
      alpha: 0,

      onComplete: () => {
        this.bossIn();
      },
    });
  }

  bossIn() {
    this.tweens.add({
      targets: this._bossContainer,
      duration: 500,
      alpha: 1,
    });
  }

  bossOut() {
    this.tweens.add({
      targets: this._bossContainer,
      duration: 500,
      alpha: 0,

      onComplete: () => {
        this.introAnimIn();
      },
    });
  }

  introIn() {
    this.tweens.add({
      targets: this._logo,
      alpha: 1,
      y: 180,
      ease: "Sine.easeOut",
      delay: 200,
    });
  }

  introOut() {
    this.tweens.add({
      targets: this._logo,
      alpha: 0,
      y: 0,
      ease: "Sine.easeOut",
    });

    this._play.setY(-20);
  }

  update(time: number, delta: number) {
    //console.log("update", this._foodGroup);
    if (this._foodGroup != undefined && this._foodGroup.children != undefined) {
      Phaser.Actions.RotateAroundDistance(
        this._foodGroup.getChildren(),
        { x: 300, y: 600 },
        0.02,
        this._foodTween.getValue()
      );
    }
    this._sky4.tilePositionX += 0.5;
    this._sky3.tilePositionX += 0.25;
    this._sky2.tilePositionX += 0.1;
    this._sky1.tilePositionX += 0.05;
  }
}

/*
 var eases = [
   "Linear",
   "Quad.easeIn",
   "Cubic.easeIn",
   "Quart.easeIn",
   "Quint.easeIn",
   "Sine.easeIn",
   "Expo.easeIn",
   "Circ.easeIn",
   "Back.easeIn",
   "Bounce.easeIn",
   "Quad.easeOut",
   "Cubic.easeOut",
   "Quart.easeOut",
   "Quint.easeOut",
   "Sine.easeOut",
   "Expo.easeOut",
   "Circ.easeOut",
   "Back.easeOut",
   "Bounce.easeOut",
   "Quad.easeInOut",
   "Cubic.easeInOut",
   "Quart.easeInOut",
   "Quint.easeInOut",
   "Sine.easeInOut",
   "Expo.easeInOut",
   "Circ.easeInOut",
   "Back.easeInOut",
   "Bounce.easeInOut"
 ];
 */
