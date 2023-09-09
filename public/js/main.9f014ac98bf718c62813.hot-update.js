"use strict";
self["webpackHotUpdatecocochatbot"]("main",{

/***/ "./src/lapplive2dmanager.ts":
/*!**********************************!*\
  !*** ./src/lapplive2dmanager.ts ***!
  \**********************************/
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
exports.LAppLive2DManager = exports.s_instance = void 0;
const cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "./Framework/src/math/cubismmatrix44.ts");
const csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "./Framework/src/type/csmvector.ts");
const LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/lappdefine.ts"));
const lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/lappdelegate.ts");
const lappmodel_1 = __webpack_require__(/*! ./lappmodel */ "./src/lappmodel.ts");
const lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/lapppal.ts");
exports.s_instance = null;
class LAppLive2DManager {
    static getInstance() {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppLive2DManager();
        }
        return exports.s_instance;
    }
    static releaseInstance() {
        if (exports.s_instance != null) {
            exports.s_instance = void 0;
        }
        exports.s_instance = null;
    }
    getModel(no) {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }
        return null;
    }
    releaseAllModel() {
        for (let i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }
        this._models.clear();
    }
    switchExpress(name) {
        this.getModel(this._sceneIndex).setExpression(name);
    }
    onSing(wav_path) {
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage(`[APP] start sing ${wav_path}`);
        }
        this.getModel(this._sceneIndex).setSound(wav_path);
        this.getModel(this._sceneIndex).setExpression('唱');
    }
    onSpeak(expression, wav_path) {
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage(`[APP] start speak`);
        }
        this.getModel(this._sceneIndex).setSound(wav_path);
        this.getModel(this._sceneIndex).setExpression(expression);
    }
    expression(expression) {
        this.getModel(this._sceneIndex).setExpression(expression);
    }
    onUpdate() {
        const { width, height } = lappdelegate_1.canvas;
        const modelCount = this._models.getSize();
        for (let i = 0; i < modelCount; ++i) {
            const projection = new cubismmatrix44_1.CubismMatrix44();
            const model = this.getModel(i);
            if (model.getModel()) {
                if (model.getModel().getCanvasWidth() > 1.0 && width < height) {
                    model.getModelMatrix().setWidth(2.0);
                    projection.scale(1.0, width / height);
                }
                else {
                    projection.scale(height / width, 1.0);
                }
                if (this._viewMatrix != null) {
                    projection.multiplyByMatrix(this._viewMatrix);
                }
            }
            model.update();
            model.draw(projection);
        }
    }
    nextScene() {
        const no = (this._sceneIndex + 1) % LAppDefine.ModelDirSize;
        this.changeScene(no);
    }
    changeScene(index) {
        this._sceneIndex = index;
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage(`[APP]model index: ${this._sceneIndex}`);
        }
        const model = LAppDefine.ModelDir[index];
        const modelPath = LAppDefine.ResourcesPath + model + '/';
        let modelJsonName = LAppDefine.ModelDir[index];
        modelJsonName += '.model3.json';
        this.releaseAllModel();
        this._models.pushBack(new lappmodel_1.LAppModel());
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    }
    setViewMatrix(m) {
        for (let i = 0; i < 16; i++) {
            this._viewMatrix.getArray()[i] = m.getArray()[i];
        }
    }
    constructor() {
        this._finishedMotion = (self) => {
            lapppal_1.LAppPal.printMessage('Motion Finished:');
            console.log(self);
        };
        this._viewMatrix = new cubismmatrix44_1.CubismMatrix44();
        this._models = new csmvector_1.csmVector();
        this._sceneIndex = 0;
        this.changeScene(this._sceneIndex);
    }
}
exports.LAppLive2DManager = LAppLive2DManager;


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "236a6bf59c239522abb1"; }
/******/ }();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi45ZjAxNGFjOThiZjcxOGM2MjgxMy5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0EsNkhBQWdFO0FBRWhFLDhHQUFzRDtBQUV0RCxnR0FBMkM7QUFDM0MsMEZBQXdDO0FBQ3hDLGlGQUF3QztBQUN4QywyRUFBb0M7QUFFekIsa0JBQVUsR0FBc0IsSUFBSSxDQUFDO0FBTWhELE1BQWEsaUJBQWlCO0lBT3JCLE1BQU0sQ0FBQyxXQUFXO1FBQ3ZCLElBQUksa0JBQVUsSUFBSSxJQUFJLEVBQUU7WUFDdEIsa0JBQVUsR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7U0FDdEM7UUFFRCxPQUFPLGtCQUFVLENBQUM7SUFDcEIsQ0FBQztJQUtNLE1BQU0sQ0FBQyxlQUFlO1FBQzNCLElBQUksa0JBQVUsSUFBSSxJQUFJLEVBQUU7WUFDdEIsa0JBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQztTQUNyQjtRQUVELGtCQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFRTSxRQUFRLENBQUMsRUFBVTtRQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFLTSxlQUFlO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzQjtRQUVE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Q0FBQyxPQUFPLEdBQUcsSUFBSSxxQkFBUyxFQUFhLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckMsQ0FBQztDQVVGO0FBMUtELDhDQTBLQzs7Ozs7Ozs7O1VDaE1ELHFDQUFxQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NvY29jaGF0Ym90Ly4vc3JjL2xhcHBsaXZlMmRtYW5hZ2VyLnRzIiwid2VicGFjazovL2NvY29jaGF0Ym90L3dlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBDdWJpc21NYXRyaXg0NCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgeyBBQ3ViaXNtTW90aW9uIH0gZnJvbSAnQGZyYW1ld29yay9tb3Rpb24vYWN1YmlzbW1vdGlvbic7XG5pbXBvcnQgeyBjc21WZWN0b3IgfSBmcm9tICdAZnJhbWV3b3JrL3R5cGUvY3NtdmVjdG9yJztcblxuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuaW1wb3J0IHsgTEFwcE1vZGVsIH0gZnJvbSAnLi9sYXBwbW9kZWwnO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5cbmV4cG9ydCBsZXQgc19pbnN0YW5jZTogTEFwcExpdmUyRE1hbmFnZXIgPSBudWxsO1xuXG4vKipcbiAq5Zyo56S65L6L5bqU55So56iL5bqP5Lit566h55CGQ3ViaXNtTW9kZWznmoTnsbtcbiAq6L+b6KGM5qih5Z6L55Sf5oiQ5ZKM5bqf5byD44CB6L275pWy5LqL5Lu255qE5aSE55CG44CB5qih5Z6L5YiH5o2i44CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwTGl2ZTJETWFuYWdlciB7XG4gIC8qKlxuICAgKui/lOWbnuexu+eahOWunuS+i++8iOWNleS4qu+8ieOAglxuICAgKuWmguaenOacqueUn+aIkOWunuS+i++8jOWImeWcqOWGhemDqOeUn+aIkOWunuS+i+OAglxuICAgKlxuICAgKkByZXR1cm7nsbvlrp7kvotcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogTEFwcExpdmUyRE1hbmFnZXIge1xuICAgIGlmIChzX2luc3RhbmNlID09IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UgPSBuZXcgTEFwcExpdmUyRE1hbmFnZXIoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc19pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDph4rmlL7lrp7kvovjgIJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVsZWFzZUluc3RhbmNlKCk6IHZvaWQge1xuICAgIGlmIChzX2luc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UgPSB2b2lkIDA7XG4gICAgfVxuXG4gICAgc19pbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICrov5Tlm57lvZPliY3lnLrmma/kuK3kv53nlZnnmoTmqKHlnovjgIJcbiAgICpcbiAgICpAcGFyYW1ub+aooeWei+WIl+ihqOS4reeahOe0ouW8leWAvFxuICAgKkByZXR1cm7ov5Tlm57mqKHlnovnmoTlrp7kvovjgILlpoLmnpzntKLlvJXlgLzotoXlh7rojIPlm7TvvIzliJnov5Tlm57nqbrlgLzjgIJcbiAgICovXG4gIHB1YmxpYyBnZXRNb2RlbChubzogbnVtYmVyKTogTEFwcE1vZGVsIHtcbiAgICBpZiAobm8gPCB0aGlzLl9tb2RlbHMuZ2V0U2l6ZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWxzLmF0KG5vKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiDph4rmlL7lvZPliY3lnLrmma/kuK3kv53nlZnnmoTmiYDmnInmqKHlnotcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlQWxsTW9kZWwoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tb2RlbHMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIHRoaXMuX21vZGVscy5hdChpKS5yZWxlYXNlKCk7XG4gICAgICB0aGlzLl9tb2RlbHMuc2V0KGksIG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuX21vZGVscy5jbGVhcigpO1xuICB9XG4gIC8qKlxuICAgKiDliIfmjaLooajmg4VcbiAgICovXG4gIHB1YmxpYyBzd2l0Y2hFeHByZXNzKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZ2V0TW9kZWwodGhpcy5fc2NlbmVJbmRleCkuc2V0RXhwcmVzc2lvbihuYW1lKTtcbiAgfVxuICAvKipcbiAgICog5ZSx5q2M5pe26Kem5Y+R5Ye95pWwXG4gICAqL1xuICBwdWJsaWMgb25TaW5nKHdhdl9wYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoYFtBUFBdIHN0YXJ0IHNpbmcgJHt3YXZfcGF0aH1gKTtcbiAgICB9XG4gICAgdGhpcy5nZXRNb2RlbCh0aGlzLl9zY2VuZUluZGV4KS5zZXRTb3VuZCh3YXZfcGF0aCk7XG4gICAgdGhpcy5nZXRNb2RlbCh0aGlzLl9zY2VuZUluZGV4KS5zZXRFeHByZXNzaW9uKCfllLEnKTtcbiAgfVxuICAvKipcbiAgICog6K+06K+d5pe26Kem5Y+R5Ye95pWwXG4gICAqL1xuICBwdWJsaWMgb25TcGVhayhleHByZXNzaW9uOiBzdHJpbmcsIHdhdl9wYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoYFtBUFBdIHN0YXJ0IHNwZWFrYCk7XG4gICAgfVxuICAgIHRoaXMuZ2V0TW9kZWwodGhpcy5fc2NlbmVJbmRleCkuc2V0U291bmQod2F2X3BhdGgpO1xuICAgIHRoaXMuZ2V0TW9kZWwodGhpcy5fc2NlbmVJbmRleCkuc2V0RXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgfVxuXG4gIHB1YmxpYyBleHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZ2V0TW9kZWwodGhpcy5fc2NlbmVJbmRleCkuc2V0RXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmm7TmlrDnlLvpnaLml7bnmoTlpITnkIZcbiAgICog6L+b6KGM5qih5Z6L5pu05paw5aSE55CG5Y+K5o+P57uY5aSE55CGXG4gICAqL1xuICBwdWJsaWMgb25VcGRhdGUoKTogdm9pZCB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBjYW52YXM7XG5cbiAgICBjb25zdCBtb2RlbENvdW50OiBudW1iZXIgPSB0aGlzLl9tb2RlbHMuZ2V0U2l6ZSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RlbENvdW50OyArK2kpIHtcbiAgICAgIGNvbnN0IHByb2plY3Rpb246IEN1YmlzbU1hdHJpeDQ0ID0gbmV3IEN1YmlzbU1hdHJpeDQ0KCk7XG4gICAgICBjb25zdCBtb2RlbDogTEFwcE1vZGVsID0gdGhpcy5nZXRNb2RlbChpKTtcblxuICAgICAgaWYgKG1vZGVsLmdldE1vZGVsKCkpIHtcbiAgICAgICAgaWYgKG1vZGVsLmdldE1vZGVsKCkuZ2V0Q2FudmFzV2lkdGgoKSA+IDEuMCAmJiB3aWR0aCA8IGhlaWdodCkge1xuICAgICAgICAgIC8vIOWcqOe6teWQkeeql+WPo+S4reaYvuekuuaoquWQkei+g+mVv+eahOaooeWei+aXtu+8jOagueaNruaooeWei+eahOaoquWQkeWwuuWvuOiuoeeul3NjYWxlXG4gICAgICAgICAgbW9kZWwuZ2V0TW9kZWxNYXRyaXgoKS5zZXRXaWR0aCgyLjApO1xuICAgICAgICAgIHByb2plY3Rpb24uc2NhbGUoMS4wLCB3aWR0aCAvIGhlaWdodCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvamVjdGlvbi5zY2FsZShoZWlnaHQgLyB3aWR0aCwgMS4wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWmguaenOmcgOimgeeahOivne+8jOWcqOi/memHjOS5mOazlVxuICAgICAgICBpZiAodGhpcy5fdmlld01hdHJpeCAhPSBudWxsKSB7XG4gICAgICAgICAgcHJvamVjdGlvbi5tdWx0aXBseUJ5TWF0cml4KHRoaXMuX3ZpZXdNYXRyaXgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG1vZGVsLnVwZGF0ZSgpO1xuICAgICAgbW9kZWwuZHJhdyhwcm9qZWN0aW9uKTsgLy8g5Zug5Li65piv5Y+C54Wn5Lqk6LSn77yM5omA5LulcHJvamVjdGlvbuS8muWPmOi0qOOAglxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDliIfmjaLliLDkuIvkuIDkuKrlnLrmma9cbiAgICog5Zyo56S65L6L5bqU55So56iL5bqP5Lit5YiH5o2i5qih5Z6L6ZuG44CCXG4gICAqL1xuICBwdWJsaWMgbmV4dFNjZW5lKCk6IHZvaWQge1xuICAgIGNvbnN0IG5vOiBudW1iZXIgPSAodGhpcy5fc2NlbmVJbmRleCArIDEpICUgTEFwcERlZmluZS5Nb2RlbERpclNpemU7XG4gICAgdGhpcy5jaGFuZ2VTY2VuZShubyk7XG4gIH1cblxuICAvKipcbiAgICog5YiH5o2i5Zy65pmvXG4gICAqIOWcqOW6lOeUqOeoi+W6j+S4reWIh+aNouaooeWei+mbhuOAglxuICAgKi9cbiAgcHVibGljIGNoYW5nZVNjZW5lKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9zY2VuZUluZGV4ID0gaW5kZXg7XG4gICAgaWYgKExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbQVBQXW1vZGVsIGluZGV4OiAke3RoaXMuX3NjZW5lSW5kZXh9YCk7XG4gICAgfVxuXG4gICAgLy8g5LuOTW9kZWxEaXJbXeS4reS/neeVmeeahOebruW9leWQjeensFxuICAgIC8vIOehruWumm1vZGVsMy5qc29u55qE6Lev5b6E44CCXG4gICAgLy8g5L2/55uu5b2V5ZCN5LiObW9kZWwzLmpzb27nmoTlkI3lrZfkuIDoh7TjgIJcbiAgICBjb25zdCBtb2RlbDogc3RyaW5nID0gTEFwcERlZmluZS5Nb2RlbERpcltpbmRleF07XG4gICAgY29uc3QgbW9kZWxQYXRoOiBzdHJpbmcgPSBMQXBwRGVmaW5lLlJlc291cmNlc1BhdGggKyBtb2RlbCArICcvJztcbiAgICBsZXQgbW9kZWxKc29uTmFtZTogc3RyaW5nID0gTEFwcERlZmluZS5Nb2RlbERpcltpbmRleF07XG4gICAgbW9kZWxKc29uTmFtZSArPSAnLm1vZGVsMy5qc29uJztcbiAgICB0aGlzLnJlbGVhc2VBbGxNb2RlbCgpO1xuICAgIHRoaXMuX21vZGVscy5wdXNoQmFjayhuZXcgTEFwcE1vZGVsKCkpO1xuICAgIHRoaXMuX21vZGVscy5hdCgwKS5sb2FkQXNzZXRzKG1vZGVsUGF0aCwgbW9kZWxKc29uTmFtZSk7XG4gIH1cblxuICBwdWJsaWMgc2V0Vmlld01hdHJpeChtOiBDdWJpc21NYXRyaXg0NCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgICAgdGhpcy5fdmlld01hdHJpeC5nZXRBcnJheSgpW2ldID0gbS5nZXRBcnJheSgpW2ldO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDmnoTpgKDlh73mlbBcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBuZXcgQ3ViaXNtTWF0cml4NDQoKTtcbiAgICB0aGlzLl9tb2RlbHMgPSBuZXcgY3NtVmVjdG9yPExBcHBNb2RlbD4oKTtcbiAgICB0aGlzLl9zY2VuZUluZGV4ID0gMDtcbiAgICB0aGlzLmNoYW5nZVNjZW5lKHRoaXMuX3NjZW5lSW5kZXgpO1xuICB9XG5cbiAgX3ZpZXdNYXRyaXg6IEN1YmlzbU1hdHJpeDQ0OyAvLyDnlKjkuo7mqKHlnovnu5jliLbnmoTop4blm77nn6npmLVcbiAgX21vZGVsczogY3NtVmVjdG9yPExBcHBNb2RlbD47IC8vIOaooeWei+WunuS+i+WuueWZqFxuICBfc2NlbmVJbmRleDogbnVtYmVyOyAvLyDopoHmmL7npLrnmoTlnLrmma/ntKLlvJXlgLxcbiAgLy8g6L+Q5Yqo5pKt5pS+57uT5p2f55qE5Zue6LCD5Ye95pWwXG4gIF9maW5pc2hlZE1vdGlvbiA9IChzZWxmOiBBQ3ViaXNtTW90aW9uKTogdm9pZCA9PiB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ01vdGlvbiBGaW5pc2hlZDonKTtcbiAgICBjb25zb2xlLmxvZyhzZWxmKTtcbiAgfTtcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gXCIyMzZhNmJmNTljMjM5NTIyYWJiMVwiOyB9Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9