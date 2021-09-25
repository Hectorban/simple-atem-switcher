"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Atem = require('atem-connection').Atem;
var ioHook = require('iohook');
var nfetch = require('node-fetch');
var numbersKeyRef = {
    "49": 1,
    "50": 2,
    "51": 3,
    "52": 4,
    "53": 5,
    "54": 6,
    "55": 7,
    "56": 8,
    "57": 9,
    "48": 10
};
var numpadKeyRef = {
    "96": 10,
    "97": 1,
    "98": 2,
    "99": 3,
    "100": 4,
    "101": 5,
    "102": 6,
    "103": 7,
    "104": 8,
    "105": 9
};
var fetchAndStart = function (index, myAtem) { return __awaiter(void 0, void 0, void 0, function () {
    var refRes, refData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ioHook.stop();
                return [4 /*yield*/, nfetch('http://localhost:3000/api/data')];
            case 1:
                refRes = _a.sent();
                return [4 /*yield*/, refRes.json()];
            case 2:
                refData = _a.sent();
                keypress(index, myAtem, refData);
                return [2 /*return*/];
        }
    });
}); };
var startAtem = function (ip, index) {
    var myAtem = new Atem();
    myAtem.on('info', console.log);
    myAtem.connect(ip);
    myAtem.on('connected', function () {
        console.log("atem ID: " + ip + " connected");
        setInterval(fetchAndStart, 5000);
    });
};
var keypress = function (AtemNumber, AtemClass, refData) {
    var firstRange = [1, 6];
    var secondRange = [5, 10];
    ioHook.on('keydown', function (event) {
        var rawcode = event.rawcode;
        var keyboardNumber = 0;
        if (rawcode >= 48 && rawcode <= 57) {
            keyboardNumber = numbersKeyRef[rawcode];
        }
        if (rawcode >= 96 && rawcode <= 105) {
            keyboardNumber = numpadKeyRef[rawcode];
        }
        var manualConversionN = refData[keyboardNumber];
        if (manualConversionN >= firstRange[AtemNumber] && manualConversionN <= secondRange[AtemNumber]) {
            var sourceNumber = AtemNumber === 0 ? manualConversionN + 3 : manualConversionN - 2;
            AtemClass.changeProgramInput(sourceNumber).then(function () {
                console.log("changed atem " + AtemNumber + " source");
            });
        }
    });
    ioHook.start();
};
startAtem('192.168.100.240', 0);
startAtem('169.254.152.19', 1);
