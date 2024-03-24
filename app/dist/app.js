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
const axios_1 = __importDefault(require("axios"));
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
    res.setHeader('Content-Type', 'application/json');
    const name = req.body.name;
    const roads = yield models_1.Strade.find({
        "Strada": { $regex: new RegExp(name, "i") }
    }, "Strada Max_Latitudine Min_Latitudine Max_Longitudine Min_Longitudine");
    res.status(http_status_codes_1.StatusCodes.OK).send(roads);
}), errorHandler);
app.post("/road", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const road = yield models_1.Strade.findOne({
        "Strada": { $regex: new RegExp(name, "i") }
    });
    const json = JSON.stringify(road);
    res.status(http_status_codes_1.StatusCodes.OK).send(json);
}), errorHandler);
app.post("/inference", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const info = req.body;
    const name = req.body.name;
    let url = "http://backend:5000/inference";
    const json_1 = yield axios_1.default.post(url, info)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        let ret = data.data;
        return ret;
    }));
    const aggregateResultMeteo = yield models_1.Incidenti.aggregate([
        { $match: { Strada: { $regex: new RegExp(name, "i") }, CondizioneAtmosferica: { $ne: "Assente" } } },
        { $group: { _id: "$CondizioneAtmosferica", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    let condizioneClimaticaPiuComune = '';
    if (aggregateResultMeteo.length > 0) {
        condizioneClimaticaPiuComune = aggregateResultMeteo[0]._id;
    }
    const aggregateResultIll = yield models_1.Incidenti.aggregate([
        { $match: { Strada: { $regex: new RegExp(name, "i") } } },
        { $group: { _id: "$Illuminazione", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    let condizioneIllPiuComune = '';
    if (aggregateResultIll.length > 0) {
        condizioneIllPiuComune = aggregateResultIll[0]._id;
    }
    const aggregateResultTraff = yield models_1.Incidenti.aggregate([
        { $match: { Strada: { $regex: new RegExp(name, "i") }, Traffico: { $ne: "Assente" } } },
        { $group: { _id: "$Traffico", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);
    let condizioneTraffPiuComune = '';
    if (aggregateResultTraff.length > 0) {
        condizioneTraffPiuComune = aggregateResultTraff[0]._id;
    }
    const aggregateResultAnno = yield models_1.Incidenti.aggregate([
        { $match: { Strada: { $regex: new RegExp(name, "i") } } },
        { $group: { _id: "$Data", count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
    ]);
    let individua_trend = '';
    if (aggregateResultAnno.length >= 3) {
        const primo = aggregateResultAnno[0].count;
        const secondo = aggregateResultAnno[1].count;
        const terzo = aggregateResultAnno[2].count;
        if (primo > secondo && secondo > terzo) {
            individua_trend = "C'è un trend crescente negli incidenti, si approfondisca.";
        }
        else {
            individua_trend = "Non è evidente un chiaro trend.";
        }
    }
    else {
        individua_trend = "Non abbiano abbastanza dati per definire un trend.";
    }
    const json = JSON.stringify({ score: json_1.score, report: json_1.report, condizioneClimaticaPiuComune, condizioneIllPiuComune, condizioneTraffPiuComune, individua_trend });
    res.status(http_status_codes_1.StatusCodes.OK).send(json);
}), errorHandler);
app.listen(4000);
