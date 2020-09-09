
import GamePlaySlurp from "./GamePlaySlurp";
import Bomb from "./Bomb";
export default class Boss extends Phaser.GameObjects.Container {
  private _config: itemConfig;
  private _isDie: boolean = false;
  private _face: Phaser.GameObjects.Sprite;
  private _cap: Phaser.GameObjects.Sprite;
  private _decoration: Phaser.GameObjects.Sprite;
  private _damage: number = 0;
  private _maxHit: number = 0;
  private _maxBomb: number = 0;
  private _collider:Phaser.GameObjects.Sprite;

  private _leftParticle:Phaser.GameObjects.Particles.ParticleEmitterManager;
  private _rightParticle:Phaser.GameObjects.Particles.ParticleEmitterManager;
  private _fireParticle:Phaser.GameObjects.Particles.ParticleEmitter;
  private _whiteParticle:Phaser.GameObjects.Particles.ParticleEmitter;
  private _darkParticle:Phaser.GameObjects.Particles.ParticleEmitter;
  private _scene:GamePlaySlurp;
  private _tweenY:Phaser.Tweens.Tween;
  private _startTween:Phaser.Tweens.Tween;
  private _directionTimer:Phaser.Time.TimerEvent;
  private _bombTimer:Phaser.Time.TimerEvent;
  private _type:number;
  private _isMale:boolean;
  //private _heli: Phaser.Sound.BaseSound;
 

  private _capDecoration:Array<{color:number,id:number,x:number,y:number,cap:{x:number,y:number},cy:number,mb:number,d:number}>=[
    {color:0xff0000,id:61,x:10,y:-90,cap:{x:5,y:0},cy:10, mb:1,d:1},//zinga
    {color:0x059cc7,id:3,x:5,y:-90,cap:{x:0,y:0},cy:10,mb:2,d:2},//dima
    {color:0xff00ff,id:67,x:5,y:-90,cap:{x:0,y:0},cy:10,mb:2,d:3},//azzo
    {color:0x00ff00,id:69,x:0,y:-90,cap:{x:-4,y:0},cy:-10,mb:3,d:4},//forn
    {color:0xffff00,id:48,x:0,y:-90,cap:{x:0,y:0},cy:-10,mb:3,d:5},//bella
    {color:0x664488,id:28,x:0,y:-90,cap:{x:0,y:0},cy:10,mb:3,d:5},//renzi
    {color:0xf68cf2,id:23,x:0,y:-90,cap:{x:0,y:0},cy:-10,mb:4,d:5},//boschi
    {color:0xffffff,id:72,x:0,y:-90,cap:{x:0,y:0},cy:0,mb:4,d:6},//giuseppi
    {color:0x7a420b,id:71,x:0,y:-90,cap:{x:0,y:0},cy:0,mb:5,d:8}//o mast
  ];



  constructor(params: itemConfig) {
    super(params.scene, params.x, params.y);
    this._config = params;
    this._scene=<GamePlaySlurp>this._config.scene
    this.create();
  }

  create() {
 this.setName("boss");
this._type=0;
this._isMale=false;
if(this._config.itemData.isMale!=undefined) this._isMale=this._config.itemData.isMale;



if(this._config.itemData.f!=undefined) this._type=this._config.itemData.f;
this._maxHit=this._maxBomb=this._capDecoration[this._type].d;
this._maxBomb=this._capDecoration[this._type].mb;

this._scene.events.off("gameover", this.gameOver, this);
this._scene.events.on("gameover", this.gameOver, this);

this._scene.events.off("player-dead", this.stopActivities, this);
this._scene.events.on("player-dead", this.stopActivities, this);

this._leftParticle = this._config.scene.add.particles('explosionParticles').setDepth(200);

this._leftParticle.createEmitter({
  frame: [ 'smoke-puff', 'cloud', 'smoke-puff' ],
// angle: { min: 300, max: 350 },
 angle: { min: 200, max: 250 }, 
  speed: { min: 50, max: 60 },
  quantity: { min: 3, max: 5 },
  lifespan: 2000,
  alpha: { start: 1, end: 0 },
  scale: { start: 0.25, end: 0.1 },
  on: false
}).startFollow(this)

this._leftParticle.createEmitter({
  frame: 'muzzleflash2',
  lifespan: 200,
  scale: { start: 0.5, end: 0 },
  rotate: { start: 0, end: 180 },
  on: false
}).startFollow(this)

this._rightParticle = this._config.scene.add.particles('explosionParticles').setDepth(200);

this._rightParticle.createEmitter({
  frame: [ 'smoke-puff', 'cloud', 'smoke-puff' ],
 angle: { min: 300, max: 350 },
// angle: { min: 200, max: 250 }, 
  speed: { min: 50, max: 60 },
  quantity: { min: 3, max: 5 },
  lifespan: 2000,
  alpha: { start: 1, end: 0 },
  scale: { start: 0.25, end: 0.1 },
  on: false
}).startFollow(this)

this._rightParticle.createEmitter({
  frame: 'muzzleflash2',
  lifespan: 200,
  scale: { start: 0.5, end: 0 },
  rotate: { start: 0, end: 180 },
  on: false
}).startFollow(this)

   
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

    this._damage = 0;
    this._isDie = false;
     //@ts-ignore
     this._config.scene.physics.world.enable(this);
    //@ts-ignore
    this.body.setCircle(50, -45, -110).setImmovable(true).setCollideWorldBounds(true).setBounce(1)
   

    this._collider = this._scene.add
    .sprite(0, this._capDecoration[this._type].cy, "collider")
    .setName("boss").setAlpha(0);
    //@ts-ignore
    this._config.scene.physics.world.enable(this._collider);
    //@ts-ignore
    this._collider.body.setCircle(40, -15, 0).setImmovable(true)

      this._face = this._scene.add
      .sprite(0, 0, "faces")
      .setFrame(this._type*2).setScale(4);
    
    this._cap = this._config.scene.add.sprite(15+this._capDecoration[this._type].cap.x, -90+this._capDecoration[this._type].cap.y, "cap-generic").setTint(this._capDecoration[this._type].color);
    this._decoration = this._config.scene.add.sprite( this._capDecoration[this._type].x,  this._capDecoration[this._type].y, "food");
    this._decoration.setFrame(this._capDecoration[this._type].id).setScale(2);

    this.add([this._face,  this._cap, this._scene.add.image(3+this._capDecoration[this._type].cap.x,-103+this._capDecoration[this._type].cap.y,"cap-cannons"), this._decoration, this._collider]);

    let _animationConfig = {
      key: "cap-gen",
      frames: this._config.scene.anims.generateFrameNumbers("cap-generic", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
      }),
      frameRate: 30,
      yoyo: false,
      repeat: -1,
    };
    this._config.scene.anims.create(_animationConfig);
    this._cap.play("cap-gen");

    this._config.scene.add.existing(this);
    this.activate();
    
  }

  gameOver(){
    this.stopActivities();
   // this._heli.stop();
    this.destroy();
  }

  secondCollider(){

    return this._collider;

  
  }

  getObjName():string{ return "boss"}

  stopActivities(){
    if(this._bombTimer!=undefined) this._bombTimer.remove();
   if(this._directionTimer!=undefined) this._directionTimer.remove();
  }

  activate() {

    
    this._startTween=this._config.scene.add.tween({
      targets:this,
      alpha:1,
      y:850,
      ease: "Sine.easeOut",
      duration:2000,
      onComplete:()=>{

        this.spawnFood();

        this._tweenY = this._config.scene.add.tween({
          targets: this,
          y: this.y + 20,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

      this._directionTimer=this._scene.time.addEvent({delay:1000,callback:()=>{
        
      this.changeDirection();
      },repeat:-1})

     this._bombTimer=this._scene.time.addEvent({delay:5000-(200*this._type),callback:()=>{
        this.spawnFood();
        
      },repeat:-1})
        
      }
    })
    
  }

 changeDirection(){

  if (this.isDie()) return;
  if(Phaser.Math.RND.integerInRange(0,1)){
 //@ts-ignore
 this.body.setAccelerationX(-20+((this._type+1)*3));
  }else{
//@ts-ignore
this.body.setAccelerationX(20+((this._type+1)*3));

  }


 }


  spawnFood(){
    if (this.isDie()) return;
    //console.log(this._scene.getBombNumber(),this._maxBomb)
    if(this._scene.getBombNumber()==this._maxBomb) return;

    this._scene.sound.playAudioSprite("sfx","cannon",{volume:0.3});

    if(this.x>300){
    this._leftParticle.emitParticleAt(this.x-35, this.y-110);
    }else{
    this._rightParticle.emitParticleAt(this.x+49, this.y-108);
    }
    
    this._face.setFrame(this._type*2+1)
    this._scene.addToFoodGroup( new Bomb({
      scene: this._scene,
      x: this.x,
      y: this.y-40,
      key: "food",
     itemData:{t:0,d:0},
      isLast:false
    }))

    this._scene.time.addEvent({delay:100,callback:()=>{
      this._face.setFrame(this._type*2);
    }})

  }

  engineDown() {
 
    if(this._startTween!=undefined) this._startTween.pause().remove();
    if(this._tweenY!=undefined) this._tweenY.pause().remove();
    this.stopActivities();
  
    this._scene.sound.playAudioSprite("sfx","falling",{
      loop: false,
      volume: .5,
    });
   
   
    //@ts-ignore
    this.body.setCollideWorldBounds(false);

   
//@ts-ignore
    if(this.body.acceleration.x==-400){
       //@ts-ignore
      this.body.setAccelerationX(-100);
      this._scene.add.tween({targets:this,angle:-45,duration:5000})
    }else{
  //@ts-ignore
      this.body.setAccelerationX(100);
      this._scene.add.tween({targets:this,angle:45,duration:5000})
    }
  
    //@ts-ignore
    this.body.setAccelerationY(400).setVelocity(0,0)



  }

  hit() {
    if(this.isDie()) return;
   if(this._isMale){
    this._scene.sound.playAudioSprite("sfx",Phaser.Math.RND.pick(["ouch1","ouch2","ouch3"]),{volume:0.3});
   }else{
    this._scene.sound.playAudioSprite("sfx",Phaser.Math.RND.pick(["ouch4","ouch5","ouch6"]),{volume:0.5});
   }
    

    this._face.setTintFill(0xffffff);

    this._config.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this._face.clearTint();
      },
    });
    this._damage++;

if( this._damage==1){ this._fireParticle.active=true;}
else if(this._damage==2){ this._darkParticle.active=true;}
else if( this._damage==3){this._whiteParticle.active=true;}
    if (this._damage == this._maxHit) { this._isDie = true;this.engineDown();}
  }

  isDie(): boolean {
    return this._isDie;
  }

  

  

  update(time: number, delta: number) {


    if (this.y > 1200) {
      
     this._scene.events.emit("boss-dead");
     this._darkParticle.stop()
     this._whiteParticle.stop()
     this._fireParticle.stop()
     this._scene.physics.world.disable(this);

   this._scene.sound.playAudioSprite("sfx","explosion", {
    loop: false,
    volume: .5,
  });

     this._scene.nextLevel();
     this._scene.removeItem(this)

    }
  }
}
