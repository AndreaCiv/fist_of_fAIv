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
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const http_status_codes_1 = require("http-status-codes");
const app = (0, express_1.default)();
mongoose.connect('mongodb://mongodb:27017/data_finale', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
const errorHandler = (err, req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({ "error": `${err.message}` });
};
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/search", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const roads = yield models_1.Strade.find({
        "Strada": { $regex: new RegExp(name, "i") }
    }, "Strada Max_Latitudine Min_Latitudine Max_Longitudine Min_Longitudine");
    const json = JSON.stringify(roads);
    res.status(http_status_codes_1.StatusCodes.OK).send(json);
}), errorHandler);
app.post("/road", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const road = yield models_1.Strade.findOne({
        "Strada": name
    });
    const json = JSON.stringify(road);
    res.status(http_status_codes_1.StatusCodes.OK).send(json);
}), errorHandler);
app.listen(4000);
