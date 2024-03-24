//const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');
import axios from 'axios'
import express, { Request, Response, NextFunction } from 'express';
import { Incidenti, Strade } from './models';

import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';
import { STATUS_CODES } from 'http';

const app = express();
mongoose.connect('mongodb://mongodb:27017/data_finale', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB");
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 

// headers
app.use((request: Request, response: Response, next: NextFunction) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

//implement message object class for errors
const errorHandler = (err : Error, req : any, res : any, next : any) => {
    //res.send(JSON.stringify(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send( { "error" : `${err.message}`} );
};

app.use(bodyParser.json());
//app.use(errorHandler);

app.get("/", (req : any, res : any) => {
    res.send("Hello World!");
});

app.post("/search", async (req : any, res : any, next : any) => {
    res.setHeader('Content-Type', 'application/json');
    const name = req.body.name;
    // select  the first road
    const roads = await Strade.find(
        { 
            "Strada" : { $regex: new RegExp(name, "i") }
        }
        , "Strada Max_Latitudine Min_Latitudine Max_Longitudine Min_Longitudine"
    );
    
    //const json = JSON.stringify(roads);
    res.status(StatusCodes.OK).send(roads);
}, errorHandler);

app.post("/road", async (req : any, res : any, next : any) => {
    const name = req.body.name;
    // select  the first road
    const road = await Strade.findOne(
        { 
            "Strada" : { $regex: new RegExp(name, "i") }
        }
    );
    // convert to json
    const json = JSON.stringify(road);
    res.status(StatusCodes.OK).send(json);
}, errorHandler);


app.post("/inference", async (req : any, res : any, next : any) => {
    const info = req.body;
    const name = req.body.name;
    
    let url = "http://backend:5000/inference";
    // do post request to inference service
    const json_1 = await axios.post(url, info)
    .then(async (data:any) => {
        let ret = data.data;
        return ret;
    });

    // Esegui un'operazione di aggregazione per ottenere la condizione climatica più comune su una determinata strada
    
    const aggregateResultMeteo = await Incidenti.aggregate([
        { $match: { Strada: { $regex: new RegExp(name, "i") }, CondizioneAtmosferica: { $ne: "Assente" } } }, // Filtra i documenti con condizione atmosferica diversa da "Assente"
        { $group: { _id: "$CondizioneAtmosferica", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ])

    let condizioneClimaticaPiuComune = '';
    if (aggregateResultMeteo.length > 0) {
        condizioneClimaticaPiuComune = aggregateResultMeteo[0]._id;
    }

    const aggregateResultIll = await Incidenti.aggregate([
        { $match: { Strada: { $regex: new RegExp(name, "i") }} }, // Filtra i documenti con condizione atmosferica diversa da "Assente"
        { $group: { _id: "$Illuminazione", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ])

    let condizioneIllPiuComune = '';
    if (aggregateResultIll.length > 0) {
        condizioneIllPiuComune = aggregateResultIll[0]._id;
    }

    const aggregateResultTraff = await Incidenti.aggregate([
        { $match: { Strada: { $regex: new RegExp(name, "i") }, Traffico: { $ne: "Assente" } } }, // Filtra i documenti con condizione atmosferica diversa da "Assente"
        { $group: { _id: "$Traffico", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]) 
    
    let condizioneTraffPiuComune = '';
    if (aggregateResultTraff.length > 0) {
        condizioneTraffPiuComune = aggregateResultTraff[0]._id;
    }

    const aggregateResultAnno = await Incidenti.aggregate([
        { $match: { Strada: { $regex: new RegExp(name, "i") } } }, // Filtra i documenti con condizione atmosferica diversa da "Assente"
        { $group: { _id: "$Data", count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
    ]) 

    
    let individua_trend = ''
    if (aggregateResultAnno.length >= 3) {
        // Ottieni i valori _id del primo, secondo e terzo elemento
        const primo = aggregateResultAnno[0].count;
        const secondo = aggregateResultAnno[1].count;
        const terzo = aggregateResultAnno[2].count;
        if (primo > secondo && secondo > terzo) {
            individua_trend = "C'è un trend crescente negli incidenti, si approfondisca."
        }
        else{
            individua_trend = "Non è evidente un chiaro trend."
        }
    }
    else {
            individua_trend = "Non abbiano abbastanza dati per definire un trend."
    }    

    // Converti il risultato in JSON
    const json = JSON.stringify({ score : json_1.score, report : json_1.report, condizioneClimaticaPiuComune, condizioneIllPiuComune, condizioneTraffPiuComune, individua_trend });


    res.status(StatusCodes.OK).send(json);
}, errorHandler);

app.listen(4000);