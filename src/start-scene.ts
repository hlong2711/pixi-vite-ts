import { Container, Graphics } from "pixi.js";
import { IScene } from "./scene";
import { SceneManager } from "./scene-manager";

export class StartScene extends IScene {

  private loaderBar: Container;
  private loaderBarBorder: Graphics;
  private loaderBarFill: Graphics;


  constructor() {
    super();

    const loaderBarWidth = SceneManager.width * 0.8;

    this.loaderBarFill = new Graphics()
      .rect(0, 0, loaderBarWidth, 50)
      .fill({ color: 0x008800, alpha: 1 })

    this.loaderBarFill.scale.x = 0;

    this.loaderBarBorder = new Graphics()
      .rect(0, 0, loaderBarWidth, 50)
      .setStrokeStyle({ width: 10, color: 'black', alpha: 1 })
      .stroke()

    this.loaderBar = new Container();
    this.loaderBar.addChild(this.loaderBarFill);
    this.loaderBar.addChild(this.loaderBarBorder);
    this.loaderBar.position.x = (SceneManager.width - this.loaderBar.width) / 2;
    this.loaderBar.position.y = (SceneManager.height - this.loaderBar.height) / 2;
    this.addChild(this.loaderBar);

    this.init().then(() => {
      this.onLoaded();
    })
  }

  async init() {
  }

  onLoaded() {
    console.log(`[StartScene] onLoaded`);
  }

  private progress = 0;
  update(dt: number): void {
    this.progress += dt / 100;
    this.progress = Math.min(this.progress, 100);

    this.loaderBarFill.scale.x = this.progress / 100;
  }

  resize(width: number, height: number): void {
    console.log('[StartScene] resize', width, height);
  }
}
