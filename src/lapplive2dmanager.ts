/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMatrix44 } from '@framework/math/cubismmatrix44';
import { ACubismMotion } from '@framework/motion/acubismmotion';
import { csmVector } from '@framework/type/csmvector';

import * as LAppDefine from './lappdefine';
import { canvas } from './lappdelegate';
import { LAppModel } from './lappmodel';
import { LAppPal } from './lapppal';

export let s_instance: LAppLive2DManager = null;

/**
 *在示例应用程序中管理CubismModel的类
 *进行模型生成和废弃、轻敲事件的处理、模型切换。
 */
export class LAppLive2DManager {
  /**
   *返回类的实例（单个）。
   *如果未生成实例，则在内部生成实例。
   *
   *@return类实例
   */
  public static getInstance(): LAppLive2DManager {
    if (s_instance == null) {
      s_instance = new LAppLive2DManager();
    }

    return s_instance;
  }

  /**
   * 释放实例。
   */
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance = void 0;
    }

    s_instance = null;
  }

  /**
   *返回当前场景中保留的模型。
   *
   *@paramno模型列表中的索引值
   *@return返回模型的实例。如果索引值超出范围，则返回空值。
   */
  public getModel(no: number): LAppModel {
    if (no < this._models.getSize()) {
      return this._models.at(no);
    }

    return null;
  }

  /**
   * 释放当前场景中保留的所有模型
   */
  public releaseAllModel(): void {
    for (let i = 0; i < this._models.getSize(); i++) {
      this._models.at(i).release();
      this._models.set(i, null);
    }

    this._models.clear();
  }
  /**
   * 切换表情
   */
  public switchExpress(name: string): void {
    this.getModel(this._sceneIndex).setExpression(name);
  }
  /**
   * 唱歌时触发函数
   */
  public onSing(wav_path: string): void {
    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(`[APP] start sing ${wav_path}`);
    }
    this.getModel(this._sceneIndex).setSound(wav_path);
    this.getModel(this._sceneIndex).setExpression('唱');
  }
  /**
   * 说话时触发函数
   */
  public onSpeak(expression: string, wav_path: string): void {
    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(`[APP] start speak`);
    }
    this.getModel(this._sceneIndex).setSound(wav_path);
    this.getModel(this._sceneIndex).setExpression(expression);
  }

  public expression(expression: string): void {
    this.getModel(this._sceneIndex).setExpression(expression);
  }

  /**
   * 更新画面时的处理
   * 进行模型更新处理及描绘处理
   */
  public onUpdate(): void {
    const { width, height } = canvas;

    const modelCount: number = this._models.getSize();

    for (let i = 0; i < modelCount; ++i) {
      const projection: CubismMatrix44 = new CubismMatrix44();
      const model: LAppModel = this.getModel(i);

      if (model.getModel()) {
        if (model.getModel().getCanvasWidth() > 1.0 && width < height) {
          // 在纵向窗口中显示横向较长的模型时，根据模型的横向尺寸计算scale
          model.getModelMatrix().setWidth(2.0);
          projection.scale(1.0, width / height);
        } else {
          projection.scale(height / width, 1.0);
        }

        // 如果需要的话，在这里乘法
        if (this._viewMatrix != null) {
          projection.multiplyByMatrix(this._viewMatrix);
        }
      }

      model.update();
      model.draw(projection); // 因为是参照交货，所以projection会变质。
    }
  }

  /**
   * 切换到下一个场景
   * 在示例应用程序中切换模型集。
   */
  public nextScene(): void {
    const no: number = (this._sceneIndex + 1) % LAppDefine.ModelDirSize;
    this.changeScene(no);
  }

  /**
   * 切换场景
   * 在应用程序中切换模型集。
   */
  public changeScene(index: number): void {
    this._sceneIndex = index;
    if (LAppDefine.DebugLogEnable) {
      LAppPal.printMessage(`[APP]model index: ${this._sceneIndex}`);
    }

    // 从ModelDir[]中保留的目录名称
    // 确定model3.json的路径。
    // 使目录名与model3.json的名字一致。
    const model: string = LAppDefine.ModelDir[index];
    const modelPath: string = LAppDefine.ResourcesPath + model + '/';
    let modelJsonName: string = LAppDefine.ModelDir[index];
    modelJsonName += '.model3.json';
    this.releaseAllModel();
    this._models.pushBack(new LAppModel());
    this._models.at(0).loadAssets(modelPath, modelJsonName);
  }

  public setViewMatrix(m: CubismMatrix44) {
    for (let i = 0; i < 16; i++) {
      this._viewMatrix.getArray()[i] = m.getArray()[i];
    }
  }

  /**
   * 构造函数
   */
  constructor() {
    this._viewMatrix = new CubismMatrix44();
    this._models = new csmVector<LAppModel>();
    this._sceneIndex = 0;
    this.changeScene(this._sceneIndex);
  }

  _viewMatrix: CubismMatrix44; // 用于模型绘制的视图矩阵
  _models: csmVector<LAppModel>; // 模型实例容器
  _sceneIndex: number; // 要显示的场景索引值
  // 运动播放结束的回调函数
  _finishedMotion = (self: ACubismMotion): void => {
    LAppPal.printMessage('Motion Finished:');
    console.log(self);
  };
}
