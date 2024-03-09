import { Container } from "pixi.js";

export abstract class IScene extends Container {
  /**
   * 
   * @param dt Delta millisecond
   */
  abstract update(dt: number): void;

  /**
   * Callback when window is resize. Override this function to handle resize event
   * @param width canvas width in html
   * @param height canvas height in html
   */
  resize(width: number, height: number): void { }
}