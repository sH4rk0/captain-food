/**
 * @author       Francesco Raimondo <francesco.raimondo@gmail.com>
 * @copyright    2019 zero89
 * @description  Run4Mayor
 * @license      zero89
 */
import { leaderboard } from "../InitGame";
import { GameData } from "../GameData";

export default class Preloader extends Phaser.Scene {
  body: HTMLElement;
  loading: Phaser.GameObjects.Text;
  text: Phaser.GameObjects.Text;
  progress: Phaser.GameObjects.Graphics;
  _bg: Phaser.GameObjects.TileSprite;
  _leaderboardIsActive: boolean;

  constructor() {
    super({
      key: "Preloader",
    });
  }

  preload() {
    //this.cameras.main.setBackgroundColor('#f0e200')
     this.cameras.main.setBackgroundColor('#000000')
    this.progress = this.add.graphics();
    this.loadAssets();
  }

  update(time: number, delta: number) {}

  init() {
    this._leaderboardIsActive=false;
    this.add.image(300, 250, "thelucasart").setScale(0.75);

    this.add.image(300, 800, "coldiretti").setScale(1);

    const _config = {
      font: "30px",
      fill: "#000000",
      stroke: "#f0e200",
      strokeThickness:10,
      wordWrap: true,
      wordWrapWidth: 1000,
    };

    this.loading = this.add
      .text(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
        "",
        _config
      )
      .setAlpha(1)
      .setFontFamily('"Press Start 2P"')
      .setDepth(1001)
      .setOrigin(0.5);
  }


 checkLeaderboard(){


  if (leaderboard != undefined && leaderboard.getHighscores().length>0 && !this._leaderboardIsActive){

    this._leaderboardIsActive=true;
    this.tweens.add({
      targets: [this.text],
      alpha: 1,
      x: 20,
      duration: 250,
      ease: "Sine.easeOut",
      delay: 200,
    });

    this.loading.setText("Tap/click to start");
    this.progress.clear();

    this.input.once("pointerdown", () => {
      this.scene.start("Intro");
      this.registry.set("bestlevel",0);
/*
      this.scene.start("GameOver");
      this.scene.start("ScoreInput");
      this.scene.bringToTop("GameOver");
      this.scene.bringToTop("ScoreInput");
  */    
    });
  }

  


 }


  loadAssets(): void {
    this.load.on("start", () => {});

    this.load.on("fileprogress", (file: any, value: any) => {
      //console.log(file, value)
    });

    this.load.on("progress", (value: any) => {
      this.progress.clear();
      this.progress.fillStyle(0xf0e200, 1);
      this.progress.fillRect(0, 480, 600 * value, 70);
      this.loading.setText("Loading..." + Math.round(value * 100) + "%");
    });

    this.load.on("complete", () => {


      this.time.addEvent({delay:500,callback:this.checkLeaderboard,callbackScope:this,repeat:-1})

     


    });

    //Assets Load
    //--------------------------

    //SCRIPT
    GameData.script.forEach((element: ScriptAsset) => {
      this.load.script(element.key, element.path);
      //@ts-ignore
    });

    // IMAGES
    GameData.images.forEach((element: ImageAsset) => {
      this.load.image(element.name, element.path);
    });

    // TILEMAPS
    GameData.tilemaps.forEach((element: TileMapsAsset) => {
      this.load.tilemapTiledJSON(element.key, element.path);
    });

    // ATLAS
    GameData.atlas.forEach((element: AtlasAsset) => {
      this.load.atlas(element.key, element.imagepath, element.jsonpath);
    });

    // SPRITESHEETS
    GameData.spritesheets.forEach((element: SpritesheetsAsset) => {
      this.load.spritesheet(element.name, element.path, {
        frameWidth: element.width,
        frameHeight: element.height,
        endFrame: element.frames,
      });
    });

    //bitmap fonts
    GameData.bitmapfont.forEach((element: BitmapfontAsset) => {
      this.load.bitmapFont(element.name, element.imgpath, element.xmlpath);
    });

    // SOUNDS
    GameData.sounds.forEach((element: SoundAsset) => {
      this.load.audio(element.name, element.paths);
    });

    // Audio
    GameData.audio.forEach((element: AudioSpriteAsset) => {
      this.load.audioSprite(
        element.name,
        element.jsonpath,
        element.paths,
        element.instance
      );
    });
  }
}
