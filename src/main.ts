import { ScaleMode, SceneManager } from "./scene-manager";
import { StartScene } from "./start-scene";
import "./style.css";

import { Application, Assets, Sprite } from "pixi.js";

const DESIGN_WIDTH = 720;
const DESIGN_HEIGHT = 1280 / 2;

const app = new Application();

window.onload = async (): Promise<void> => {
  // await demo();

  await init();
};

//@ts-ignore
async function demo() {
  await app.init({
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  });

  document.body.appendChild(app.canvas);

  const texture = await Assets.load("sample.png");

  const sprite = new Sprite(texture);

  sprite.x = app.renderer.width / 2;
  sprite.y = app.renderer.height / 2;
  console.log(sprite.position);

  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;

  app.stage.addChild(sprite);

  app.ticker.add(() => {
    sprite.rotation += 0.01;
  });
}

async function init() {
  await SceneManager.initialize({
    bgColor: "ffffff",
    scaleMode: ScaleMode.KEEP_RATIO,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  });
  SceneManager.changeScene(new StartScene());
}
