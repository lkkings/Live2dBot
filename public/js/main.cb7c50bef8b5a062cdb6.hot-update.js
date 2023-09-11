"use strict";
self["webpackHotUpdatecocochatbot"]("main",{

/***/ "./src/lappdelegate.ts":
/*!*****************************!*\
  !*** ./src/lappdelegate.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LAppDelegate = exports.frameBuffer = exports.gl = exports.s_instance = exports.canvas = void 0;
const live2dcubismframework_1 = __webpack_require__(/*! @framework/live2dcubismframework */ "./Framework/src/live2dcubismframework.ts");
const LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/lappdefine.ts"));
const lapplive2dmanager_1 = __webpack_require__(/*! ./lapplive2dmanager */ "./src/lapplive2dmanager.ts");
const lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/lapppal.ts");
const lapptexturemanager_1 = __webpack_require__(/*! ./lapptexturemanager */ "./src/lapptexturemanager.ts");
const lappview_1 = __webpack_require__(/*! ./lappview */ "./src/lappview.ts");
exports.canvas = null;
exports.s_instance = null;
exports.gl = null;
exports.frameBuffer = null;
class LAppDelegate {
    constructor() {
        this._websocket = null;
        this._isEnd = false;
        this._cubismOption = new live2dcubismframework_1.Option();
        this._view = new lappview_1.LAppView();
        this._textureManager = new lapptexturemanager_1.LAppTextureManager();
        this._expression = '好';
    }
    static getInstance() {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppDelegate();
        }
        return exports.s_instance;
    }
    static releaseInstance() {
        if (exports.s_instance != null) {
            exports.s_instance.release();
        }
        exports.s_instance = null;
    }
    initialize() {
        exports.canvas = document.getElementById('canvas');
        if (LAppDefine.CanvasSize === 'auto') {
            this._resizeCanvas();
        }
        else {
            exports.canvas.width = LAppDefine.CanvasSize.width;
            exports.canvas.height = LAppDefine.CanvasSize.height;
        }
        exports.gl = exports.canvas.getContext('webgl') || exports.canvas.getContext('experimental-webgl');
        if (!exports.gl) {
            alert('Cannot initialize WebGL. This browser does not support.');
            exports.gl = null;
            document.body.innerHTML =
                'This browser does not support the <code>&lt;canvas&gt;</code> element.';
            return false;
        }
        document.body.appendChild(exports.canvas);
        if (!exports.frameBuffer) {
            exports.frameBuffer = exports.gl.getParameter(exports.gl.FRAMEBUFFER_BINDING);
        }
        exports.gl.enable(exports.gl.BLEND);
        exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
        this._view.initialize();
        this.initializeCubism();
        this.initWebSocket();
        return true;
    }
    onResize() {
        this._resizeCanvas();
        this._view.initialize();
        this._view.initializeSprite();
        const viewport = [0, 0, exports.canvas.width, exports.canvas.height];
        exports.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    }
    release() {
        this._textureManager.release();
        this._textureManager = null;
        this._view.release();
        this._view = null;
        lapplive2dmanager_1.LAppLive2DManager.releaseInstance();
        live2dcubismframework_1.CubismFramework.dispose();
    }
    run() {
        const loop = () => {
            if (exports.s_instance == null) {
                return;
            }
            lapppal_1.LAppPal.updateTime();
            exports.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            exports.gl.enable(exports.gl.DEPTH_TEST);
            exports.gl.depthFunc(exports.gl.LEQUAL);
            exports.gl.clear(exports.gl.COLOR_BUFFER_BIT | exports.gl.DEPTH_BUFFER_BIT);
            exports.gl.clearDepth(1.0);
            exports.gl.enable(exports.gl.BLEND);
            exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
            this._view.render();
            requestAnimationFrame(loop);
        };
        loop();
    }
    createShader() {
        const vertexShaderId = exports.gl.createShader(exports.gl.VERTEX_SHADER);
        if (vertexShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create vertexShader');
            return null;
        }
        const vertexShader = 'precision mediump float;' +
            'attribute vec3 position;' +
            'attribute vec2 uv;' +
            'varying vec2 vuv;' +
            'void main(void)' +
            '{' +
            '   gl_Position = vec4(position, 1.0);' +
            '   vuv = uv;' +
            '}';
        exports.gl.shaderSource(vertexShaderId, vertexShader);
        exports.gl.compileShader(vertexShaderId);
        const fragmentShaderId = exports.gl.createShader(exports.gl.FRAGMENT_SHADER);
        if (fragmentShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create fragmentShader');
            return null;
        }
        const fragmentShader = 'precision mediump float;' +
            'varying vec2 vuv;' +
            'uniform sampler2D texture;' +
            'void main(void)' +
            '{' +
            '   gl_FragColor = texture2D(texture, vuv);' +
            '}';
        exports.gl.shaderSource(fragmentShaderId, fragmentShader);
        exports.gl.compileShader(fragmentShaderId);
        const programId = exports.gl.createProgram();
        exports.gl.attachShader(programId, vertexShaderId);
        exports.gl.attachShader(programId, fragmentShaderId);
        exports.gl.deleteShader(vertexShaderId);
        exports.gl.deleteShader(fragmentShaderId);
        exports.gl.linkProgram(programId);
        exports.gl.useProgram(programId);
        return programId;
    }
    getView() {
        return this._view;
    }
    getTextureManager() {
        return this._textureManager;
    }
    initializeCubism() {
        this._cubismOption.logFunction = lapppal_1.LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        live2dcubismframework_1.CubismFramework.startUp(this._cubismOption);
        live2dcubismframework_1.CubismFramework.initialize();
        lapplive2dmanager_1.LAppLive2DManager.getInstance();
        lapppal_1.LAppPal.updateTime();
        this._view.initializeSprite();
    }
    initWebSocket() {
        const WebSocketUrl = window.prompt('请输入后端服务器socket地址：', 'ws://127.0.0.1:8000/bot');
        const audioQueue = [];
        const vocalsQueue = [];
        const musicQueue = [];
        let sign = true;
        let model = 0;
        const audio = new Audio();
        let isplay = false;
        const speak_interval = setInterval(() => {
            if (audioQueue.length > 0 && !isplay) {
                const url = audioQueue.shift();
                audio.src = url;
                audio.addEventListener('loadstart', () => {
                    isplay = true;
                    lapplive2dmanager_1.LAppLive2DManager.getInstance().onSpeak(this._expression, url);
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
                    lapplive2dmanager_1.LAppLive2DManager.getInstance().onSing(lip);
                    audio.play();
                });
                audio.addEventListener('ended', () => {
                    isplay = false;
                    if (musicQueue.length == 0) {
                        lapplive2dmanager_1.LAppLive2DManager.getInstance().expression(this._expression);
                    }
                });
            }
        }, 100);
        this._websocket = new WebSocket(WebSocketUrl);
        this._websocket.onopen = () => {
            if (LAppDefine.DebugLogEnable) {
                lapppal_1.LAppPal.printMessage(`[APP] connect success !`);
            }
        };
        this._websocket.onmessage = (event) => {
            if (typeof event.data === 'string') {
                if (event.data.startsWith('1000')) {
                    const typingElement = document.getElementById('typingText');
                    typingElement.innerHTML = '';
                }
                else if (event.data.startsWith('1001')) {
                    this.hideStatusBox();
                }
                else if (event.data.startsWith('1002' || 0)) {
                    const typingElement = document.getElementById('typingText');
                    typingElement.innerHTML = '';
                    this._index = 0;
                    this.typeText(event.data.substring(5));
                }
                else if (event.data.startsWith('1004')) {
                    const typingElement = document.getElementById('typingText');
                    typingElement.innerHTML = '';
                    this._index = 0;
                    this.typeText(event.data.substring(5));
                    model = 1;
                }
                else if (event.data.startsWith('#')) {
                    this.showStatusBox();
                    this._index = 0;
                    this.typeText(event.data.substring(1));
                    model = 0;
                }
                else if (event.data.startsWith('$')) {
                    this._expression = event.data.substring(1);
                }
            }
            else {
                const blob = new Blob([event.data], { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                console.log('url', url);
                if (model == 0) {
                    audioQueue.push(url);
                }
                else if (model == 1) {
                    if (sign) {
                        vocalsQueue.push(url);
                        sign = false;
                    }
                    else {
                        musicQueue.push(url);
                        sign = true;
                    }
                }
            }
        };
    }
    _resizeCanvas() {
        exports.canvas.width = window.innerWidth;
        exports.canvas.height = window.innerHeight;
    }
    typeText(text) {
        const typingElement = document.getElementById('typingText');
        if (this._index < text.length) {
            typingElement.innerHTML += text.charAt(this._index);
            this._index++;
            setTimeout(() => this.typeText(text), 100);
        }
    }
    showStatusBox() {
        const statusBox = document.getElementById('statusBox');
        statusBox.classList.add('show');
    }
    hideStatusBox() {
        const statusBox = document.getElementById('statusBox');
        statusBox.classList.remove('show');
    }
    sendGetRequest(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
    }
}
exports.LAppDelegate = LAppDelegate;


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "0e5d8df748487a8c4de2"; }
/******/ }();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jYjdjNTBiZWY4YjVhMDYyY2RiNi5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0Esd0lBQTJFO0FBRTNFLGdHQUEyQztBQUMzQyx5R0FBd0Q7QUFDeEQsMkVBQW9DO0FBQ3BDLDRHQUEwRDtBQUMxRCw4RUFBc0M7QUFFM0IsY0FBTSxHQUFzQixJQUFJLENBQUM7QUFDakMsa0JBQVUsR0FBaUIsSUFBSSxDQUFDO0FBQ2hDLFVBQUUsR0FBMEIsSUFBSSxDQUFDO0FBQ2pDLG1CQUFXLEdBQXFCLElBQUksQ0FBQztBQU1oRCxNQUFhLFlBQVk7SUFJdkI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksOEJBQU0sRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDekIsQ0FBQztJQU9NLE1BQU0sQ0FBQyxXQUFXO1FBQ3ZCLElBQUksa0JBQVUsSUFBSSxJQUFJLEVBQUU7WUFDdEIsa0JBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxrQkFBVSxDQUFDO0lBQ3BCLENBQUM7SUFLTSxNQUFNLENBQUMsZUFBZTtRQUMzQixJQUFJLGtCQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLGtCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDdEI7UUFFRCxrQkFBVSxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBS00sVUFBVTtRQUVmLGNBQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztRQUNoRSxJ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YnBhY2s6Ly9jb2NvY2hhdGJvdC8uL3NyYy9sYXBwZGVsZWdhdGUudHMiLCJ3ZWJwYWNrOi8vY29jb2NoYXRib3Qvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IEN1YmlzbUZyYW1ld29yaywgT3B0aW9uIH0gZnJvbSAnQGZyYW1ld29yay9saXZlMmRjdWJpc21mcmFtZXdvcmsnO1xuXG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5pbXBvcnQgeyBMQXBwTGl2ZTJETWFuYWdlciB9IGZyb20gJy4vbGFwcGxpdmUyZG1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5pbXBvcnQgeyBMQXBwVGV4dHVyZU1hbmFnZXIgfSBmcm9tICcuL2xhcHB0ZXh0dXJlbWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwVmlldyB9IGZyb20gJy4vbGFwcHZpZXcnO1xuXG5leHBvcnQgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBudWxsO1xuZXhwb3J0IGxldCBzX2luc3RhbmNlOiBMQXBwRGVsZWdhdGUgPSBudWxsO1xuZXhwb3J0IGxldCBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcbmV4cG9ydCBsZXQgZnJhbWVCdWZmZXI6IFdlYkdMRnJhbWVidWZmZXIgPSBudWxsO1xuXG4vKipcbiAqIOiBiuWkqeacuuWZqOS6uuOAglxuICog566h55CGQ3ViaXNtIFNES+OAglxuICovXG5leHBvcnQgY2xhc3MgTEFwcERlbGVnYXRlIHtcbiAgLyoqXG4gICAqIOaehOmAoOWHveaVsFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fd2Vic29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLl9pc0VuZCA9IGZhbHNlO1xuICAgIHRoaXMuX2N1YmlzbU9wdGlvbiA9IG5ldyBPcHRpb24oKTtcbiAgICB0aGlzLl92aWV3ID0gbmV3IExBcHBWaWV3KCk7XG4gICAgdGhpcy5fdGV4dHVyZU1hbmFnZXIgPSBuZXcgTEFwcFRleHR1cmVNYW5hZ2VyKCk7XG4gICAgdGhpcy5fZXhwcmVzc2lvbiA9ICflpb0nO1xuICB9XG4gIC8qKlxuICAgKui/lOWbnuexu+eahOWunuS+i++8iOWNleS4qu+8ieOAglxuICAgKuWmguaenOacqueUn+aIkOWunuS+i++8jOWImeWcqOWGhemDqOeUn+aIkOWunuS+i+OAglxuICAgKlxuICAgKkByZXR1cm7nsbvlrp7kvotcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogTEFwcERlbGVnYXRlIHtcbiAgICBpZiAoc19pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICBzX2luc3RhbmNlID0gbmV3IExBcHBEZWxlZ2F0ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzX2luc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIOmHiuaUvuexu+WunuS+i++8iOWNleS4qu+8ieOAglxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWxlYXNlSW5zdGFuY2UoKTogdm9pZCB7XG4gICAgaWYgKHNfaW5zdGFuY2UgIT0gbnVsbCkge1xuICAgICAgc19pbnN0YW5jZS5yZWxlYXNlKCk7XG4gICAgfVxuXG4gICAgc19pbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICog5Yid5aeL5YyWQVBQ5omA6ZyA55qE5Lic6KW/44CCXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiBib29sZWFuIHtcbiAgICAvLyDliJvlu7rnlLvluINcbiAgICBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgaWYgKExBcHBEZWZpbmUuQ2FudmFzU2l6ZSA9PT0gJ2F1dG8nKSB7XG4gICAgICB0aGlzLl9yZXNpemVDYW52YXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FudmFzLndpZHRoID0gTEFwcERlZmluZS5DYW52YXNTaXplLndpZHRoO1xuICAgICAgY2FudmFzLmhlaWdodCA9IExBcHBEZWZpbmUuQ2FudmFzU2l6ZS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLy/liJ3lp4vljJZnbOS4iuS4i+aWh1xuICAgIC8vQHRzLWlnbm9yZVxuICAgIGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJykgfHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuICAgIGlmICghZ2wpIHtcbiAgICAgIGFsZXJ0KCdDYW5ub3QgaW5pdGlhbGl6ZSBXZWJHTC4gVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQuJyk7XG4gICAgICBnbCA9IG51bGw7XG4gICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9XG4gICAgICAgICdUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgPGNvZGU+Jmx0O2NhbnZhcyZndDs8L2NvZGU+IGVsZW1lbnQuJztcblxuICAgICAgLy8gZ2zliJ3mnJ/ljJblpLHmlZdcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyDlsIbnlLvluIPmt7vliqDliLBET01cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cbiAgICBpZiAoIWZyYW1lQnVmZmVyKSB7XG4gICAgICBmcmFtZUJ1ZmZlciA9IGdsLmdldFBhcmFtZXRlcihnbC5GUkFNRUJVRkZFUl9CSU5ESU5HKTtcbiAgICB9XG5cbiAgICAvLyDpgI/mmI7orr7nva5cbiAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgIGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXG4gICAgLy8g5Yid5aeL5YyWQXBwVmlld1xuICAgIHRoaXMuX3ZpZXcuaW5pdGlhbGl6ZSgpO1xuXG4gICAgLy8g5Yid5aeL5YyWQ3ViaXNtIFNES1xuICAgIHRoaXMuaW5pdGlhbGl6ZUN1YmlzbSgpO1xuXG4gICAgLy8g5Yid5aeL5YyWd2Vic29ja2V0XG4gICAgdGhpcy5pbml0V2ViU29ja2V0KCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDosIPmlbTnlLvluIPlpKflsI/lubbph43mlrDliJ3lp4vljJbop4blm77jgIJcbiAgICovXG4gIHB1YmxpYyBvblJlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXNpemVDYW52YXMoKTtcbiAgICB0aGlzLl92aWV3LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLl92aWV3LmluaXRpYWxpemVTcHJpdGUoKTtcblxuICAgIC8vIOS8oOmAkueUu+W4g+Wkp+Wwj1xuICAgIGNvbnN0IHZpZXdwb3J0OiBudW1iZXJbXSA9IFswLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHRdO1xuXG4gICAgZ2wudmlld3BvcnQodmlld3BvcnRbMF0sIHZpZXdwb3J0WzFdLCB2aWV3cG9ydFsyXSwgdmlld3BvcnRbM10pO1xuICB9XG5cbiAgLyoqXG4gICAqIOmHiuaUvuOAglxuICAgKi9cbiAgcHVibGljIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fdGV4dHVyZU1hbmFnZXIucmVsZWFzZSgpO1xuICAgIHRoaXMuX3RleHR1cmVNYW5hZ2VyID0gbnVsbDtcblxuICAgIHRoaXMuX3ZpZXcucmVsZWFzZSgpO1xuICAgIHRoaXMuX3ZpZXcgPSBudWxsO1xuXG4gICAgLy8g6YeK5pS+6LWE5rqQXG4gICAgTEFwcExpdmUyRE1hbmFnZXIucmVsZWFzZUluc3RhbmNlKCk7XG5cbiAgICAvLyBDdWJpc20gU0RL6YeK5pS+XG4gICAgQ3ViaXNtRnJhbWV3b3JrLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmiafooYzlpITnkIbjgIJcbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG4gICAgLy8g5Li75b6q546vXG4gICAgY29uc3QgbG9vcCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIC8vIOehruiupOaYr+WQpuWtmOWcqOWunuS+i1xuICAgICAgaWYgKHNfaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIOaXtumXtOabtOaWsFxuICAgICAgTEFwcFBhbC51cGRhdGVUaW1lKCk7XG5cbiAgICAgIC8vIOeUu+mdouWIneWni+WMllxuICAgICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApO1xuXG4gICAgICAvLyDlkK/nlKjmt7HluqZcbiAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcblxuICAgICAgLy8g6ZmE6L+R55qE54mp5L2T5Lya5o6p55uW6L+c5aSE55qE54mp5L2TXG4gICAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcblxuICAgICAgLy8g5riF6Zmk6aKc6Imy57yT5Yay5Yy65ZKM5rex5bqm57yT5Yay5Yy6XG4gICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cbiAgICAgIGdsLmNsZWFyRGVwdGgoMS4wKTtcblxuICAgICAgLy8g6YCP5piO6K6+572uXG4gICAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgICAgZ2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cbiAgICAgIC8vIOeUu+W4g+abtOaWsFxuICAgICAgdGhpcy5fdmlldy5yZW5kZXIoKTtcblxuICAgICAgLy8g5b6q546v55qE6YCS5b2S6LCD55SoXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfTtcbiAgICBsb29wKCk7XG4gIH1cblxuICAvKipcbiAgICog5rOo5YaM552A6Imy5Zmo44CCXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlU2hhZGVyKCk6IFdlYkdMUHJvZ3JhbSB7XG4gICAgLy8g57yW6K+R5p2h5b2i552A6Imy5ZmoXG4gICAgY29uc3QgdmVydGV4U2hhZGVySWQgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUik7XG5cbiAgICBpZiAodmVydGV4U2hhZGVySWQgPT0gbnVsbCkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ2ZhaWxlZCB0byBjcmVhdGUgdmVydGV4U2hhZGVyJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXI6IHN0cmluZyA9XG4gICAgICAncHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7JyArXG4gICAgICAnYXR0cmlidXRlIHZlYzMgcG9zaXRpb247JyArXG4gICAgICAnYXR0cmlidXRlIHZlYzIgdXY7JyArXG4gICAgICAndmFyeWluZyB2ZWMyIHZ1djsnICtcbiAgICAgICd2b2lkIG1haW4odm9pZCknICtcbiAgICAgICd7JyArXG4gICAgICAnICAgZ2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAxLjApOycgK1xuICAgICAgJyAgIHZ1diA9IHV2OycgK1xuICAgICAgJ30nO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlcklkLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVySWQpO1xuXG4gICAgLy8g57yW6K+R56KO54mH552A6Imy5ZmoXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXJJZCA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xuXG4gICAgaWYgKGZyYWdtZW50U2hhZGVySWQgPT0gbnVsbCkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ2ZhaWxlZCB0byBjcmVhdGUgZnJhZ21lbnRTaGFkZXInKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgPVxuICAgICAgJ3ByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OycgK1xuICAgICAgJ3ZhcnlpbmcgdmVjMiB2dXY7JyArXG4gICAgICAndW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTsnICtcbiAgICAgICd2b2lkIG1haW4odm9pZCknICtcbiAgICAgICd7JyArXG4gICAgICAnICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIHZ1dik7JyArXG4gICAgICAnfSc7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXJJZCwgZnJhZ21lbnRTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXJJZCk7XG5cbiAgICAvLyDliJvlu7rnqIvluo/lr7nosaFcbiAgICBjb25zdCBwcm9ncmFtSWQgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1JZCwgdmVydGV4U2hhZGVySWQpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtSWQsIGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgZ2wuZGVsZXRlU2hhZGVyKHZlcnRleFNoYWRlcklkKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXJJZCk7XG5cbiAgICAvLyDpk77mjqVcbiAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtSWQpO1xuXG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtSWQpO1xuXG4gICAgcmV0dXJuIHByb2dyYW1JZDtcbiAgfVxuXG4gIC8qKlxuICAgKiDojrflj5bop4blm77jgIJcbiAgICovXG4gIHB1YmxpYyBnZXRWaWV3KCk6IExBcHBWaWV3IHtcbiAgICByZXR1cm4gdGhpcy5fdmlldztcbiAgfVxuXG4gIHB1YmxpYyBnZXRUZXh0dXJlTWFuYWdlcigpOiBMQXBwVGV4dHVyZU1hbmFnZXIge1xuICAgIHJldHVybiB0aGlzLl90ZXh0dXJlTWFuYWdlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdWJpc20gU0RL5Yid5aeL5YyWXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZUN1YmlzbSgpOiB2b2lkIHtcbiAgICAvLyBzZXR1cCBjdWJpc21cbiAgICB0aGlzLl9jdWJpc21PcHRpb24ubG9nRnVuY3Rpb24gPSBMQXBwUGFsLnByaW50TWVzc2FnZTtcbiAgICB0aGlzLl9jdWJpc21PcHRpb24ubG9nZ2luZ0xldmVsID0gTEFwcERlZmluZS5DdWJpc21Mb2dnaW5nTGV2ZWw7XG4gICAgQ3ViaXNtRnJhbWV3b3JrLnN0YXJ0VXAodGhpcy5fY3ViaXNtT3B0aW9uKTtcblxuICAgIC8vIGluaXRpYWxpemUgY3ViaXNtXG4gICAgQ3ViaXNtRnJhbWV3b3JrLmluaXRpYWxpemUoKTtcblxuICAgIC8vIGxvYWQgbW9kZWxcbiAgICBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXG4gICAgTEFwcFBhbC51cGRhdGVUaW1lKCk7XG5cbiAgICB0aGlzLl92aWV3LmluaXRpYWxpemVTcHJpdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFdlYlNvY2tldCgpOiB2b2lkIHtcbiAgICBjb25zdCBXZWJTb2NrZXRVcmwgPSB3aW5kb3cucHJvbXB0KCfor7fovpPlhaXlkI7nq6/mnI3liqHlmahzb2NrZXTlnLDlnYDvvJonLCAnd3M6Ly8xMjcuMC4wLjE6ODAwMC9ib3QnKTtcbiAgICBjb25zdCBhdWRpb1F1ZXVlOiBzdHJpbmdbXSA9IFtdO1xuICAgIC8v5Y6f5aOw6Z+z6aKR6Zif5YiXXG4gICAgY29uc3Qgdm9jYWxzUXVldWU6IHN0cmluZ1tdID0gW107XG4gICAgLy/pn7PkuZDpn7PpopHpmJ/liJdcbiAgICBjb25zdCBtdXNpY1F1ZXVlOiBzdHJpbmdbXSA9IFtdO1xuICAgIC8v5Zug5Li66KaB5Lyg6L6T5Y6f5aOw5ZKM6Z+z5LmQ77yM6L+Z5Liq55So5LqO5Yy65YiGXG4gICAgbGV0IHNpZ24gPSB0cnVlO1xuICAgIGxldCBtb2RlbCA9IDA7IC8vMOS4uuiBiuWkqeaooeW8j++8jDHkuLrllLHmrYzmqKHlvI9cbiAgICBjb25zdCBhdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIC8v5Yik5pat5piv5ZCm5Zyo6K+06K+dXG4gICAgbGV0IGlzcGxheSA9IGZhbHNlO1xuICAgIC8v6K+t6Z+z55uR5ZCs5a6a5pe25ZmoXG4gICAgY29uc3Qgc3BlYWtfaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoYXVkaW9RdWV1ZS5sZW5ndGggPiAwICYmICFpc3BsYXkpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYXVkaW9RdWV1ZS5zaGlmdCgpO1xuICAgICAgICBhdWRpby5zcmMgPSB1cmw7XG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRzdGFydCcsICgpID0+IHtcbiAgICAgICAgICBpc3BsYXkgPSB0cnVlO1xuICAgICAgICAgIExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCkub25TcGVhayh0aGlzLl9leHByZXNzaW9uLCB1cmwpO1xuICAgICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaXNwbGF5ID0gZmFsc2U7XG4gICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgICBjb25zdCBtdXNpY19pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmIChtdXNpY1F1ZXVlLmxlbmd0aCA+IDAgJiYgIWlzcGxheSkge1xuICAgICAgICBjb25zdCB1cmwgPSBtdXNpY1F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIGNvbnN0IGxpcCA9IHZvY2Fsc1F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIGF1ZGlvLnNyYyA9IHVybDtcbiAgICAgICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZHN0YXJ0JywgKCkgPT4ge1xuICAgICAgICAgIGlzcGxheSA9IHRydWU7XG4gICAgICAgICAgTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5vblNpbmcobGlwKTtcbiAgICAgICAgICBhdWRpby5wbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBhdWRpby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgICAgICBpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAobXVzaWNRdWV1ZS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5leHByZXNzaW9uKHRoaXMuX2V4cHJlc3Npb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgICB0aGlzLl93ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KFdlYlNvY2tldFVybCk7XG4gICAgdGhpcy5fd2Vic29ja2V0Lm9ub3BlbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmIChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSB7XG4gICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbQVBQXSBjb25uZWN0IHN1Y2Nlc3MgIWApO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5fd2Vic29ja2V0Lm9ubWVzc2FnZSA9IChldmVudCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBldmVudC5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoZXZlbnQuZGF0YS5zdGFydHNXaXRoKCcxMDAwJykpIHtcbiAgICAgICAgICBjb25zdCB0eXBpbmdFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R5cGluZ1RleHQnKTtcbiAgICAgICAgICB0eXBpbmdFbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGEuc3RhcnRzV2l0aCgnMTAwMScpKSB7XG4gICAgICAgICAgdGhpcy5oaWRlU3RhdHVzQm94KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdGFydHNXaXRoKCcxMDAyJyB8fCAnMTAwMycpKSB7XG4gICAgICAgICAgY29uc3QgdHlwaW5nRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0eXBpbmdUZXh0Jyk7XG4gICAgICAgICAgdHlwaW5nRWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICB0aGlzLl9pbmRleCA9IDA7XG4gICAgICAgICAgdGhpcy50eXBlVGV4dChldmVudC5kYXRhLnN1YnN0cmluZyg1KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdGFydHNXaXRoKCcxMDA0JykpIHtcbiAgICAgICAgICAvL+agh+W/l+edgOacjeWKoeWZqOato+WcqOi/lOWbnuatjOWjsOmfs+mikVxuICAgICAgICAgIGNvbnN0IHR5cGluZ0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHlwaW5nVGV4dCcpO1xuICAgICAgICAgIHR5cGluZ0VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgdGhpcy5faW5kZXggPSAwO1xuICAgICAgICAgIHRoaXMudHlwZVRleHQoZXZlbnQuZGF0YS5zdWJzdHJpbmcoNSkpO1xuICAgICAgICAgIG1vZGVsID0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgIC8v5qCH5b+X552A5pyN5Yqh5Zmo5YeG5aSH6L+U5Zue6IGK5aSp6Z+z6aKRXG4gICAgICAgICAgdGhpcy5zaG93U3RhdHVzQm94KCk7XG4gICAgICAgICAgdGhpcy5faW5kZXggPSAwO1xuICAgICAgICAgIHRoaXMudHlwZVRleHQoZXZlbnQuZGF0YS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgIG1vZGVsID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb24gPSBldmVudC5kYXRhLnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtldmVudC5kYXRhXSwgeyB0eXBlOiAnYXVkaW8vd2F2JyB9KTtcbiAgICAgICAgLy8g5Yib5bu66Z+z6aKR5YWD57SgXG4gICAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1cmwnLCB1cmwpO1xuICAgICAgICBpZiAobW9kZWwgPT0gMCkge1xuICAgICAgICAgIGF1ZGlvUXVldWUucHVzaCh1cmwpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGVsID09IDEpIHtcbiAgICAgICAgICBpZiAoc2lnbikge1xuICAgICAgICAgICAgdm9jYWxzUXVldWUucHVzaCh1cmwpO1xuICAgICAgICAgICAgc2lnbiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtdXNpY1F1ZXVlLnB1c2godXJsKTtcbiAgICAgICAgICAgIHNpZ24gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog6LCD5pW055S75biD5aSn5bCP5Lul5aGr5YWF5bGP5bmVLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzaXplQ2FudmFzKCk6IHZvaWQge1xuICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH1cbiAgLyoqXG4gICAqIOaJk+Wtl+aViOaenFxuICAgKi9cbiAgcHJpdmF0ZSB0eXBlVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICBjb25zdCB0eXBpbmdFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R5cGluZ1RleHQnKTtcbiAgICBpZiAodGhpcy5faW5kZXggPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgdHlwaW5nRWxlbWVudC5pbm5lckhUTUwgKz0gdGV4dC5jaGFyQXQodGhpcy5faW5kZXgpO1xuICAgICAgdGhpcy5faW5kZXgrKztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy50eXBlVGV4dCh0ZXh0KSwgMTAwKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNob3dTdGF0dXNCb3goKSB7XG4gICAgY29uc3Qgc3RhdHVzQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1c0JveCcpO1xuICAgIHN0YXR1c0JveC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVTdGF0dXNCb3goKSB7XG4gICAgY29uc3Qgc3RhdHVzQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1c0JveCcpO1xuICAgIHN0YXR1c0JveC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gIH1cblxuICBwcml2YXRlIHNlbmRHZXRSZXF1ZXN0KHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgeGhyLnNlbmQoKTtcbiAgfVxuXG4gIF9pbmRleDogbnVtYmVyO1xuICBfY3ViaXNtT3B0aW9uOiBPcHRpb247IC8vIEN1YmlzbSBTREsgT3B0aW9uXG4gIF92aWV3OiBMQXBwVmlldzsgLy8g6KeG5Zu+XG4gIF93ZWJzb2NrZXQ6IFdlYlNvY2tldDsgLy8g6IGK5aSp5o6l5Y+jXG4gIF9pc0VuZDogYm9vbGVhbjsgLy8gQVBQ5piv5ZCm57uT5p2fXG4gIF90ZXh0dXJlTWFuYWdlcjogTEFwcFRleHR1cmVNYW5hZ2VyOyAvLyDnurnnkIbnrqHnkIblmahcbiAgX2V4cHJlc3Npb246IHN0cmluZztcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gXCIwZTVkOGRmNzQ4NDg3YThjNGRlMlwiOyB9Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9