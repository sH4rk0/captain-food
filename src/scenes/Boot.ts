export default class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "Boot",
    });
  }

  preload() {
    this.load.image("thelucasart", "assets/images/thelucasart.png");
    this.load.image("coldiretti", "assets/images/coldiretti.png");
    var graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 600, 1024);
    graphics.generateTexture("black-screen", 600, 1024);

    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, 32, 90);
    graphics.generateTexture("tongue-collider", 32, 90);

    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 600, 70);
    graphics.generateTexture("button", 600, 70)
    
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 50, 50);
    graphics.generateTexture("collider", 50, 50);


  }

  create() {
    this.scene.start("Preloader");
  }

  update() {}
}
