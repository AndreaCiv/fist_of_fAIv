//const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose');

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
    const name = req.body.name;
    // select  the first road
    const roads = await Strade.find(
        { 
            "Strada" : { $regex: new RegExp(name, "i") }
        }
        , "Strada Max_Latitudine Min_Latitudine Max_Longitudine Min_Longitudine"
    );    
    // convert to json
    const json = JSON.stringify(roads);
    res.status(StatusCodes.OK).send(json);
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

app.listen(4000);