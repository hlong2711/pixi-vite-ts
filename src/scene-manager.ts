import { Application, Color } from "pixi.js";
import { IScene } from "./scene";

/**
 * Singleton class / pure static
 */
export class SceneManager {
  private constructor() { }

  private static _width: number;
  private static _height: number;

  private static app: Application;
  private static currentScene: IScene;

  public static get width(): number {
    return SceneManager._width;
  }
  public static get height(): number {
    return SceneManager._height;
  }

  public static async initialize(width: number, height: number, bgColor: string | number | Color) {
    SceneManager._width = width;
    SceneManager._height = height;

    this.app = new Application();

    await this.app.init({
      resolution: window.devicePixelRatio || 1,
      background: bgColor,
      width: width,
      height: height,
    });

    document.body.appendChild(this.app.canvas);

    SceneManager.app.ticker.add(SceneManager.update);

  }

  private static update() {
    if (SceneManager.currentScene) {
      const dt = SceneManager.app.ticker.deltaMS;
      SceneManager.currentScene.update(dt);
    }
  }

  public static changeScene(newScene: IScene) {
    if (SceneManager.currentScene) {
      SceneManager.app.stage.removeChild(SceneManager.currentScene);
      SceneManager.currentScene.destroy();
    }

    SceneManager.currentScene = newScene;
    SceneManager.app.stage.addChild(SceneManager.currentScene);
  }
}
