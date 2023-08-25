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
Object.defineProperty(exports, "__esModule", { value: true });
const main_js_1 = require("../src/main.js");
describe('greeter function', () => {
    const name = 'John';
    let hello;
    let timeoutSpy;
    // Act before assertions
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Read more about fake timers
        // http://facebook.github.io/jest/docs/en/timer-mocks.html#content
        // Jest 27 now uses "modern" implementation of fake timers
        // https://jestjs.io/blog/2021/05/25/jest-27#flipping-defaults
        // https://github.com/facebook/jest/pull/5171
        jest.useFakeTimers();
        timeoutSpy = jest.spyOn(global, 'setTimeout');
        const p = (0, main_js_1.greeter)(name);
        jest.runOnlyPendingTimers();
        hello = yield p;
    }));
    // Teardown (cleanup) after assertions
    afterAll(() => {
        timeoutSpy.mockRestore();
    });
    // Assert if setTimeout was called properly
    it('delays the greeting by 2 seconds', () => {
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), main_js_1.Delays.Long);
    });
    // Assert greeter result
    it('greets a user with `Hello, {name}` message', () => {
        expect(hello).toBe(`Hello, ${name}`);
    });
});
