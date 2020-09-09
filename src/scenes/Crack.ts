

export default class Crack extends Phaser.Scene {
  private raster2: Phaser.GameObjects.TileSprite;
  private scroller: Phaser.GameObjects.DynamicBitmapText;
  private _music: Phaser.Sound.BaseSound;
  private s: any;
  constructor() {
    super({
      key: "Crack",
    });
  }

  preload() {
  
  }

  create() {

    this._music = this.sound.add("fairlight");
    this._music.play(undefined, {
      loop: true,
      volume: 0.1,
    });

    let config:any = {
      image: "scrollFont",
      width: 8,
      height: 8,
      chars:
        " ABCDEFGHIJKLMNOPQRSTUVWXYZ!         %&'()*+,-./0123456789:     ",
      charsPerRow: 32,
      spacing: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    };

    this.cache.bitmapFont.add(
      "scrollFont",
      Phaser.GameObjects.RetroFont.Parse(this, config)
    );
    //this.template = new template(this);
    this.s = { y: -8 };
   
    this.add
      .image(320, 200, "fairlight-logo")
      .setDepth(100)
      .setScale(1);
     
    let _raster = this.add
      .image(300, 80, "fairlight-raster")
      .setDepth(101)
      .setScale(2);
    this.tweens.add({
      targets: _raster,
      y: {
        value: 360,
        duration: 2000,
        ease: "Quad.easeInOut",
        repeat: -1,
        yoyo: -1
      },
      onStart: function() {},
      onComplete: function() {},
      onYoyo: function() {
        _raster.setDepth(99);
      },
      onRepeat: function() {
        _raster.setDepth(101);
      }
    });

    this.add
      .dynamicBitmapText(
        0,
        275,
        "scrollFont",
        "     THE HOME OF THE REAL CRACKERS  "
      )
      .setScale(2)
      .setDepth(100);

    this.add
      .dynamicBitmapText(0, 410, "scrollFont", "               PRESENTS")
      .setScale(2)
      .setDepth(100);

    this.add
      .dynamicBitmapText(
        0,
        680,
        "scrollFont",
        "  -- SWEDISH QUALITY AT IT'S BEST --"
      )
      .setScale(2)
      .setDepth(100);

    this.raster2 = this.add
      .tileSprite(0, 480, 600, 48, "fairlight-raster2")
      .setOrigin(0);

    this.add
      .bitmapText(0, 490, "commodore", "  Captain Food 2+", 32) //"                                    "
      .setOrigin(0)
      .setDepth(100)
      .setTint(0x000000);

    this.scroller = this.add.dynamicBitmapText(
      0,
      550,
      "scrollFont",
      "                                  FAIRLIGHT IS PROUD TO PRESENT A NEW RELEASE: CAPTAIN FOOD 2+       CRACKED BY WOODOO ON 07/09/2020... ENJOY!"
    );

    this.scroller.setScale(2);
    /* this.scroller.setDisplayCallback(data => {
      //data.y += 8 + this.s.y * Math.sin(data.index);
      data.y += 8 + this.s.y + Math.sin(this.s.y);

      return data;
    });*/

    this.tweens.add({
      targets: this.scroller,
      duration: 1000,
      y: 600,
      repeat: -1,
      ease: "Quad.easeIn",
      yoyo: true
    });


    this.add
      .bitmapText(0, 800, "commodore", "      Trainer? ", 32)
      .setOrigin(0)
      .setDepth(100)
      .setTint(0xffffff);

      const _yes= this.add
      .bitmapText(100, 900, "commodore", "YES", 32)
      .setOrigin(0)
      .setDepth(100)
      .setTint(0xffffff).setInteractive()
      .on("pointerup", () => {
      this._music.stop();
      this.scene.start("Intro");
      this.registry.set("trainer", true);
      });


      const _no= this.add
      .bitmapText(450, 900, "commodore", "NO", 32)
      .setOrigin(0)
      .setDepth(100)
      .setTint(0xffffff).setInteractive()
      .on("pointerup", () => {
      this._music.stop();
      this.scene.start("Intro");
      this.registry.set("trainer", false);
      });


  }

  update(time:number, delta:number): void {
    //this.template.update();
    this.raster2.tilePositionY += 0.45;

    this.scroller.scrollX += 0.05 * delta;

    if (this.scroller.scrollX > 1200) {
      this.scroller.scrollX = 0;
    }
  }


}