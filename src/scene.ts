import { Container } from "pixi.js";

export abstract class IScene extends Container {
  /**
   * 
   * @param dt Delta millisecond
   */
  abstract update(dt: number): void;
}