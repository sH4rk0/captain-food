import Joy from "../scenes/Joy";
import FakeNews from "./FakeNews";
import GamePlaySlurp from "./GamePlaySlurp";

export default class Player extends Phaser.GameObjects.Container {
  private _config: any;
  private _isDie: boolean = false;
  private _isGameOver: boolean = false;
  private _salvini: Phaser.GameObjects.Sprite;
  private _tongue: Phaser.GameObjects.Sprite;
  private _tongueCollider: Phaser.GameObjects.Sprite;
  private _cap: Phaser.GameObjects.Sprite;
  private _JoyScene: Joy;

  private _D: Phaser.Input.Keyboard.Key;
  private _A: Phaser.Input.Keyboard.Key;
  private _LEFT: Phaser.Input.Keyboard.Key;
  private _RIGHT: Phaser.Input.Keyboard.Key;
  private _SPACE: Phaser.Input.Keyboard.Key;
  private _B: Phaser.Input.Keyboard.Key;

  private _tongueTween: Phaser.Tweens.Tween;
  private _damage: number = 0;
  private _tongueLevel: number = 0;
  private _tongueLevelFrame: Array<Array<number>> = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 5, 4, 3, 2, 1, 0, 12],
    [0, 1, 2, 3, 4, 5, 13, 14, 15, 16, 17, 18, 19, 13, 5, 4, 3, 2, 1, 0, 12],
  ];
  private _tongueLevelY: Array<number> = [100, 150];
  private _tongueLevelDuration: Array<number> = [300, 300];
  private _tweenY: Phaser.Tweens.Tween;
  private _maxHit: number = 3;
  private _isSlurping:boolean=false;
  private _isFaking:boolean=false;
  private _fireParticle:Phaser.GameObjects.Particles.ParticleEmitter;
  private _whiteParticle:Phaser.GameObjects.Particles.ParticleEmitter;
  private _darkParticle:Phaser.GameObjects.Particles.ParticleEmitter;
  private _slimeParticle:Phaser.GameObjects.Particles.ParticleEmitter;
  private _hitParticle:Phaser.GameObjects.Particles.ParticleEmitter;
  private _scene:GamePlaySlurp;
  private _heli: Phaser.Sound.BaseSound;
  private _trainer:boolean=false;

  constructor(params: playerConfig) {
    super(params.scene, params.x, params.y);
    this._config = params;
    this._scene=<GamePlaySlurp>this._config.scene
    this.create();
  }

  create() {
    this._scene.events.off("gameover", this.gameover, this);
    this._scene.events.on("gameover", this.gameover, this);
   
    this._hitParticle=this._scene.add.particles('rublo').createEmitter({
      frame:[0,1,2,3,4],
      angle: { min: 240, max: 300 },
      speed: { min: 400, max: 600 },
      quantity: { min: 4, max: 10 },
      lifespan: 4000,
      alpha: { start: 1, end: 0 },
      scale: { min: 1, max: 1 },
      rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
      gravityY:  800,
      on: false
  });

    this._slimeParticle=this._scene.add.particles('slime').setDepth(100).createEmitter({
      frame:[0,1,2,3],
      angle: { min: 45, max: 135 },
      speed: { min: 200, max: 400 },
      quantity: { min: 3, max: 6 },
      lifespan: 4000,
      alpha: { start: 1, end: 0 },
      scale: { min: 0.05, max: 0.4 },
      rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
      gravityY:  610,
      on: false
  });
  

    this._fireParticle = this._config.scene.add.particles('fire').createEmitter({
      x: 400,
      y: 300,
      speed: { min: 100, max: 200 },
      angle: { min: -85, max: -95 },
      scale: { start: 0, end: 1, ease: 'Back.easeOut' },
      alpha: { start: 1, end: 0, ease: 'Quart.easeOut' },
      blendMode: 'SCREEN',
      lifespan: 1000,
      active:false
  });


  this._whiteParticle = this._config.scene.add.particles('white-smoke').createEmitter({
      x: 400,
      y: 300,
      speed: { min: 20, max: 100 },
      angle: { min: 0, max: 360},
      scale: { start: 1, end: 0},
      alpha: { start: 0, end: 0.5},
      lifespan: 2000,
      active: false
  });
 

  this._darkParticle = this._config.scene.add.particles('dark-smoke').createEmitter({
      x: 400,
      y: 300,
      speed: { min: 20, max: 100 },
      angle: { min: 0, max: 360},
      scale: { start: 1, end: 0},
      alpha: { start: 0, end: 0.1},
      blendMode: 'ADD',
      lifespan: 2000,
      active: false
  });
 

  

  this._fireParticle.startFollow(this,-400,-380)
  this._whiteParticle.startFollow(this,-400,-400)
  this._darkParticle.startFollow(this,-400,-380)
  this._slimeParticle.startFollow(this,-400,-380)

    this._damage = 0;
    this._isDie = false;
    this.setDepth(10);
    //@ts-ignore
    this._scene.physics.world.enable(this);

    //@ts-ignore
    this.body.setCircle(50,-47,-25).setCollideWorldBounds(true).setImmovable(true);

    
    this._salvini = this._scene.add.sprite(0, 0, "salvini")
     
    this._tongueCollider = this._config.scene.add.sprite(
      0,
      -90,
      "tongue-collider"
    );

    this._config.scene.physics.world.enable(this._tongueCollider);

    //@ts-ignore
    //this._tongueCollider.body.setCircle(16, 0, 0).setImmovable(true);
//@ts-ignore
    this._tongueCollider.body.setImmovable(true).setSize(32,90).setEnable(false);

  

    this._tongueCollider.setAlpha(0);

    this._tongueTween = this._config.scene.tweens
      .add({
        targets: this._tongueCollider,
        y:{

          getEnd:  (target:any, key:any, value:any)=>
          {
              return this.colliderLevelY();
          }

      },
        ease: "Sine.easeOut",
        delay: 0,
        yoyo: true,
        duration: this.colliderLevelDuration()
       
      })
      .stop();

    this._tongue = this._config.scene.add
      .sprite(4, 42, "lingua")
      .setScale(2)
      .setFrame(12)
      .setOrigin(0.5, 0);

    this._cap = this._config.scene.add.sprite(15, -90, "cap");

    this.add([this._salvini, this._tongue, this._cap, this._tongueCollider]);

    let _animationConfig = {
      key: "tongue-0",
      frames: this._config.scene.anims.generateFrameNumbers("lingua", {
        frames: this.getTongueAnimation(0),
      }),
      frameRate: 30,
      yoyo: false,
      repeat: 0,
    };
    this._config.scene.anims.create(_animationConfig);

     _animationConfig = {
      key: "tongue-1",
      frames: this._config.scene.anims.generateFrameNumbers("lingua", {
        frames: this.getTongueAnimation(1),
      }),
      frameRate: 30,
      yoyo: false,
      repeat: 0,
    };
    this._config.scene.anims.create(_animationConfig);

    _animationConfig = {
      key: "cap",
      frames: this._config.scene.anims.generateFrameNumbers("cap", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
      }),
      frameRate: 30,
      yoyo: false,
      repeat: -1,
    };
    this._config.scene.anims.create(_animationConfig);

   
    this._tongue.on(
      "animationcomplete",
      () => {
        //@ts-ignore
        this._tongueCollider.body.setEnable(false)
        //this._config.scene.physics.world.disable(this._tongueCollider);
        this._salvini.setFrame(0);
        this._SPACE.reset();
        this._tongueTween.restart();
        this._tongueTween.stop();
        this._isSlurping=false;
      },
      this
    );

    this._cap.play("cap");

    this._config.scene.add.existing(this);

    if (this._config.scene.sys.game.device.input.touch) {
      this._JoyScene = <Joy>this._config.scene.scene.get("Joy");
    }

    this._D = this._config.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );
    this._A = this._config.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );

    this._LEFT = this._config.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this._RIGHT = this._config.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this._SPACE = this._config.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this._B = this._config.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.B
    );
  }

  activate() {

   
  
    this._heli=this._config.scene.sound.add("heli");
    this._heli.play(undefined, {
       loop: true,
       volume: .07,
     })
    
    this._config.scene.add.tween({
      targets:this,
      alpha:1,
      y:200,
      ease: "Sine.easeOut",
      duration:1000,
      onComplete:()=>{
        this._tweenY = this._config.scene.add.tween({
          targets: this,
          y: this.y + 20,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        
      }
    })
    
  }

  tongueExpand(){
   
    this._tongueLevel=1;
  }
  tongueReduce(){
    this._tongueLevel=0;
  }

  repair(){this._damage=0;
    this._fireParticle.stop()
    //this._fireParticle.active=false;
    this._darkParticle.stop()
    //this._darkParticle.active=false;
    this._whiteParticle.stop()
    //this._whiteParticle.active=false;
  }

  colliderLevelY(): number {
    return this._tongueLevelY[this._tongueLevel];
  }
  colliderLevelDuration(): number {
    return this._tongueLevelDuration[this._tongueLevel];
  }
  getTongueAnimation(_level:number) {
    return this._tongueLevelFrame[_level];
  }

  tongue(): Phaser.GameObjects.Sprite {
    return this._tongueCollider;
  }
  face(): Phaser.GameObjects.Sprite {
    return this._salvini;
  }

  gameover(){
    this._heli.stop();
  }

  engineDown() {

    this._scene.events.emit("player-dead");
    this._config.scene.stopSequence();

    this._heli.stop();

    this._scene.sound.playAudioSprite("sfx","falling", {
      loop: false,
      volume: .5,
  })

this._tweenY.pause().remove();

    this._isDie = true;
    //@ts-ignore
    this.body.setCollideWorldBounds(false);
   
   
//@ts-ignore
    if(this.body.acceleration.x==-400){
       //@ts-ignore
      this.body.setAcceleration(-100, 400);
      this._scene.add.tween({targets:this,angle:-45,duration:5000})
    }else{
  //@ts-ignore
  this.body.setAcceleration(100, 400);
  this._scene.add.tween({targets:this,angle:45,duration:5000})
    }
  
    //@ts-ignore
    this.body.setVelocity(0, 0);


  }

  hit() {

    this.tongueReduce();

    this._salvini.setTintFill(0xffffff);
    this._hitParticle.emitParticleAt(this.x, this.y);

    this._config.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this._salvini.clearTint();
      },
    });
    if(!this._trainer) this._damage++;

if( this._damage==1){ 
  this._fireParticle.start();
  this._fireParticle.active=true;}
else if(this._damage==2){  this._darkParticle.start();this._darkParticle.active=true;}
else if( this._damage==3){ this._whiteParticle.start();this._whiteParticle.active=true;}
    
if (this._damage == this._maxHit) {

  this._scene.sound.playAudioSprite("sfx","merda");
      this.engineDown();
    
    }else{

      this._scene.sound.playAudioSprite("sfx",Phaser.Math.RND.pick(["cretino","comunisti","pirla"]));
    }
  }

  isDie(): boolean {
    return this._isDie;
  }

  slurp(): void {
    if(this._isSlurping || this._isFaking) return;
    
    this._isSlurping=true;
    this._scene.sound.playAudioSprite("sfx","slurp", {
      loop: false,
      volume: 0.1,
    });
    this._salvini.setFrame(1);
     //@ts-ignore
     this._tongueCollider.body.setEnable()
    //this._config.scene.physics.world.enable(this._tongueCollider);
    this._tongue.play("tongue-"+this._tongueLevel, true);
    this._tongueTween.play();
  }

  fakeNews(): void {
    if(this._isFaking || this._isFaking) return;

    let _score:number=this._scene.registry.get("score");
    if(_score<5){
      this._isFaking=true;
      this._scene.sound.playAudioSprite("sfx","buzz", {
        loop: false,
        volume: 0.25,
      });

      this._scene.time.addEvent({delay:300,callback:()=>{
        this._isFaking=false;
       }})
  }else{

    if(!this._trainer) 
    this._scene.events.emit("updateScore",[-10,""]);

      this._isFaking=true;
     
      this._scene.sound.playAudioSprite("sfx","burp", {
        loop: false,
        volume: 0.5,
      });
      this._salvini.setFrame(1);
  
      new FakeNews({x:this.x,y:this.y+20,key:"fake",scene:this._config.scene})
  
      this._slimeParticle.emitParticleAt(this.x, this.y+35);
      
    this._scene.time.addEvent({delay:100,callback:()=>{
     this._salvini.setFrame(0);
    }})
  
    this._scene.time.addEvent({delay:1000,callback:()=>{
      this._isFaking=false;
     }})

 }

   
  }

  handleInput() {

    if (
      (this._JoyScene && this._JoyScene.slurp && this._JoyScene.slurp.isDown) ||
      this._SPACE.isDown
    ) {
      this.slurp();
    }

    if (
      (this._JoyScene && this._JoyScene.fake && this._JoyScene.fake.isDown) ||
      this._B.isDown
    ) {
      this.fakeNews();
    }

    

    if (this._A.isDown || this._LEFT.isDown || (this._JoyScene && this._JoyScene.left && this._JoyScene.left.isDown)) {
      //@ts-ignore
      this.body.setAccelerationX(-400);
     
    } else if (this._D.isDown || this._RIGHT.isDown|| (this._JoyScene && this._JoyScene.right && this._JoyScene.right.isDown)) {
      //@ts-ignore
      this.body.setAccelerationX(400);
      
    } else {
      //@ts-ignore
      this.body.setAccelerationX(0);
     
    }
  }

  update(time: number, delta: number) {
    if (!this._isDie) this.handleInput();
    if (this.y > 1024) {
      
      if (!this._isGameOver){this._isGameOver =true; this._config.scene.gameOver();}

    }
  }
}
