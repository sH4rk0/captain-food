export default class ScoreInput extends Phaser.Scene {
  private _chars: Array<Array<string>>;
  private _cursor: Phaser.Math.Vector2;
  private _name: string;
  private _charLimit: number;
  private _block: Phaser.GameObjects.Image;
  private _text: Phaser.GameObjects.BitmapText;

  constructor() {
    super({
      key: "ScoreInput",
    });

    this._chars = [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", ".", "-", "<", ">"],
    ];

    this._cursor = new Phaser.Math.Vector2();

    this._name = "";
    this._charLimit = 8;
  }

  create() {
    this._name = "";
    this._text = this.add.bitmapText(
      55,
      720,
      "arcade",
      "ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-"
    );
    this._text.setLetterSpacing(20);
    this._text.setInteractive();

    this.add.image(this._text.x + 430, this._text.y + 148, "rub");
    this.add.image(this._text.x + 482, this._text.y + 148, "end");

    this._block = this.add
      .image(this._text.x - 10, this._text.y - 2, "block")
      .setOrigin(0);

    this.input.keyboard.on("keyup_LEFT", this.moveLeft, this);
    this.input.keyboard.on("keyup_RIGHT", this.moveRight, this);
    this.input.keyboard.on("keyup_UP", this.moveUp, this);
    this.input.keyboard.on("keyup_DOWN", this.moveDown, this);
    this.input.keyboard.on("keyup_ENTER", this.pressKey, this);
    this.input.keyboard.on("keyup_SPACE", this.pressKey, this);
    this.input.keyboard.on("keyup", this.anyKey, this);

    this._text.on("pointermove", this.moveBlock, this);
    this._text.on("pointerup", this.pressKey, this);

    this.tweens.add({
      targets: this._block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      duration: 350,
    });
  }

  moveBlock(pointer: Phaser.Input.Pointer, x: number, y: number) {
    let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
    let char = this._chars[cy][cx];
    this._cursor.set(cx, cy);
    this._block.x = this._text.x - 10 + cx * 52;
    this._block.y = this._text.y - 2 + cy * 64;
  }

  moveLeft() {
    if (this._cursor.x > 0) {
      this._cursor.x--;
      this._block.x -= 52;
    } else {
      this._cursor.x = 9;
      this._block.x += 52 * 9;
    }
  }

  moveRight() {
    if (this._cursor.x < 9) {
      this._cursor.x++;
      this._block.x += 52;
    } else {
      this._cursor.x = 0;
      this._block.x -= 52 * 9;
    }
  }

  moveUp() {
    if (this._cursor.y > 0) {
      this._cursor.y--;
      this._block.y -= 64;
    } else {
      this._cursor.y = 2;
      this._block.y += 64 * 2;
    }
  }

  moveDown() {
    if (this._cursor.y < 2) {
      this._cursor.y++;
      this._block.y += 64;
    } else {
      this._cursor.y = 0;
      this._block.y -= 64 * 2;
    }
  }

  anyKey(event: any) {
    //  Only allow A-Z . and -

    let code: any = event.keyCode;

    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this._cursor.set(6, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this._cursor.set(7, 2);
      this.pressKey();
    } else if (
      code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE ||
      code === Phaser.Input.Keyboard.KeyCodes.DELETE
    ) {
      this._cursor.set(8, 2);
      this.pressKey();
    } else if (
      code >= Phaser.Input.Keyboard.KeyCodes.A &&
      code <= Phaser.Input.Keyboard.KeyCodes.Z
    ) {
      code -= 65;

      let y = Math.floor(code / 10);
      let x = code - y * 10;

      this._cursor.set(x, y);
      this.pressKey();
    }
  }

  pressKey() {
    let x = this._cursor.x;
    let y = this._cursor.y;
    let nameLength = this._name.length;

    this._block.x = this._text.x - 10 + x * 52;
    this._block.y = this._text.y - 2 + y * 64;

    if (x === 9 && y === 2 ) {
      //  Submit
     // console.log("submit");
     if(this._name=="<") this._name="";
      this.events.emit("submitName", this._name);

    } else if (x === 8 && y === 2 && nameLength > 0) {
      //  Rub
     // console.log("rub");
      this._name = this._name.substr(0, nameLength - 1);

      this.events.emit("updateName", this._name);
    } else if (this._name.length < this._charLimit) {
      //  Add
     // console.log("add");
      this._name = this._name.concat(this._chars[y][x]);

      this.events.emit("updateName", this._name);
    }
  }
}
