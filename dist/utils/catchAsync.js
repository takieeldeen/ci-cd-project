"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (asyncFunction) => {
    return function (req, res, next) {
        asyncFunction(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
//# sourceMappingURL=catchAsync.js.map