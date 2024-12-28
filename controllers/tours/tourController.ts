import Tour, { tourSchema, TourType } from "../../models/tourModel";
import { Request, Response, NextFunction } from "express";
import { QueryAPI } from "../../utils/QueryAPI";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
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

export function topCheap(req: Request, res: Response, next: NextFunction) {
  req.query.sort = "-ratingsAverage,price";
  req.query.limit = "5";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
}

// OOP Method
export const getAllTours = catchAsync(async function (
  req: Request,
  res: Response
) {
  // Extracting all query (filters,sort,projection,...)
  const queryStrings = req.query;
  // Filtering the filter props only by Including only the schema props
  const queryObj = { ...queryStrings };
  const toursQuery = new QueryAPI(queryObj, tourSchema, Tour)
    .filter()
    .sort()
    .select()
    .paginate().query;
  const tours = await toursQuery;
  // return the results
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

export const getTour = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tourId: string = req.params.id;
  const tour = await Tour.findById(tourId);
  if (!tour) return next(new AppError("Can't find the requested tour", 404));
  res.status(200).json({
    status: "success",
    tour,
  });
});

export const createTour = catchAsync(async function (
  req: Request,
  res: Response
) {
  const tourData: TourType = req.body;
  const newTour = await Tour.create(tourData);
  res.status(201).json({
    status: "success",
    tour: newTour,
  });
});

export const updateTour = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tourId: string = req.params.id;
  const newTour = await Tour.findByIdAndUpdate(tourId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!newTour) return next(new AppError("Can't find the requested tour", 404));
  res.status(200).json({
    status: "success",
    tour: newTour,
  });
});

export const deleteTour = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tourId: string = req.params.id;
  const tour = await Tour.findByIdAndDelete(tourId);
  if (!tour) return next(new AppError("Can't find the requested tour", 404));

  res.status(204).json({
    status: "success",
  });
});

export const getTourStats = catchAsync(async function (
  req: Request,
  res: Response
) {
  const stats = await Tour.aggregate([
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

export const getMonthlyPlan = catchAsync(async function (
  req: Request,
  res: Response
) {
  const { year } = req.params;
  const monthlyPlans = await Tour.aggregate([
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
    results: monthlyPlans?.length,
    plans: monthlyPlans,
  });
});
