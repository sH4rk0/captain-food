import GamePlaySlurp from "./GamePlaySlurp";

export default class FakeNews extends Phaser.GameObjects.Sprite {
  private _config: genericConfig;
  private _scene: GamePlaySlurp;
  private _isDie: boolean = false;
  

  constructor(params: genericConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <GamePlaySlurp>params.scene;
    this.create();
  }

  create() {
    this.name="fake";
    //@ts-ignore
    this._config.scene.physics.world.enable(this);
    //@ts-ignore
    this.body.setSize(50,19,6,4);
    
    this.setFrame(0).setDepth(100).setAlpha(0).setScale(1);
    //@ts-ignore
    this.body.setVelocityY(560);

    const _animationConfig = {
      key: "fakeAnim",
      frames: this._config.scene.anims.generateFrameNumbers("fake", {
        frames: [0,1,2,3,4,5,6,7],
      }),
      frameRate: 10,
      yoyo: false,
      repeat: -1,
    };
    this._config.scene.anims.create(_animationConfig);

   
    
      this.play("fakeAnim")
    
    this._scene.addToFakeGroup(this)
    this._config.scene.add.existing(this);

    this._scene.tweens.add({targets:this,  props: {
      alpha: { value: 1, duration: 300, ease: 'Power2' },
      scale: { value: 2, duration: 1000, ease: 'Bounce.easeOut' }
  },})
  }

  getObjName():string{ return "fake"}

  update(time: number, delta: number) {


    if(this.y>1024){ this.destroy()}
   
  }

  
  
}
