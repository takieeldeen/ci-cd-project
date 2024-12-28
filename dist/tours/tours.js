"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetAllTours = useGetAllTours;
exports.useGetTour = useGetTour;
exports.createTour = createTour;
exports.updateTour = updateTour;
exports.deleteTour = deleteTour;
const fs_1 = __importDefault(require("fs"));
const tours = JSON.parse(fs_1.default.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`));
function useGetAllTours(req, res) {
    console.log(req);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
}
function useGetTour(req, res) {
    const tourId = req.params.id;
    const tour = tours.find((tourObj) => tourObj.id === +tourId);
    if (tour) {
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    }
    else {
        res.status(404).json({
            status: 'fail',
            message: 'Couldnt find this tour',
        });
    }
}
function createTour(req, res) {
    // Get the new id
    const id = tours[tours.length - 1].id + 1;
    const newTour = req.body;
    newTour.id = id;
    tours.push(newTour);
    fs_1.default.writeFile(`${__dirname}/../../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).send(`Created with id of ${id}`);
    });
}
function updateTour(req, res) {
    // Get the requested tour
    const id = +req.params.id;
    const updatedData = req.body;
    const updatedTours = tours.map((tourObj) => tourObj.id === id ? Object.assign(Object.assign({}, tourObj), updatedData) : tourObj);
    fs_1.default.writeFile(`${__dirname}/../../dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), (err) => {
        res.status(201).send(`updated Successfully`);
    });
}
function deleteTour(req, res) {
    const id = +req.params.id;
    const updatedTours = tours.filter((tourObj) => tourObj.id !== id);
    fs_1.default.writeFile(`${__dirname}/../../dev-data/data/tours-simple.json`, JSON.stringify(updatedTours), (err) => {
        res.status(204).send(`updated Successfully`);
    });
}
//# sourceMappingURL=tours.js.map