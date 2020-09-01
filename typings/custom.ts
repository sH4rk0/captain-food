
interface ScoreConfig {
  name: string;
  score: number;
  level: number;
  date: number;
}

interface playerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
}


interface itemConfig{

  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  itemData: itemData;
  isLast:boolean;
}
interface Level{
  name:string;
  sequence:Array<itemData>;

}

interface itemData{
  t:number;//type 0=food, 1=bomb, 2=block, 3=boss, 4=text
  d:number;//delay
  f?:number;//food
  s?:boolean;//special
  x?:number;// start x
  vy?:number;// velocity y
  w?:boolean; //wrench
  isMale?:boolean;
  text?:stringConfig;
  tween?:boolean;

}
interface stringConfig{

  text:string;
  color?:string;
  size?:number;
  stroke?:{color:string,thick:number};
  duration?:number;
  repeat?:number;
  delay?:number;

}


interface genericConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
}

interface ImageAsset {
  name: string;
  path: string;
}

interface ScriptAsset {
  key: string;
  path: string;
}

interface TileMapsAsset {
  key: string;
  path: string;
}

interface SpritesheetsAsset {
  name: string;
  path: string;
  width: number;
  height: number;
  frames: number;
  spacing?: number;
}

interface SoundAsset {
  name: string;
  paths: Array<string>;
}

interface AudioSpriteAsset {
  name: string;
  jsonpath: string;
  paths: Array<string>;
  instance: { instance: number };
}

interface BitmapfontAsset {
  name: string;
  imgpath: string;
  xmlpath: string;
}

interface AtlasAsset {
  key: string;
  imagepath: string;
  jsonpath: string;
}
