import GamePlaySlurp from "./GamePlaySlurp";

export default class Food extends Phaser.GameObjects.Sprite {
  private _config: itemConfig;
  private _tween: Phaser.Tweens.Tween;
  private _scene: GamePlaySlurp;
  private _isDie: boolean = false;
  private _isSpecial:boolean;
  private _isWrench:boolean;
  private _score:number;
  private _name:string;

  private _foods:Array<{id:number;n:string;s:number}>=[
    {id:0,n:"Olio",s:1},
    {id:1,n:"Pasticcio",s:1},
    {id:2,n:"Zizzona",s:5},
    {id:3,n:"Pizza",s:1},
    {id:4,n:"Biscotti",s:1},
    {id:5,n:"Cioccolata",s:1},
    {id:6,n:"Tonno",s:1},
    {id:7,n:"Vinello",s:1},
    {id:8,n:"Torta",s:1},
    {id:9,n:"Torta",s:1},
    {id:10,n:"Torta",s:1},
    {id:11,n:"Zucchine",s:1},
    {id:12,n:"Pomodoro",s:1},
    {id:13,n:"Fragole",s:1},
    {id:14,n:"Pesca",s:1},
    {id:15,n:"Kiwi",s:1},

    {id:16,n:"Mela",s:1},
    {id:17,n:"Mela",s:1},
    {id:18,n:"Gelato",s:1},
    {id:19,n:"Patata",s:1},
    {id:20,n:"Limone",s:1},
    {id:21,n:"Porchetta",s:5},
    {id:22,n:"Marmellata",s:1},
    {id:23,n:"Marmellata",s:1},
    {id:24,n:"Filetto",s:1},
    {id:25,n:"Patata",s:1},
    {id:26,n:"Melone",s:1},
    {id:27,n:"Melone",s:1},
    {id:28,n:"Fiorentina",s:1},
    {id:29,n:"Salame",s:1},
    {id:30,n:"Tonno",s:1},
    {id:31,n:"Miele",s:1},

    {id:32,n:"Birrozza",s:1},
    {id:33,n:"Bistecca",s:1},
    {id:34,n:"Aglianico",s:1},
    {id:35,n:"Alici",s:1},
    {id:36,n:"Uova",s:1},
    {id:37,n:"Melanzana",s:1},
    {id:38,n:"Alice",s:1},
    {id:39,n:"Pancetta",s:1},
    {id:40,n:"Costolette",s:1},
    {id:41,n:"Sardine",s:1},
    {id:42,n:"Arance",s:1},
    {id:43,n:"Salsicce",s:1},
    {id:44,n:"Anguria",s:5},
    {id:45,n:"Brioches",s:1},
    {id:46,n:"Pollastro",s:1},
    {id:47,n:"Ciliege",s:15},

    {id:48,n:"Peperoncino",s:1},
    {id:49,n:"Peperoncino",s:1},
    {id:50,n:"Miele",s:1},
    {id:51,n:"Banane",s:1},
    {id:52,n:"Formaggio",s:1},
    {id:53,n:"Pollo",s:1},
    {id:54,n:"Pane",s:1},
    {id:55,n:"Melanzana",s:1},
    {id:56,n:"Conserva",s:1},
    {id:57,n:"Pane",s:1},
    {id:58,n:"Cipolla",s:1},
    {id:59,n:"Gamberetto",s:1},
    {id:60,n:"Latte",s:1},
    {id:61,n:"Pannocchie",s:5},
    {id:62,n:"Astice",s:1},
    {id:63,n:"Oliva",s:1}

  ]
  
  constructor(params: itemConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <GamePlaySlurp>params.scene;
    this.create();
  }

  create() {

    this._isSpecial=false;
    this._isWrench=false;
    this.name="food";
    if(this._config.itemData.x!=undefined){
      this.x= this._config.itemData.x;
    }else{
      this.x= Phaser.Math.RND.integerInRange(50, 550);
    }

    this._config.scene.physics.world.enable(this);

    //@ts-ignore
    this.body.setCircle(6, 2, 2).setImmovable(true);
    
    let _index:number=Phaser.Math.RND.integerInRange(0,this._foods.length-1);

    

    if(this._config.itemData.f!=undefined){_index= this._config.itemData.f;}
    if(this._config.itemData.s!=undefined){this._isSpecial=true;}
    if(this._config.itemData.w!=undefined){this._isWrench=true; this._isSpecial=false;}


    let _foodObj:{id:number;n:string;s:number};
    
    if(!this.isWrench()){
      _foodObj=this._foods[_index];
     
    }else{
      _foodObj={id:70,n:"Riparazione",s:5}
    }

    //console.log(_foodObj)
    this._score=_foodObj.s;
    this._name=_foodObj.n;

    const _animationConfig = {
      key: "blick-"+_foodObj.id,
      frames: this._config.scene.anims.generateFrameNumbers("food", {
        frames: [_foodObj.id,_foodObj.id+80],
      }),
      frameRate: 4,
      yoyo: false,
      repeat: -1,
    };
    this._config.scene.anims.create(_animationConfig);

    if(this._config.itemData.s){
      this.play("blick-"+_foodObj.id)
    }
   

  

    this.setFrame(_foodObj.id).setScale(4).setDepth(11);
  
    if(this._config.itemData.vy!=undefined){
      //@ts-ignore
      this.body.setVelocityY(this._config.itemData.vy)
     
    }else{
      //@ts-ignore
      this.body.setVelocityY(Phaser.Math.RND.integerInRange(-250,-200))
    }
    
    

    this._tween = this._config.scene.tweens.add({
      targets: this,
      x: "-="+Phaser.Math.RND.integerInRange(30,60),
      ease: "Sine.easeInOut",
      delay: 0,
      yoyo: true,
      repeat: -1,
      duration: Phaser.Math.RND.integerInRange(800,1200),
    });

    if(this._config.itemData.tween!=undefined && this._config.itemData.tween==false)
    this._tween.pause()

    this._config.scene.add.existing(this);
  }

  update(time: number, delta: number) {
    if (this.y < 0 && !this._isDie) {
      //console.log("remove item top")
      this._isDie = true;
      this.removeItem();
    }
  }

getObjName():string{return "food"}

  isSpecial():boolean{
   return this._isSpecial;
    
  }

  isWrench():boolean{
    return this._isWrench;
     
   }
getScore():number{ return this._score;}

getName():string{ return this._name;}

  removeItem() {
    this._scene.physics.world.disable(this);
    this._tween.remove();
   
    //@ts-ignore
    this.body.setVelocity(0,0);
    this.setTintFill(0xffffff);
    
    this._scene.time.addEvent({
      delay: 100,
      callback: () => {
        this._scene.removeItem(this);
        if (this._config.isLast) this._scene.nextLevel();
      },
    });
  }
}
