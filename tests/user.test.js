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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateTOTP_1 = require("../functions/generateTOTP");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
describe("User API Test", () => {
    test("Register with invalid totp code", () => __awaiter(void 0, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("username", process.env.TEST_USERNAME);
        formData.append("password", process.env.TEST_PASSWORD);
        formData.append("code", "00000000");
        const response = yield fetch("http://localhost:5000/api/user", {
            method: "POST",
            body: formData,
        });
        const data = yield response.json();
        expect(response.status).toBe(401);
        expect(data.message).toEqual("Invalid TOTP code");
    }));
    test("Register with missing username, code or password", () => __awaiter(void 0, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("username", "");
        formData.append("password", process.env.TEST_PASSWORD);
        formData.append("code", "123456");
        const response = yield fetch("http://localhost:5000/api/user", {
            method: "POST",
            body: formData,
        });
        const data = yield response.json();
        expect(response.status).toBe(401);
        expect(data.message).toEqual("missing username, code or password");
    }));
    test("Register with illegal username", () => __awaiter(void 0, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append("username", "adm--in");
        formData.append("password", process.env.TEST_PASSWORD);
        formData.append("code", (0, generateTOTP_1.generateTOTP)());
        const response = yield fetch("http://localhost:5000/api/user", {
            method: "POST",
            body: formData,
        });
        const data = yield response.json();
        expect(response.status).toBe(401);
        expect(data.error).toEqual("Illegal Username");
    }));
});
