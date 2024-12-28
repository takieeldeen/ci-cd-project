"use strict";
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
exports.getMonthlyPlan = exports.getTourStats = exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
exports.topCheap = topCheap;
const tourModel_1 = __importStar(require("../../models/tourModel"));
const QueryAPI_1 = require("../../utils/QueryAPI");
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../utils/AppError"));
// Old method
// export async function getAllTours(req: Request, res: Response) {
//   try {
//     // Extracting all query (filters,sort,projection,...)
//     const queryStrings = req.query;
//     // Filtering the filter props only by Including only the schema props
//     const queryObj = { ...queryStrings };
//     Object.keys(queryObj).forEach((key) => {
//       if (!tourSchema?.obj?.[key]) delete queryObj[key];
//     });
//     // construct the query
//     const query = Tour.find(queryObj);
//     // consume the query
//     const tours = await query;
//     // return the results
//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err?.errorResponse?.errmsg,
//     });
//   }
// }
function topCheap(req, res, next) {
    req.query.sort = "-ratingsAverage,price";
    req.query.limit = "5";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
}
// OOP Method
exports.getAllTours = (0, catchAsync_1.catchAsync)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extracting all query (filters,sort,projection,...)
        const queryStrings = req.query;
        // Filtering the filter props only by Including only the schema props
        const queryObj = Object.assign({}, queryStrings);
        const toursQuery = new QueryAPI_1.QueryAPI(queryObj, tourModel_1.tourSchema, tourModel_1.default)
            .filter()
            .sort()
            .select()
            .paginate().query;
        const tours = yield toursQuery;
        // return the results
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours,
            },
        });
    });
});
exports.getTour = (0, catchAsync_1.catchAsync)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tourId = req.params.id;
        const tour = yield tourModel_1.default.findById(tourId);
        if (!tour)
            return next(new AppError_1.default("Can't find the requested tour", 404));
        res.status(200).json({
            status: "success",
            tour,
        });
    });
});
exports.createTour = (0, catchAsync_1.catchAsync)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const tourData = req.body;
        const newTour = yield tourModel_1.default.create(tourData);
        res.status(201).json({
            status: "success",
            tour: newTour,
        });
    });
});
exports.updateTour = (0, catchAsync_1.catchAsync)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tourId = req.params.id;
        const newTour = yield tourModel_1.default.findByIdAndUpdate(tourId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!newTour)
            return next(new AppError_1.default("Can't find the requested tour", 404));
        res.status(200).json({
            status: "success",
            tour: newTour,
        });
    });
});
exports.deleteTour = (0, catchAsync_1.catchAsync)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tourId = req.params.id;
        const tour = yield tourModel_1.default.findByIdAndDelete(tourId);
        if (!tour)
            return next(new AppError_1.default("Can't find the requested tour", 404));
        res.status(204).json({
            status: "success",
        });
    });
});
exports.getTourStats = (0, catchAsync_1.catchAsync)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield tourModel_1.default.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: "$difficulty" },
                    totalTours: { $sum: 1 },
                    numberOfTours: { $count: {} },
                    averageRating: { $avg: "$ratingsAverage" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                    numRatings: { $sum: "$ratingsQuantity" },
                    toursNames: { $addToSet: "$name" },
                },
            },
            {
                $sort: { totalTours: -1, maxPrice: 1 },
            },
        ]);
        res.status(200).json({
            status: "success",
            stats,
        });
    });
});
exports.getMonthlyPlan = (0, catchAsync_1.catchAsync)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { year } = req.params;
        const monthlyPlans = yield tourModel_1.default.aggregate([
            {
                $unwind: "$startDates",
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $project: {
                    name: 1,
                    month: { $dateToString: { date: "$startDates", format: "%B" } },
                },
            },
            {
                $group: {
                    _id: "$month",
                    tourCounts: { $sum: 1 },
                    tourNames: { $addToSet: "$name" },
                },
            },
            {
                $addFields: { month: "$_id" },
            },
            {
                $project: { month: 1, tourCounts: 1, tourNames: 1, _id: 0 },
            },
            {
                $sort: { tourCounts: -1 },
            },
        ]);
        res.status(200).json({
            status: "success",
            results: monthlyPlans === null || monthlyPlans === void 0 ? void 0 : monthlyPlans.length,
            plans: monthlyPlans,
        });
    });
});
//# sourceMappingURL=tourController.js.map