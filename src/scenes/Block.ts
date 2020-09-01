import GamePlaySlurp from "./GamePlaySlurp";

export default class Block extends Phaser.GameObjects.Sprite {
  private _config: itemConfig;
  private _scene: GamePlaySlurp;
  private _isDie: boolean = false;

  constructor(params: itemConfig) {
    super(params.scene, params.x, params.y, params.key);
    this._config = params;
    this._scene = <GamePlaySlurp>params.scene;

    this.create();
  }


  create() {

    this.name="block";
if(this._config.itemData.x!=undefined){
  this.x= this._config.itemData.x;
}else{
  this.x= Phaser.Math.RND.integerInRange(50, 550);
}


    this._config.scene.physics.world.enable(this);

    //@ts-ignore
    this.body.setImmovable(true);
    
    let _frame:number=Phaser.Math.RND.integerInRange(65,65);

    this.setFrame(_frame).setScale(4).setDepth(11);
  
    if(this._config.itemData.vy!=undefined){
      //@ts-ignore
      this.body.setVelocityY(this._config.itemData.vy)
     
    }else{
      //@ts-ignore
      this.body.setVelocityY(Phaser.Math.RND.integerInRange(-250,-200))
    }
    

    this._config.scene.add.existing(this);
  }

  update(time: number, delta: number) {
    if (this.y < 0 && !this._isDie) {
      //console.log("remove item top")
      this._isDie = true;
      this.removeItem();
    }
  }

  getObjName():string{ return "block"}

  

  removeItem() {
    this._scene.physics.world.disable(this);
   
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
