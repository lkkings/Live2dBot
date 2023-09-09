/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismFramework, Option } from '@framework/live2dcubismframework';

import * as LAppDefine from './lappdefine';
import { LAppLive2DManager } from './lapplive2dmanager';
import { LAppPal } from './lapppal';
import { LAppTextureManager } from './lapptexturemanager';
import { LAppView } from './lappview';

export let canvas: HTMLCanvasElement = null;
export let s_instance: LAppDelegate = null;
export let gl: WebGLRenderingContext = null;
export let frameBuffer: WebGLFramebuffer = null;

/**
 * 聊天机器人。
 * 管理Cubism SDK。
 */
export class LAppDelegate {
  /**
   * 构造函数
   */
  constructor() {
    this._websocket = null;
    this._isEnd = false;
    this._cubismOption = new Option();
    this._view = new LAppView();
    this._textureManager = new LAppTextureManager();
    this._expression = '好';
  }
  /**
   *返回类的实例（单个）。
   *如果未生成实例，则在内部生成实例。
   *
   *@return类实例
   */
  public static getInstance(): LAppDelegate {
    if (s_instance == null) {
      s_instance = new LAppDelegate();
    }

    return s_instance;
  }

  /**
   * 释放类实例（单个）。
   */
  public static releaseInstance(): void {
    if (s_instance != null) {
      s_instance.release();
    }

    s_instance = null;
  }

  /**
   * 初始化APP所需的东西。
   */
  public initialize(): boolean {
    // 创建画布
    canvas = document.createElement('canvas');
    if (LAppDefine.CanvasSize === 'auto') {
      this._resizeCanvas();
    } else {
      canvas.width = LAppDefine.CanvasSize.width;
      canvas.height = LAppDefine.CanvasSize.height;
    }

    //初始化gl上下文
    //@ts-ignore
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      alert('Cannot initialize WebGL. This browser does not support.');
      gl = null;
      document.body.innerHTML =
        'This browser does not support the <code>&lt;canvas&gt;</code> element.';

      // gl初期化失敗
      return false;
    }

    // 将画布添加到DOM
    document.body.appendChild(canvas);

    if (!frameBuffer) {
      frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    }

    // 透明设置
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 初始化AppView
    this._view.initialize();

    // 初始化Cubism SDK
    this.initializeCubism();

    // 初始化websocket
    this.initWebSocket();

    return true;
  }

  /**
   * 调整画布大小并重新初始化视图。
   */
  public onResize(): void {
    this._resizeCanvas();
    this._view.initialize();
    this._view.initializeSprite();

    // 传递画布大小
    const viewport: number[] = [0, 0, canvas.width, canvas.height];

    gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
  }

  /**
   * 释放。
   */
  public release(): void {
    this._textureManager.release();
    this._textureManager = null;

    this._view.release();
    this._view = null;

    // 释放资源
    LAppLive2DManager.releaseInstance();

    // Cubism SDK释放
    CubismFramework.dispose();
  }

  /**
   * 执行处理。
   */
  public run(): void {
    // 主循环
    const loop = (): void => {
      // 确认是否存在实例
      if (s_instance == null) {
        return;
      }

      // 时间更新
      LAppPal.updateTime();

      // 画面初始化
      gl.clearColor(0.0, 0.0, 0.0, 1.0);

      // 启用深度
      gl.enable(gl.DEPTH_TEST);

      // 附近的物体会掩盖远处的物体
      gl.depthFunc(gl.LEQUAL);

      // 清除颜色缓冲区和深度缓冲区
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.clearDepth(1.0);

      // 透明设置
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // 画布更新
      this._view.render();

      // 循环的递归调用
      requestAnimationFrame(loop);
    };
    loop();
  }

  /**
   * 注册着色器。
   */
  public createShader(): WebGLProgram {
    // 编译条形着色器
    const vertexShaderId = gl.createShader(gl.VERTEX_SHADER);

    if (vertexShaderId == null) {
      LAppPal.printMessage('failed to create vertexShader');
      return null;
    }

    const vertexShader: string =
      'precision mediump float;' +
      'attribute vec3 position;' +
      'attribute vec2 uv;' +
      'varying vec2 vuv;' +
      'void main(void)' +
      '{' +
      '   gl_Position = vec4(position, 1.0);' +
      '   vuv = uv;' +
      '}';

    gl.shaderSource(vertexShaderId, vertexShader);
    gl.compileShader(vertexShaderId);

    // 编译碎片着色器
    const fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER);

    if (fragmentShaderId == null) {
      LAppPal.printMessage('failed to create fragmentShader');
      return null;
    }

    const fragmentShader: string =
      'precision mediump float;' +
      'varying vec2 vuv;' +
      'uniform sampler2D texture;' +
      'void main(void)' +
      '{' +
      '   gl_FragColor = texture2D(texture, vuv);' +
      '}';

    gl.shaderSource(fragmentShaderId, fragmentShader);
    gl.compileShader(fragmentShaderId);

    // 创建程序对象
    const programId = gl.createProgram();
    gl.attachShader(programId, vertexShaderId);
    gl.attachShader(programId, fragmentShaderId);

    gl.deleteShader(vertexShaderId);
    gl.deleteShader(fragmentShaderId);

    // 链接
    gl.linkProgram(programId);

    gl.useProgram(programId);

    return programId;
  }

  /**
   * 获取视图。
   */
  public getView(): LAppView {
    return this._view;
  }

  public getTextureManager(): LAppTextureManager {
    return this._textureManager;
  }

  /**
   * Cubism SDK初始化
   */
  public initializeCubism(): void {
    // setup cubism
    this._cubismOption.logFunction = LAppPal.printMessage;
    this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
    CubismFramework.startUp(this._cubismOption);

    // initialize cubism
    CubismFramework.initialize();

    // load model
    LAppLive2DManager.getInstance();

    LAppPal.updateTime();

    this._view.initializeSprite();
  }

  private initWebSocket(): void {
    const WebSocketUrl = window.prompt('请输入后端服务器socket地址：', 'ws://127.0.0.1:8000/bot');
    const audioQueue: string[] = [];
    //原声音频队列
    const vocalsQueue: string[] = [];
    //音乐音频队列
    const musicQueue: string[] = [];
    //因为要传输原声和音乐，这个用于区分
    let sign = true;
    let model = 0; //0为聊天模式，1为唱歌模式
    const audio = new Audio();
    //判断是否在说话
    let isplay = false;
    //语音监听定时器
    const speak_interval = setInterval(() => {
      if (audioQueue.length > 0 && !isplay) {
        const url = audioQueue.shift();
        audio.src = url;
        audio.addEventListener('loadstart', () => {
          isplay = true;
          LAppLive2DManager.getInstance().onSpeak(this._expression, url);
          audio.play();
        });
        audio.addEventListener('ended', () => {
          setTimeout(() => {
            isplay = false;
          }, 500);
        });
      }
    }, 100);
    const music_interval = setInterval(() => {
      if (musicQueue.length > 0 && !isplay) {
        const url = musicQueue.shift();
        const lip = vocalsQueue.shift();
        audio.src = url;
        audio.addEventListener('loadstart', () => {
          isplay = true;
          LAppLive2DManager.getInstance().onSing(lip);
          audio.play();
        });
        audio.addEventListener('ended', () => {
          isplay = false;
          if (musicQueue.length == 0) {
            LAppLive2DManager.getInstance().expression(this._expression);
          }
        });
      }
    }, 100);
    this._websocket = new WebSocket(WebSocketUrl);
    this._websocket.onopen = (): void => {
      if (LAppDefine.DebugLogEnable) {
        LAppPal.printMessage(`[APP] connect success !`);
      }
    };
    this._websocket.onmessage = (event): void => {
      if (typeof event.data === 'string') {
        if (event.data.startsWith('1000')) {
          const typingElement = document.getElementById('typingText');
          typingElement.innerHTML = '';
        } else if (event.data.startsWith('1001')) {
          this.hideStatusBox();
        } else if (event.data.startsWith('1002' || '1003')) {
          const typingElement = document.getElementById('typingText');
          typingElement.innerHTML = '';
          this._index = 0;
          this.typeText(event.data.substring(5));
        } else if (event.data.startsWith('1004')) {
          //标志着服务器正在返回歌声音频
          const typingElement = document.getElementById('typingText');
          typingElement.innerHTML = '';
          this._index = 0;
          this.typeText(event.data.substring(5));
          model = 1;
        } else if (event.data.startsWith('#')) {
          //标志着服务器准备返回聊天音频
          this.showStatusBox();
          this._index = 0;
          this.typeText(event.data.substring(1));
          model = 0;
        } else if (event.data.startsWith('$')) {
          this._expression = event.data.substring(1);
        }
      } else {
        const blob = new Blob([event.data], { type: 'audio/wav' });
        // 创建音频元素
        const url = URL.createObjectURL(blob);
        console.log('url', url);
        if (model == 0) {
          audioQueue.push(url);
        } else if (model == 1) {
          if (sign) {
            vocalsQueue.push(url);
            sign = false;
          } else {
            musicQueue.push(url);
            sign = true;
          }
        }
      }
    };
  }

  /**
   * 调整画布大小以填充屏幕.
   */
  private _resizeCanvas(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  /**
   * 打字效果
   */
  private typeText(text: string) {
    const typingElement = document.getElementById('typingText');
    if (this._index < text.length) {
      typingElement.innerHTML += text.charAt(this._index);
      this._index++;
      setTimeout(() => this.typeText(text), 100);
    }
  }

  private showStatusBox() {
    const statusBox = document.getElementById('statusBox');
    statusBox.classList.add('show');
  }

  private hideStatusBox() {
    const statusBox = document.getElementById('statusBox');
    statusBox.classList.remove('show');
  }

  private sendGetRequest(url: string): void {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
  }

  _index: number;
  _cubismOption: Option; // Cubism SDK Option
  _view: LAppView; // 视图
  _websocket: WebSocket; // 聊天接口
  _isEnd: boolean; // APP是否结束
  _textureManager: LAppTextureManager; // 纹理管理器
  _expression: string;
}
