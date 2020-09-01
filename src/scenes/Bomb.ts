import GamePlaySlurp from "./GamePlaySlurp";

export default class Bomb extends Phaser.GameObjects.Sprite {
  private _config: itemConfig;
  private _scene: GamePlaySlurp;
  private _isDie: boolean = false;
  private _maxBounces:number=5;
  private _bounces:number=0;
  private _isActivated:boolean;
  

  constructor(params: itemConfig) {
    super(params.scene, params.x, params.y-60, params.key);
    this._config = params;
    this._scene = <GamePlaySlurp>params.scene;
    this.create();


  }

  create() {
    this.setName("bomb");
    this._isActivated=false;
    this._bounces=0;
    
    //@ts-ignore
    this._config.scene.physics.world.enable(this);
    //@ts-ignore
    this.body.setCircle(6, 2, 2);
    
    this.setFrame(64).setScale(0).setAlpha(1)
    //@ts-ignore
    this.body.setCollideWorldBounds(true).setBounce(1)
//@ts-ignore
  //  this.body.collide=false;
    //@ts-ignore
    //this.body.onWorldBounds = true;
    
    let _xvel:number=(100 + Phaser.Math.RND.integerInRange(1,3) * 16);

    //console.log(_xvel)
    if(this.x>300){

      //_xvel=_xvel*-1; 
      this.setX(this.x-30);
      _xvel=-180
    }else{ 
      _xvel=180
        this.setX(this.x+30)
      }

    //@ts-ignore
    this.body.setVelocity(_xvel,-200);

    
   
    
this._scene.events.off("boss-dead", this.removeOnBossDead, this);
this._scene.events.on("boss-dead", this.removeOnBossDead, this);

    
this._scene.events.off("player-dead", this.removeOnPlayerDead, this);
this._scene.events.on("player-dead", this.removeOnPlayerDead, this);

  this._scene.add.tween({targets:this, props: {
    alpha: { value: 1, duration: 300, ease: 'Power2' },
    scale: { value: 4, duration: 1000, ease: 'Bounce.easeOut' }
}})



  const _animationConfig = {
    key: "bomb-blink",
    frames: this._config.scene.anims.generateFrameNumbers("food", {
      frames: [64,66],
    }),
    frameRate: 4,
    yoyo: false,
    repeat: -1,
  };
  this._config.scene.anims.create(_animationConfig);
    
    this._config.scene.add.existing(this);
  }

  update(time: number, delta: number) {
    //@ts-ignore
   if(this.body.blocked.none==false){

    this._scene.add.tween({targets:this, props: {
      scale: { value: 4.3, duration: 100, ease: 'Bounce.easeInOut', yoyo:true, repeat:0}
  }});

  
    this._bounces+=1;
    if(this._bounces==this._maxBounces && !this.isActivated()) this.removeItem();
   }
  }

  getObjName():string{ return "bomb"}

  activateBomb(){this._isActivated=true; this.play("bomb-blink")}

  isActivated(){ return this._isActivated}

removeOnBossDead(){

  this.playExplosion()
  this._scene.removeItem(this);


}
removeOnPlayerDead(){

  this.playExplosion()
  this._scene.removeItem(this);
}


playExplosion(){

  this._scene.events.off("boss-dead", this.removeOnBossDead, this);
  this._scene.events.off("player-dead", this.removeOnPlayerDead, this);
  let _anim=this._scene.add.sprite(this.x,this.y,"fake-explo").setOrigin(.5).setScale(2).setDepth(20);
  let _animationConfig = {
    key: "bomb-explo",
    frames: this._scene.anims.generateFrameNumbers("bomb-explo", {
      frames: [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14],
    }),
    frameRate: 30,
    yoyo: false,
  };
  this._scene.anims.create(_animationConfig);
  _anim.play("bomb-explo")
  _anim.on(
    "animationcomplete",
    () => {
     _anim.destroy();
    },
    this
  );
}

  removeItem() {

    this.playExplosion()
    this._scene.removeItem(this);
   
  }
}
