import { Application, Color } from "pixi.js";
import { IScene } from "./scene";

export const enum ScaleMode {
  KEEP_RATIO = 1,
  FULL_SCREEN = 2,
}

/**
 * Singleton class / pure static
 */
export class SceneManager {
  private constructor() { }

  private static _width: number;
  private static _height: number;

  private static app: Application;
  private static currentScene: IScene;

  private static scaleMode: ScaleMode = ScaleMode.KEEP_RATIO;

  public static get width(): number {
    return SceneManager._width;
  }
  public static get height(): number {
    return SceneManager._height;
  }

  public static get screen_width(): number {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }
  public static get screen_height(): number {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }

  public static async initialize(
    config: { bgColor: string | number | Color } & (
      | {
        width: number;
        height: number;
        scaleMode: ScaleMode.KEEP_RATIO;
      }
      | {
        scaleMode: ScaleMode.FULL_SCREEN;
      }
    )
  ) {
    const { scaleMode, bgColor } = config;

    SceneManager.scaleMode = scaleMode;

    if (scaleMode === ScaleMode.KEEP_RATIO) {
      const { width, height } = config;
      SceneManager._width = width;
      SceneManager._height = height;
    } else if (scaleMode === ScaleMode.FULL_SCREEN) {
      SceneManager._width = SceneManager.screen_width;
      SceneManager._height = SceneManager.screen_height;
    }

    this.app = new Application();

    await this.app.init({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      background: bgColor,
      width: SceneManager._width,
      height: SceneManager._height,
      resizeTo: scaleMode === ScaleMode.FULL_SCREEN ? window : undefined,
    });

    document.body.appendChild(this.app.canvas);

    SceneManager.app.ticker.add(SceneManager.update);

    if (SceneManager.scaleMode === ScaleMode.KEEP_RATIO) {
      SceneManager.resize();
      window.addEventListener("resize", SceneManager.resize);
    } else if (SceneManager.scaleMode === ScaleMode.FULL_SCREEN) {
      window.addEventListener("resize", () => {
        SceneManager.resizeResponsive(
          SceneManager.screen_width,
          SceneManager.screen_height
        );
      });
    }
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

  public static resize(): void {
    // current screen size
    const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    // uniform scale for our game
    const scale = Math.min(
      screenWidth / SceneManager.width,
      screenHeight / SceneManager.height
    );

    // the "uniformly enlarged" size for our game
    const enlargedWidth = Math.floor(scale * SceneManager.width);
    const enlargedHeight = Math.floor(scale * SceneManager.height);

    // margins for centering our game
    const horizontalMargin = (screenWidth - enlargedWidth) / 2;
    const verticalMargin = (screenHeight - enlargedHeight) / 2;

    // now we use css trickery to set the sizes and margins
    SceneManager.app.canvas.style.width = `${enlargedWidth}px`;
    SceneManager.app.canvas.style.height = `${enlargedHeight}px`;
    SceneManager.app.canvas.style.marginLeft =
      SceneManager.app.canvas.style.marginRight = `${horizontalMargin}px`;
    SceneManager.app.canvas.style.marginTop =
      SceneManager.app.canvas.style.marginBottom = `${verticalMargin}px`;

    SceneManager.resizeResponsive(enlargedWidth, enlargedHeight);
  }

  public static resizeResponsive(width: number, height: number): void {
    if (SceneManager.currentScene) {
      SceneManager.currentScene.resize(width, height);
    }
  }
}
