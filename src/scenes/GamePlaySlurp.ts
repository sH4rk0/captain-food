
import { GameData } from "../GameData";
import Player from "./Player";
import Food from "./Food";
import Bomb from "./Bomb";
import Block from "./Block";
import Boss from "./Boss";

export default class GamePlaySlurp extends Phaser.Scene {
  private _player: Player;
  private _groupFood: Phaser.GameObjects.Group;
  private _groupFake: Phaser.GameObjects.Group;
 
  private _boss: Boss;
  private _levels: any;
  private _currentLevelIndex:number=0;
  private _currentSequence:number=0;
  private _currentLevel:Level;
  private _levelText: Phaser.GameObjects.Text;

  private _sky1:Phaser.GameObjects.TileSprite;
  private _sky2:Phaser.GameObjects.TileSprite;
  private _sky3:Phaser.GameObjects.TileSprite;
  private _sky4:Phaser.GameObjects.TileSprite;
  private _stopNext:boolean=false;

  public _sfx:Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound;
  

  constructor() {
    super({key:"GamePlaySlurp"});
  }

  preload() {}

  create() {

    this._sfx=this.sound.addAudioSprite("sfx");

    this.registry.set("score", 0);
    this.registry.set("level", 0);

    this._currentSequence=0;
    this._currentLevelIndex=0;
    this._stopNext=false;

  
this.cameras.main.setBackgroundColor('#6fd1ec')
this._sky1=this.add.tileSprite(0,0,320,173,"sky-1").setScale(2).setOrigin(0)
this._sky2=this.add.tileSprite(0,346,320,48,"sky-2").setScale(2).setOrigin(0).setAlpha(1)
this._sky3=this.add.tileSprite(0,346+48*2,320,80,"sky-3").setScale(2).setOrigin(0).setAlpha(1)
this._sky4=this.add.tileSprite(0,346+48*2+80*2,320,171,"sky-4").setScale(2).setOrigin(0).setAlpha(1)

let _config = {
  font: "40px",
  fill: "#ffffff",
  stroke: "#4ab7d8",
  strokeThickness: 10,
  wordWrap: true,
  wordWrapWidth: 1000,
  align: 'center'
  ,lineSpacing: 20
};
this._levelText = this.add
  .text(300, 512, "", _config)
  .setAlpha(0)
  .setOrigin(0.5)
  .setFontFamily('"Press Start 2P"').setDepth(10000)


    this._levels=GameData.levels;
    //console.log(this._levels);
    //console.log(this._levels[this._currentLevelIndex]);

   
    this._groupFood = this.add.group({
      runChildUpdate: true,
      maxSize: 30
    });

    this._groupFake = this.add.group({
      runChildUpdate: true,
      maxSize: 3
    });

  

    this._player = new Player({ scene: this, x: 300, y: 0}).setDepth(10).setAlpha(0);

    this._player.activate()

    this.physics.add.collider(
      this._player.tongue(),
      this._groupFood,
      this.itemTongueCollide,
      undefined,
      this
    );

    this.physics.add.collider(
      this._player,
      this._groupFood,
      this.itemFaceCollide,
      undefined,
      this
    );

    this.physics.add.collider(
      this._groupFake,
      this._groupFood,
      this.itemFakeCollide,
      undefined,
      this
    );

    this.physics.add.collider(
      this._groupFood,
      this._groupFood,
      this.item2itemCollide,
      undefined,
      this
    );
    


    this._currentLevel=this._levels[this._currentLevelIndex].level;
  
    this.start()
   
  }




  update(time: number, delta: number) {
    this._player.update(time, delta);


    //@ts-ignore
    this._sky1.tilePositionX += this._player.body.deltaX() * 0.05;
     //@ts-ignore
    this._sky2.tilePositionX += this._player.body.deltaX() * 0.1;
     //@ts-ignore
    this._sky3.tilePositionX += this._player.body.deltaX() * 0.25;
     //@ts-ignore
    this._sky4.tilePositionX += this._player.body.deltaX() * 0.5;
  }


  start(){

    this.setupText({text:this._currentLevel.name})

  

  }

  setupText(_config:stringConfig){

    let _repeat:number=0;
    let _duration:number=0;
    let _delay:number=0;

    if(_config.size!=undefined){ this._levelText.setFontSize(_config.size)}else{this._levelText.setFontSize(28)}
    if(_config.color!=undefined){ this._levelText.setColor(_config.color)}else{this._levelText.setColor("#ffffff")}
    if(_config.stroke!=undefined){ this._levelText.setStroke(_config.stroke.color,_config.stroke.thick)}else{this._levelText.setStroke("#4ab7d8",10)}
    if(_config.repeat!=undefined){_repeat=_config.repeat}else{_repeat=1;}
    if(_config.duration!=undefined){_duration=_config.duration}else{_duration=1000}
    if(_config.delay!=undefined){_delay=_config.delay}else{_delay=1000}
    this._levelText.setText(_config.text);
    this.animateText(_repeat,_duration,_delay);
  }

  
  animateText(_repeat:number,_duration:number,_delay:number){
    
    
    this.tweens.add({targets:this._levelText, alpha:1, duration:_duration, repeat:_repeat, yoyo:true, onComplete:()=>{
      
      this.nextSequence(_delay);
    }});

  }


  nextSequence(_delay:number){

    if(this._stopNext) return;
    this.time.addEvent({delay:_delay,callback:this.getSequence,callbackScope:this})

  }

  getSequence(){
    if(this._stopNext) return;
    let _nextitem:itemData = this._levels[this._currentLevelIndex].level.sequence[this._currentSequence];
   
    if(_nextitem!=undefined){
      this._currentSequence++;

      if(this._levels[this._currentLevelIndex].level.sequence[this._currentSequence]==undefined){
       // console.log("last")
        this.addItem(true,_nextitem);
      }else{
       // console.log("not last")
        this.addItem(false,_nextitem);
        this.nextSequence(_nextitem.d)
      }

    }
  
  }


  addToFakeGroup(fake:any){

    this._groupFake.add(fake)

  }

 removeFromFakeGroup(fake:any){
    this._groupFake.remove(fake,true,true)
    
    let _anim=this.add.sprite(fake.x,fake.y,"fake-explo");
    let _animationConfig = {
      key: "explo",
      frames: this.anims.generateFrameNumbers("fake-explo", {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 20,
      yoyo: false,
    };

    this.sound.playAudioSprite("sfx",Phaser.Math.RND.pick(["squish1","squish2","squish3","squish4","squish5"]))
    this.anims.create(_animationConfig);
    _anim.play("explo")
    _anim.on(
      "animationcomplete",
      () => {
       _anim.destroy();
      },
      this
    );

    fake.destroy();
  }


  nextLevel(){

   this._currentSequence=0;
   this._currentLevelIndex++;
   this.registry.set("level", this._currentLevelIndex+1);
   if(this._levels[this._currentLevelIndex]==undefined){ 
     //console.log("no more levels")
    
    }else{

    this._currentLevel=this._levels[this._currentLevelIndex].level;
    this.setupText({text:this._currentLevel.name});
    
    

  }
  
  
  }

  getBombNumber():number{

    let _number:number=0;
    this._groupFood.children.each((item:any)=>{
      if(item.name="bomb"&& item.type=="Sprite") _number+=1;
    })
    return _number;
  }

  addItem(_isLast:boolean,_itemData:itemData) {

    let _type:number=_itemData.t;
    

    //console.log(_isLast,_item)

   if(_type==0)

    this._groupFood.add(
      new Food({
        scene: this,
        x:0,
        y: 1080,
        key: "food",
        itemData:_itemData,
        isLast:_isLast
      })
    );

    if (_type==1)

    this._groupFood.add(
      new Bomb({
        scene: this,
        x: Phaser.Math.RND.integerInRange(50, 550),
        y: 1024,
        key: "food",
       itemData:_itemData,
        isLast:_isLast
      })
    );

    if (_type==2)

    this._groupFood.add(
      new Block({
        scene: this,
        x: Phaser.Math.RND.integerInRange(50, 550),
        y: 1024,
        key: "food",
       itemData:_itemData,
        isLast:_isLast
      })
    );

    if (_type==3)
{

  this._boss=new Boss({
    scene: this,
    x: 300,
    y: 1100,
    key: "",
   itemData:_itemData,
    isLast:true
  });
  this._groupFood.add(this._boss);
  
 
  this.physics.add.collider(
    this._groupFood,
    this._boss.secondCollider(),
    this.item2colliderCollide,
    undefined,
    this
  );
}
    
    

    if (_type==4){
      if(_itemData.text!=undefined){
        this.setupText(_itemData.text);
        this.events.emit("incomingBoss");
      }
     
    }

    if (_type==6){
      if(_itemData.text!=undefined){
        this.setupText(_itemData.text);
      
      }
     
    }

    if (_type==5){
      this.registry.set("win",true);
      this.events.emit("gameover");
    }


  }

  addToFoodGroup(_item: Food|Bomb|Block|Boss){
    this._groupFood.add(_item);
  }

  removeItem(_item: Food|Bomb|Block|Boss) {
    this._groupFood.remove(_item,true,true);
   
  }


  itemTongueCollide(_tongue: any, _item:any) {



    if (_item.getObjName()=="food"){
      let __item:Food=<Food>_item;
 
    if (!this._player.isDie()) {

      __item.removeItem();
      this.sound.playAudioSprite("sfx","bonus", {
      loop: false,
      volume: 2,
    })

    if(__item.isSpecial()) this._player.tongueExpand();

    if(__item.isWrench()) this._player.repair();

      this.events.emit("updateScore",[__item.getScore(),__item.getName()])
    }




    }
    else if(_item.getObjName()=="bomb"){
      let __item:Bomb=<Bomb>_item;
      __item.activateBomb();

    }

  }

  itemFaceCollide(_player: any, _item: any) {
   
     this.playerHit(_item)
 
  }

  itemFakeCollide(_fake: any, _item: any) {
   
    this.removeFromFakeGroup(_fake)
     if(_item.getObjName()=="boss"){
     
      _item.hit();
    }else{
      _item.removeItem();
    
    }
  }

  item2itemCollide(_item1: any, _item2: any) {
    console.log(_item1.getObjName(),_item2.getObjName())
    if ((_item1.getObjName()=="bomb" && _item2.getObjName()=="boss") ||( _item1.getObjName()=="boss" && _item2.getObjName()=="bomb")){
    
      let __bomb:Bomb;
      let __boss:Boss
     if(_item1.getObjName()=="bomb"){
      __bomb=<Bomb>_item1;
      __boss=<Boss>_item2;
     }else{
      __bomb=<Bomb>_item2;
      __boss=<Boss>_item1;
     }

     
     if(__bomb.isActivated()){

      this._boss.hit();
      __bomb.removeItem();

     }
     
    }
  }

  item2colliderCollide(_item1: any, _item2: any) {
    //console.log(_item1.getObjName(),_item2.name)

if(_item1.getObjName()=="bomb"){
  let __bomb:Bomb;
  let __boss:Boss
  __bomb=<Bomb>_item1;
  __boss=<Boss>_item2;
  if(__bomb.isActivated()){
    this._boss.hit();
    __bomb.removeItem();

   }
}
   

    
     
    
  }

  playerHit(_item:Food|Bomb|Block){

    if (!this._player.isDie()) {
      _item.removeItem();
      this.cameras.main.shake(200);
      this._player.hit();
    }

  }


  stopSequence(){
    this._stopNext=true;
  }

  gameOver()
{

let _head:Phaser.GameObjects.Image=this.add.image(this._player.x,this._player.y,"salvini").setFrame(1);
let _cap:Phaser.GameObjects.Image=this.add.image(this._player.x,this._player.y,"cap").setFrame(1);
let _random:Phaser.GameObjects.Image=this.add.image(this._player.x,this._player.y,"randomEnd").setFrame(0).setScale(2);

this.physics.world.enable(_head);
//@ts-ignore
_head.body.setGravity(0, 1000);
 //@ts-ignore
 _head.body.setVelocity(Phaser.Math.RND.integerInRange(-200,200),Phaser.Math.RND.integerInRange(-500,-600));
this.tweens.add({targets:_head,angle:Phaser.Math.RND.integerInRange(-90,90),duration:2000})

this.physics.world.enable(_cap);
//@ts-ignore
_cap.body.setGravity(0, 1000);
 //@ts-ignore
 _cap.body.setVelocity(Phaser.Math.RND.integerInRange(-200,200),Phaser.Math.RND.integerInRange(-600,-700));
 this.tweens.add({targets:_cap,angle:Phaser.Math.RND.integerInRange(-90,90),duration:2000})

 
this.physics.world.enable(_random);
//@ts-ignore
_random.body.setGravity(0, 1000);
 //@ts-ignore
 _random.body.setVelocity(Phaser.Math.RND.integerInRange(-100,100),Phaser.Math.RND.integerInRange(-750,-900));
 this.tweens.add({targets:_random,angle:Phaser.Math.RND.integerInRange(-90,90),duration:2000})
 
 

 this.cameras.main.on('cameraflashstart',  (cam:any, fx:any, duration:number)=> {

  
  this.sound.playAudioSprite("sfx","explosion", {
    loop: false,
    volume: .5,
  })

  this.sound.playAudioSprite("sfx","cat", {
    loop: false,
    volume: 1,
  })

});

this.cameras.main.on('cameraflashcomplete',  ()=> {

  //console.log("flash end")
  this.events.emit("gameover");
});


  this.cameras.main.flash(1500)


  
}
/*
  bgItem(){

    let _bgFood=this.add.image(Phaser.Math.RND.integerInRange(50,550),1080,"food").setFrame(Phaser.Math.RND.integerInRange(0,63)).setAlpha(.3).setScale(2).setDepth(0)

    this.tweens.add({
      targets: _bgFood,
      y: -100,
        duration: 8000,
        ease: 'Power1'
   
      
      ,
      onComplete:()=>{
        console.log("destroy bg")
        _bgFood.destroy();
      }
    
    });

    
     this.tweens.add({
      targets: _bgFood,
    
      x:{ease: "Sine.easeInOut",value: "-="+Phaser.Math.RND.integerInRange(30,60), duration:2000,  yoyo: true, repeat: -1,}
      
      
    
    });
  }
  */
}
