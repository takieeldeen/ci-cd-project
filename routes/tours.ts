import express from "express";
import * as tourController from "../controllers/tours/tourController";
console.log("object");
const tourRouter = express.Router();
// Param Middleware that runs only when id param exists
// tourRouter.param('id', tourController.checkTourId);

tourRouter.route("/stats").get(tourController.getTourStats);
tourRouter.route("/monthlyPlans/:year").get(tourController.getMonthlyPlan);

tourRouter
  .route("/top-5-cheap")
  .get(tourController.topCheap, tourController.getAllTours);

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);
// .post(tourController.checkTourBody, tourController.createTour);

tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default tourRouter;
