export default class Joy extends Phaser.Scene {
  public stick: any;
  public slurp: any;
  public left: any;
  public right: any;
  public fake: any;
  constructor() {
    super({
      key: "Joy",
    });
  }

  preload() {
    this.load.atlas(
      "arcade-joy",
      "assets/skins/arcade-joystick.png",
      "assets/skins/arcade-joystick.json"
    );
   /* this.load.atlas(
      "dpad",
      "assets/skins/dpad.png",
      "assets/skins/dpad.json"
    );
    */
    this.load.scenePlugin(
      "VirtualJoystickPlugin",
      "assets/js/VirtualJoystickPlugin.min.js",
      "VirtualJoystickPlugin",
      "pad"
    );
  }

  create(): void {
    this.input.addPointer(3);

    //@ts-ignore
    //this.stick = this.pad.addStick(0, 0, 200, "arcade-joy").setScale(1);
    //this.stick = this.pad.addDPad(0, 0, 200, "dpad").setScale(1);

    //this.stick.alignBottomLeft();
    //@ts-ignore
    //this.stick.setMotionLock(VirtualJoystickPlugin.HORIZONTAL);


//@ts-ignore
this.left = this.pad.addButton(
  70,
  930,
  "arcade-joy",
  "button1-up",
  "button1-down",
)


this.add.sprite(65,930,"arrow").setFlipX(true)

//@ts-ignore
this.right = this.pad.addButton(
  200,
  930,
  "arcade-joy",
  "button1-up",
  "button1-down",
);

this.add.sprite(200,930,"arrow")

    //@ts-ignore
    this.slurp = this.pad.addButton(
      520,
      930,
      "arcade-joy",
      "button3-up",
  "button3-down",
    );


    this.add.sprite(520,960,"lingua").setFrame(4)

       //@ts-ignore
       this.fake = this.pad.addButton(
        520,
        800,
        "arcade-joy",
        "button3-up",
        "button3-down",
      );

      this.add.sprite(520,800,"fake").setFrame(0).setScale(1)

    
  }


}
