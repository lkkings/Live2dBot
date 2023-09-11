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
        const host = window.prompt('请输入后端服务器地址：', '127.0.0.1:8000');
        const WebSocketUrl = `ws://${host}/bot`;
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
                    if (musicQueue.length == 0) {
                        this.sendGetRequest(`http://${host}/ok`);
                    }
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
                        this.sendGetRequest(`http://${host}/ok`);
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
/******/ 	__webpack_require__.h = function() { return "734e600ca7c5a8561c85"; }
/******/ }();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5mN2JiYWQ3MzMyYmQ2YzAzYmU1Ni5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0Esd0lBQTJFO0FBRTNFLGdHQUEyQztBQUMzQyx5R0FBd0Q7QUFDeEQsMkVBQW9DO0FBQ3BDLDRHQUEwRDtBQUMxRCw4RUFBc0M7QUFFM0IsY0FBTSxHQUFzQixJQUFJLENBQUM7QUFDakMsa0JBQVUsR0FBaUIsSUFBSSxDQUFDO0FBQ2hDLFVBQUUsR0FBMEIsSUFBSSxDQUFDO0FBQ2pDLG1CQUFXLEdBQXFCLElBQUksQ0FBQztBQU1oRCxNQUFhLFlBQVk7SUFJdkI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksOEJBQU0sRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDekIsQ0FBQztJQU9NLE1BQU0sQ0FBQyxXQUFXO1FBQ3ZCLElBQUksa0JBQVUsSUFBSSxJQUFJLEVBQUU7WUFDdEIsa0JBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxrQkFBVSxDQUFDO0lBQ3BCLENBQUM7SUFLTSxNQUFNLENBQUMsZUFBZTtRQUMzQixJQUFJLGtCQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLGtCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDdEI7UUFFRCxrQkFBVSxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBS00sVUFBVTtRQUVmLGNBQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztRQUNoRSxJQUFJLFVBQVUsQ0FBQyxVQUFVLEtBQUssTUFBTSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjthQUFNO1lBQ0wsb0JBQVksR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUMzQyxxQkFBYSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQzlDO1FBSUQsVUFBRSxHQUFHLGNBQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksY0FBTSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxVQUFFLEVBQUU7WUFDUCxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztZQUNqRSxVQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ1YsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTO2dCQUNyQix3RUFBd0UsQ0FBQztZQUczRSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBR0QsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBTSxDQUFDLENBQUM7UUFFbEMsSUFBSSxDQUFDLG1CQUFXLEVBQUU7WUFDaEIsbUJBQVcsR0FBRyxVQUFFLENBQUMsWUFBWSxDQUFDLFVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3ZEO1FBR0QsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsVUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFFLENBQUMsU0FBUyxFQUFFLFVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBR25ELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFHeEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFHeEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUtNLFFBQVE7UUFDYixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFHOUIsTUFBTSxRQUFRLEdBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGNBQU0sQ0FBQyxLQUFLLEVBQUUsY0FBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9ELFVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUtNLE9BQU87UUFDWixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBRTVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFHbEIscUNBQWlCLENBQUMsZUFBZSxFQUFFLENBQUM7UUFHcEMsdUNBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBS00sR0FBRztRQUVSLE1BQU0sSUFBSSxHQUFHLEdBQVMsRUFBRTtZQUV0QixJQUFJLGtCQUFVLElBQUksSUFBSSxFQUFFO2dCQUN0QixPQUFPO2FBQ1I7WUFHRCxpQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBR3JCLFVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFHbEMsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7WUFHekIsVUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFHeEIsVUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFFLENBQUMsZ0JBQWdCLEdBQUcsVUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFcEQsVUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUduQixVQUFFLENBQUMsTUFBTSxDQUFDLFVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixVQUFFLENBQUMsU0FBUyxDQUFDLFVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFHbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUdwQixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUM7UUFDRixJQUFJLEVBQUUsQ0FBQztJQUNULENBQUM7SUFLTSxZQUFZO1FBRWpCLE1BQU0sY0FBYyxHQUFHLFVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXpELElBQUksY0FBYyxJQUFJLElBQUksRUFBRTtZQUMxQixpQkFBTyxDQUFDLFlBQVksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQ3RELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLFlBQVksR0FDaEIsMEJBQTBCO1lBQzFCLDBCQUEwQjtZQUMxQixvQkFBb0I7WUFDcEIsbUJBQW1CO1lBQ25CLGlCQUFpQjtZQUNqQixHQUFHO1lBQ0gsdUNBQXVDO1lBQ3ZDLGNBQWM7WUFDZCxHQUFHLENBQUM7UUFFTixVQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUM5QyxVQUFFLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBR2pDLE1BQU0sZ0JBQWdCLEdBQUcsVUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFFLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFN0QsSUFBSSxnQkFBZ0IsSUFBSSxJQUFJLEVBQUU7WUFDNUIsaUJBQU8sQ0FBQyxZQUFZLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUN4RCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsTUFBTSxjQUFjLEdBQ2xCLDBCQUEwQjtZQUMxQixtQkFBbUI7WUFDbkIsNEJBQTRCO1lBQzVCLGlCQUFpQjtZQUNqQixHQUFHO1lBQ0gsNENBQTRDO1lBQzVDLEdBQUcsQ0FBQztRQUVOLFVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDbEQsVUFBRSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBR25DLE1BQU0sU0FBUyxHQUFHLFVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQyxVQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMzQyxVQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRTdDLFVBQUUsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEMsVUFBRSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBR2xDLFVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFMUIsVUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV6QixPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBS00sT0FBTztRQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRU0saUJBQWlCO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBS00sZ0JBQWdCO1FBRXJCLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLGlCQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3RELElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztRQUNoRSx1Q0FBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFHNUMsdUNBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUc3QixxQ0FBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVoQyxpQkFBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRU8sYUFBYTtRQUNuQixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVELE1BQU0sWUFBWSxHQUFHLFFBQVEsSUFBSSxNQUFNLENBQUM7UUFDeEMsTUFBTSxVQUFVLEdBQWEsRUFBRSxDQUFDO1FBRWhDLE1BQU0sV0FBVyxHQUFhLEVBQUUsQ0FBQztRQUVqQyxNQUFNLFVBQVUsR0FBYSxFQUFFLENBQUM7UUFFaEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFFMUIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRW5CLE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDdEMsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDcEMsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMvQixLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztnQkFDaEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7b0JBQ3ZDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2QscUNBQWlCLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQy9ELEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQztnQkFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFDbkMsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDZCxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUNqQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ1IsSUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTt3QkFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO3FCQUN6QztnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1IsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUN0QyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNwQyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDaEMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Z0JBQ2hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO29CQUN2QyxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNkLHFDQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDNUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLENBQUMsQ0FBQyxDQUFDO2dCQUNILEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNuQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUNmLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7d0JBQzFCLHFDQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQzdELElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztxQkFDekM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNSLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBUyxFQUFFO1lBQ2xDLElBQUksVUFBVSxDQUFDLGNBQWMsRUFBRTtnQkFDN0IsaUJBQU8sQ0FBQyxZQUFZLENBQUMseUJBQXlCLENBQUMsQ0FBQzthQUNqRDtRQUNILENBQUMsQ0FBQztRQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFRLEVBQUU7WUFDMUMsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUNsQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNqQyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUM1RCxhQUFhLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztpQkFDOUI7cUJBQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDeEMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN0QjtxQkFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFNLENBQUMsRUFBRTtvQkFDbEQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDNUQsYUFBYSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3hDO3FCQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBRXhDLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzVELGFBQWEsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO29CQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2lCQUNYO3FCQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBRXJDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsS0FBSyxHQUFHLENBQUMsQ0FBQztpQkFDWDtxQkFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNyQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM1QzthQUNGO2lCQUFNO2dCQUNMLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBRTNELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7b0JBQ2QsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEI7cUJBQU0sSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO29CQUNyQixJQUFJLElBQUksRUFBRTt3QkFDUixXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUN0QixJQUFJLEdBQUcsS0FBSyxDQUFDO3FCQUNkO3lCQUFNO3dCQUNMLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3JCLElBQUksR0FBRyxJQUFJLENBQUM7cUJBQ2I7aUJBQ0Y7YUFDRjtRQUNILENBQUMsQ0FBQztJQUNKLENBQUM7SUFLTyxhQUFhO1FBQ25CLG9CQUFZLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxxQkFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDckMsQ0FBQztJQUlPLFFBQVEsQ0FBQyxJQUFZO1FBQzNCLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUQsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDN0IsYUFBYSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUM7SUFFTyxhQUFhO1FBQ25CLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVPLGFBQWE7UUFDbkIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2RCxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRU8sY0FBYyxDQUFDLEdBQVc7UUFDaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDYixDQUFDO0NBU0Y7QUFoWkQsb0NBZ1pDOzs7Ozs7Ozs7VUN4YUQscUNBQXFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29jb2NoYXRib3QvLi9zcmMvbGFwcGRlbGVnYXRlLnRzIiwid2VicGFjazovL2NvY29jaGF0Ym90L3dlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBDdWJpc21GcmFtZXdvcmssIE9wdGlvbiB9IGZyb20gJ0BmcmFtZXdvcmsvbGl2ZTJkY3ViaXNtZnJhbWV3b3JrJztcblxuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuaW1wb3J0IHsgTEFwcExpdmUyRE1hbmFnZXIgfSBmcm9tICcuL2xhcHBsaXZlMmRtYW5hZ2VyJztcbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0IHsgTEFwcFRleHR1cmVNYW5hZ2VyIH0gZnJvbSAnLi9sYXBwdGV4dHVyZW1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcFZpZXcgfSBmcm9tICcuL2xhcHB2aWV3JztcblxuZXhwb3J0IGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gbnVsbDtcbmV4cG9ydCBsZXQgc19pbnN0YW5jZTogTEFwcERlbGVnYXRlID0gbnVsbDtcbmV4cG9ydCBsZXQgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG5leHBvcnQgbGV0IGZyYW1lQnVmZmVyOiBXZWJHTEZyYW1lYnVmZmVyID0gbnVsbDtcblxuLyoqXG4gKiDogYrlpKnmnLrlmajkurrjgIJcbiAqIOeuoeeQhkN1YmlzbSBTREvjgIJcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBEZWxlZ2F0ZSB7XG4gIC8qKlxuICAgKiDmnoTpgKDlh73mlbBcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3dlYnNvY2tldCA9IG51bGw7XG4gICAgdGhpcy5faXNFbmQgPSBmYWxzZTtcbiAgICB0aGlzLl9jdWJpc21PcHRpb24gPSBuZXcgT3B0aW9uKCk7XG4gICAgdGhpcy5fdmlldyA9IG5ldyBMQXBwVmlldygpO1xuICAgIHRoaXMuX3RleHR1cmVNYW5hZ2VyID0gbmV3IExBcHBUZXh0dXJlTWFuYWdlcigpO1xuICAgIHRoaXMuX2V4cHJlc3Npb24gPSAn5aW9JztcbiAgfVxuICAvKipcbiAgICrov5Tlm57nsbvnmoTlrp7kvovvvIjljZXkuKrvvInjgIJcbiAgICrlpoLmnpzmnKrnlJ/miJDlrp7kvovvvIzliJnlnKjlhoXpg6jnlJ/miJDlrp7kvovjgIJcbiAgICpcbiAgICpAcmV0dXJu57G75a6e5L6LXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IExBcHBEZWxlZ2F0ZSB7XG4gICAgaWYgKHNfaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgc19pbnN0YW5jZSA9IG5ldyBMQXBwRGVsZWdhdGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc19pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDph4rmlL7nsbvlrp7kvovvvIjljZXkuKrvvInjgIJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVsZWFzZUluc3RhbmNlKCk6IHZvaWQge1xuICAgIGlmIChzX2luc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UucmVsZWFzZSgpO1xuICAgIH1cblxuICAgIHNfaW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOWIneWni+WMlkFQUOaJgOmcgOeahOS4nOilv+OAglxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemUoKTogYm9vbGVhbiB7XG4gICAgLy8g5Yib5bu655S75biDXG4gICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGlmIChMQXBwRGVmaW5lLkNhbnZhc1NpemUgPT09ICdhdXRvJykge1xuICAgICAgdGhpcy5fcmVzaXplQ2FudmFzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbnZhcy53aWR0aCA9IExBcHBEZWZpbmUuQ2FudmFzU2l6ZS53aWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBMQXBwRGVmaW5lLkNhbnZhc1NpemUuaGVpZ2h0O1xuICAgIH1cblxuICAgIC8v5Yid5aeL5YyWZ2zkuIrkuIvmlodcbiAgICAvL0B0cy1pZ25vcmVcbiAgICBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcbiAgICBpZiAoIWdsKSB7XG4gICAgICBhbGVydCgnQ2Fubm90IGluaXRpYWxpemUgV2ViR0wuIFRoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0LicpO1xuICAgICAgZ2wgPSBudWxsO1xuICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPVxuICAgICAgICAnVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlIDxjb2RlPiZsdDtjYW52YXMmZ3Q7PC9jb2RlPiBlbGVtZW50Lic7XG5cbiAgICAgIC8vIGds5Yid5pyf5YyW5aSx5pWXXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8g5bCG55S75biD5re75Yqg5YiwRE9NXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xuXG4gICAgaWYgKCFmcmFtZUJ1ZmZlcikge1xuICAgICAgZnJhbWVCdWZmZXIgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuRlJBTUVCVUZGRVJfQklORElORyk7XG4gICAgfVxuXG4gICAgLy8g6YCP5piO6K6+572uXG4gICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcbiAgICBnbC5ibGVuZEZ1bmMoZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblxuICAgIC8vIOWIneWni+WMlkFwcFZpZXdcbiAgICB0aGlzLl92aWV3LmluaXRpYWxpemUoKTtcblxuICAgIC8vIOWIneWni+WMlkN1YmlzbSBTREtcbiAgICB0aGlzLmluaXRpYWxpemVDdWJpc20oKTtcblxuICAgIC8vIOWIneWni+WMlndlYnNvY2tldFxuICAgIHRoaXMuaW5pdFdlYlNvY2tldCgpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICog6LCD5pW055S75biD5aSn5bCP5bm26YeN5paw5Yid5aeL5YyW6KeG5Zu+44CCXG4gICAqL1xuICBwdWJsaWMgb25SZXNpemUoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVzaXplQ2FudmFzKCk7XG4gICAgdGhpcy5fdmlldy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5fdmlldy5pbml0aWFsaXplU3ByaXRlKCk7XG5cbiAgICAvLyDkvKDpgJLnlLvluIPlpKflsI9cbiAgICBjb25zdCB2aWV3cG9ydDogbnVtYmVyW10gPSBbMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0XTtcblxuICAgIGdsLnZpZXdwb3J0KHZpZXdwb3J0WzBdLCB2aWV3cG9ydFsxXSwgdmlld3BvcnRbMl0sIHZpZXdwb3J0WzNdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDph4rmlL7jgIJcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIHRoaXMuX3RleHR1cmVNYW5hZ2VyLnJlbGVhc2UoKTtcbiAgICB0aGlzLl90ZXh0dXJlTWFuYWdlciA9IG51bGw7XG5cbiAgICB0aGlzLl92aWV3LnJlbGVhc2UoKTtcbiAgICB0aGlzLl92aWV3ID0gbnVsbDtcblxuICAgIC8vIOmHiuaUvui1hOa6kFxuICAgIExBcHBMaXZlMkRNYW5hZ2VyLnJlbGVhc2VJbnN0YW5jZSgpO1xuXG4gICAgLy8gQ3ViaXNtIFNES+mHiuaUvlxuICAgIEN1YmlzbUZyYW1ld29yay5kaXNwb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICog5omn6KGM5aSE55CG44CCXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIC8vIOS4u+W+queOr1xuICAgIGNvbnN0IGxvb3AgPSAoKTogdm9pZCA9PiB7XG4gICAgICAvLyDnoa7orqTmmK/lkKblrZjlnKjlrp7kvotcbiAgICAgIGlmIChzX2luc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyDml7bpl7Tmm7TmlrBcbiAgICAgIExBcHBQYWwudXBkYXRlVGltZSgpO1xuXG4gICAgICAvLyDnlLvpnaLliJ3lp4vljJZcbiAgICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTtcblxuICAgICAgLy8g5ZCv55So5rex5bqmXG4gICAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XG5cbiAgICAgIC8vIOmZhOi/keeahOeJqeS9k+S8muaOqeeblui/nOWkhOeahOeJqeS9k1xuICAgICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XG5cbiAgICAgIC8vIOa4hemZpOminOiJsue8k+WGsuWMuuWSjOa3seW6pue8k+WGsuWMulxuICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG4gICAgICBnbC5jbGVhckRlcHRoKDEuMCk7XG5cbiAgICAgIC8vIOmAj+aYjuiuvue9rlxuICAgICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcbiAgICAgIGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXG4gICAgICAvLyDnlLvluIPmm7TmlrBcbiAgICAgIHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cbiAgICAgIC8vIOW+queOr+eahOmAkuW9kuiwg+eUqFxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH07XG4gICAgbG9vcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOazqOWGjOedgOiJsuWZqOOAglxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcigpOiBXZWJHTFByb2dyYW0ge1xuICAgIC8vIOe8luivkeadoeW9ouedgOiJsuWZqFxuICAgIGNvbnN0IHZlcnRleFNoYWRlcklkID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuXG4gICAgaWYgKHZlcnRleFNoYWRlcklkID09IG51bGwpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCdmYWlsZWQgdG8gY3JlYXRlIHZlcnRleFNoYWRlcicpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdmVydGV4U2hhZGVyOiBzdHJpbmcgPVxuICAgICAgJ3ByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OycgK1xuICAgICAgJ2F0dHJpYnV0ZSB2ZWMzIHBvc2l0aW9uOycgK1xuICAgICAgJ2F0dHJpYnV0ZSB2ZWMyIHV2OycgK1xuICAgICAgJ3ZhcnlpbmcgdmVjMiB2dXY7JyArXG4gICAgICAndm9pZCBtYWluKHZvaWQpJyArXG4gICAgICAneycgK1xuICAgICAgJyAgIGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMS4wKTsnICtcbiAgICAgICcgICB2dXYgPSB1djsnICtcbiAgICAgICd9JztcblxuICAgIGdsLnNoYWRlclNvdXJjZSh2ZXJ0ZXhTaGFkZXJJZCwgdmVydGV4U2hhZGVyKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKHZlcnRleFNoYWRlcklkKTtcblxuICAgIC8vIOe8luivkeeijueJh+edgOiJsuWZqFxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVySWQgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuICAgIGlmIChmcmFnbWVudFNoYWRlcklkID09IG51bGwpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCdmYWlsZWQgdG8gY3JlYXRlIGZyYWdtZW50U2hhZGVyJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBmcmFnbWVudFNoYWRlcjogc3RyaW5nID1cbiAgICAgICdwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsnICtcbiAgICAgICd2YXJ5aW5nIHZlYzIgdnV2OycgK1xuICAgICAgJ3VuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmU7JyArXG4gICAgICAndm9pZCBtYWluKHZvaWQpJyArXG4gICAgICAneycgK1xuICAgICAgJyAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh0ZXh0dXJlLCB2dXYpOycgK1xuICAgICAgJ30nO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKGZyYWdtZW50U2hhZGVySWQsIGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgLy8g5Yib5bu656iL5bqP5a+56LGhXG4gICAgY29uc3QgcHJvZ3JhbUlkID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtSWQsIHZlcnRleFNoYWRlcklkKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbUlkLCBmcmFnbWVudFNoYWRlcklkKTtcblxuICAgIGdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXJJZCk7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgLy8g6ZO+5o6lXG4gICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbUlkKTtcblxuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbUlkKTtcblxuICAgIHJldHVybiBwcm9ncmFtSWQ7XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W6KeG5Zu+44CCXG4gICAqL1xuICBwdWJsaWMgZ2V0VmlldygpOiBMQXBwVmlldyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXc7XG4gIH1cblxuICBwdWJsaWMgZ2V0VGV4dHVyZU1hbmFnZXIoKTogTEFwcFRleHR1cmVNYW5hZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5fdGV4dHVyZU1hbmFnZXI7XG4gIH1cblxuICAvKipcbiAgICogQ3ViaXNtIFNES+WIneWni+WMllxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemVDdWJpc20oKTogdm9pZCB7XG4gICAgLy8gc2V0dXAgY3ViaXNtXG4gICAgdGhpcy5fY3ViaXNtT3B0aW9uLmxvZ0Z1bmN0aW9uID0gTEFwcFBhbC5wcmludE1lc3NhZ2U7XG4gICAgdGhpcy5fY3ViaXNtT3B0aW9uLmxvZ2dpbmdMZXZlbCA9IExBcHBEZWZpbmUuQ3ViaXNtTG9nZ2luZ0xldmVsO1xuICAgIEN1YmlzbUZyYW1ld29yay5zdGFydFVwKHRoaXMuX2N1YmlzbU9wdGlvbik7XG5cbiAgICAvLyBpbml0aWFsaXplIGN1YmlzbVxuICAgIEN1YmlzbUZyYW1ld29yay5pbml0aWFsaXplKCk7XG5cbiAgICAvLyBsb2FkIG1vZGVsXG4gICAgTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuICAgIExBcHBQYWwudXBkYXRlVGltZSgpO1xuXG4gICAgdGhpcy5fdmlldy5pbml0aWFsaXplU3ByaXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGluaXRXZWJTb2NrZXQoKTogdm9pZCB7XG4gICAgY29uc3QgaG9zdCA9IHdpbmRvdy5wcm9tcHQoJ+ivt+i+k+WFpeWQjuerr+acjeWKoeWZqOWcsOWdgO+8micsICcxMjcuMC4wLjE6ODAwMCcpO1xuICAgIGNvbnN0IFdlYlNvY2tldFVybCA9IGB3czovLyR7aG9zdH0vYm90YDtcbiAgICBjb25zdCBhdWRpb1F1ZXVlOiBzdHJpbmdbXSA9IFtdO1xuICAgIC8v5Y6f5aOw6Z+z6aKR6Zif5YiXXG4gICAgY29uc3Qgdm9jYWxzUXVldWU6IHN0cmluZ1tdID0gW107XG4gICAgLy/pn7PkuZDpn7PpopHpmJ/liJdcbiAgICBjb25zdCBtdXNpY1F1ZXVlOiBzdHJpbmdbXSA9IFtdO1xuICAgIC8v5Zug5Li66KaB5Lyg6L6T5Y6f5aOw5ZKM6Z+z5LmQ77yM6L+Z5Liq55So5LqO5Yy65YiGXG4gICAgbGV0IHNpZ24gPSB0cnVlO1xuICAgIGxldCBtb2RlbCA9IDA7IC8vMOS4uuiBiuWkqeaooeW8j++8jDHkuLrllLHmrYzmqKHlvI9cbiAgICBjb25zdCBhdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIC8v5Yik5pat5piv5ZCm5Zyo6K+06K+dXG4gICAgbGV0IGlzcGxheSA9IGZhbHNlO1xuICAgIC8v6K+t6Z+z55uR5ZCs5a6a5pe25ZmoXG4gICAgY29uc3Qgc3BlYWtfaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoYXVkaW9RdWV1ZS5sZW5ndGggPiAwICYmICFpc3BsYXkpIHtcbiAgICAgICAgY29uc3QgdXJsID0gYXVkaW9RdWV1ZS5zaGlmdCgpO1xuICAgICAgICBhdWRpby5zcmMgPSB1cmw7XG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRzdGFydCcsICgpID0+IHtcbiAgICAgICAgICBpc3BsYXkgPSB0cnVlO1xuICAgICAgICAgIExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCkub25TcGVhayh0aGlzLl9leHByZXNzaW9uLCB1cmwpO1xuICAgICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaXNwbGF5ID0gZmFsc2U7XG4gICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICBpZiAobXVzaWNRdWV1ZS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZW5kR2V0UmVxdWVzdChgaHR0cDovLyR7aG9zdH0vb2tgKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgICBjb25zdCBtdXNpY19pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmIChtdXNpY1F1ZXVlLmxlbmd0aCA+IDAgJiYgIWlzcGxheSkge1xuICAgICAgICBjb25zdCB1cmwgPSBtdXNpY1F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIGNvbnN0IGxpcCA9IHZvY2Fsc1F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIGF1ZGlvLnNyYyA9IHVybDtcbiAgICAgICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZHN0YXJ0JywgKCkgPT4ge1xuICAgICAgICAgIGlzcGxheSA9IHRydWU7XG4gICAgICAgICAgTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5vblNpbmcobGlwKTtcbiAgICAgICAgICBhdWRpby5wbGF5KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBhdWRpby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgICAgICBpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgICBpZiAobXVzaWNRdWV1ZS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKS5leHByZXNzaW9uKHRoaXMuX2V4cHJlc3Npb24pO1xuICAgICAgICAgICAgdGhpcy5zZW5kR2V0UmVxdWVzdChgaHR0cDovLyR7aG9zdH0vb2tgKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgICB0aGlzLl93ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KFdlYlNvY2tldFVybCk7XG4gICAgdGhpcy5fd2Vic29ja2V0Lm9ub3BlbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmIChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSB7XG4gICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbQVBQXSBjb25uZWN0IHN1Y2Nlc3MgIWApO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5fd2Vic29ja2V0Lm9ubWVzc2FnZSA9IChldmVudCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBldmVudC5kYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoZXZlbnQuZGF0YS5zdGFydHNXaXRoKCcxMDAwJykpIHtcbiAgICAgICAgICBjb25zdCB0eXBpbmdFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R5cGluZ1RleHQnKTtcbiAgICAgICAgICB0eXBpbmdFbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmRhdGEuc3RhcnRzV2l0aCgnMTAwMScpKSB7XG4gICAgICAgICAgdGhpcy5oaWRlU3RhdHVzQm94KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdGFydHNXaXRoKCcxMDAyJyB8fCAnMTAwMycpKSB7XG4gICAgICAgICAgY29uc3QgdHlwaW5nRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0eXBpbmdUZXh0Jyk7XG4gICAgICAgICAgdHlwaW5nRWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICB0aGlzLl9pbmRleCA9IDA7XG4gICAgICAgICAgdGhpcy50eXBlVGV4dChldmVudC5kYXRhLnN1YnN0cmluZyg1KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuZGF0YS5zdGFydHNXaXRoKCcxMDA0JykpIHtcbiAgICAgICAgICAvL+agh+W/l+edgOacjeWKoeWZqOato+WcqOi/lOWbnuatjOWjsOmfs+mikVxuICAgICAgICAgIGNvbnN0IHR5cGluZ0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHlwaW5nVGV4dCcpO1xuICAgICAgICAgIHR5cGluZ0VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgdGhpcy5faW5kZXggPSAwO1xuICAgICAgICAgIHRoaXMudHlwZVRleHQoZXZlbnQuZGF0YS5zdWJzdHJpbmcoNSkpO1xuICAgICAgICAgIG1vZGVsID0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnN0YXJ0c1dpdGgoJyMnKSkge1xuICAgICAgICAgIC8v5qCH5b+X552A5pyN5Yqh5Zmo5YeG5aSH6L+U5Zue6IGK5aSp6Z+z6aKRXG4gICAgICAgICAgdGhpcy5zaG93U3RhdHVzQm94KCk7XG4gICAgICAgICAgdGhpcy5faW5kZXggPSAwO1xuICAgICAgICAgIHRoaXMudHlwZVRleHQoZXZlbnQuZGF0YS5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgIG1vZGVsID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb24gPSBldmVudC5kYXRhLnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtldmVudC5kYXRhXSwgeyB0eXBlOiAnYXVkaW8vd2F2JyB9KTtcbiAgICAgICAgLy8g5Yib5bu66Z+z6aKR5YWD57SgXG4gICAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1cmwnLCB1cmwpO1xuICAgICAgICBpZiAobW9kZWwgPT0gMCkge1xuICAgICAgICAgIGF1ZGlvUXVldWUucHVzaCh1cmwpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGVsID09IDEpIHtcbiAgICAgICAgICBpZiAoc2lnbikge1xuICAgICAgICAgICAgdm9jYWxzUXVldWUucHVzaCh1cmwpO1xuICAgICAgICAgICAgc2lnbiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtdXNpY1F1ZXVlLnB1c2godXJsKTtcbiAgICAgICAgICAgIHNpZ24gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog6LCD5pW055S75biD5aSn5bCP5Lul5aGr5YWF5bGP5bmVLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzaXplQ2FudmFzKCk6IHZvaWQge1xuICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH1cbiAgLyoqXG4gICAqIOaJk+Wtl+aViOaenFxuICAgKi9cbiAgcHJpdmF0ZSB0eXBlVGV4dCh0ZXh0OiBzdHJpbmcpIHtcbiAgICBjb25zdCB0eXBpbmdFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R5cGluZ1RleHQnKTtcbiAgICBpZiAodGhpcy5faW5kZXggPCB0ZXh0Lmxlbmd0aCkge1xuICAgICAgdHlwaW5nRWxlbWVudC5pbm5lckhUTUwgKz0gdGV4dC5jaGFyQXQodGhpcy5faW5kZXgpO1xuICAgICAgdGhpcy5faW5kZXgrKztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy50eXBlVGV4dCh0ZXh0KSwgMTAwKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNob3dTdGF0dXNCb3goKSB7XG4gICAgY29uc3Qgc3RhdHVzQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1c0JveCcpO1xuICAgIHN0YXR1c0JveC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gIH1cblxuICBwcml2YXRlIGhpZGVTdGF0dXNCb3goKSB7XG4gICAgY29uc3Qgc3RhdHVzQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1c0JveCcpO1xuICAgIHN0YXR1c0JveC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gIH1cblxuICBwcml2YXRlIHNlbmRHZXRSZXF1ZXN0KHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCk7XG4gICAgeGhyLnNlbmQoKTtcbiAgfVxuXG4gIF9pbmRleDogbnVtYmVyO1xuICBfY3ViaXNtT3B0aW9uOiBPcHRpb247IC8vIEN1YmlzbSBTREsgT3B0aW9uXG4gIF92aWV3OiBMQXBwVmlldzsgLy8g6KeG5Zu+XG4gIF93ZWJzb2NrZXQ6IFdlYlNvY2tldDsgLy8g6IGK5aSp5o6l5Y+jXG4gIF9pc0VuZDogYm9vbGVhbjsgLy8gQVBQ5piv5ZCm57uT5p2fXG4gIF90ZXh0dXJlTWFuYWdlcjogTEFwcFRleHR1cmVNYW5hZ2VyOyAvLyDnurnnkIbnrqHnkIblmahcbiAgX2V4cHJlc3Npb246IHN0cmluZztcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gXCI3MzRlNjAwY2E3YzVhODU2MWM4NVwiOyB9Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9