"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strade = exports.Incidenti = void 0;
const mongoose = require('mongoose');
const incidentiSchema = new mongoose.Schema({
    Data: String,
    Localizzazione: String,
    Strada: String,
    NaturaIncidente: String,
    ParticolaritaStrade: String,
    Segnaletica: String,
    CondizioniAtmosferica: String,
    Traffico: String,
    Visibilita: String,
    Illuminazione: String,
    Latitudine: Number,
    Longitudine: Number,
    Feriti: Number,
    Deceduti: Number,
    TipoStrada: String,
    Pavimentazione: String,
}, { collection: 'incidenti' });
const stradeSchema = new mongoose.Schema({
    Localizzazione: String,
    Strada: String,
    ParticolaritaStrade: String,
    Segnaletica: String,
    Min_Latitudine: Number,
    Max_Latitudine: Number,
    Max_Longitudine: Number,
    Min_Longitudine: Number,
    Totale_feriti: Number,
    Totale_deceduti: Number,
    Numero_incidenti: Number,
    TipoStrada: String,
    Pavimentazione: String,
}, { collection: 'strade' });
exports.Incidenti = mongoose.model('incidenti', incidentiSchema);
exports.Strade = mongoose.model('strade', stradeSchema);
