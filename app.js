"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-require-imports
var express_1 = require("express");
// eslint-disable-next-line @typescript-eslint/no-require-imports
var tours_1 = require("./tours");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/api/v1/tours", tours_1.tourController.useGetAllTours);
app.post("/api/v1/tours/", tours_1.tourController.createTour);
app.get("/api/v1/tours/:id", tours_1.tourController.useGetTour);
app.patch("/api/v1/tours/:id", tours_1.tourController.updateTour);
var PORT = 3000;
app.listen(PORT, function () {
  return console.log("listening on port ".concat(PORT));
});
