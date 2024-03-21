import joblib
import numpy as np
import vertexai
from vertexai.preview.generative_models import GenerativeModel
import os

class ModelloRegressione():
    def __init__(self):
        path_modello = 'modello_regression_tree.pkl'
        self.model = joblib.load(path_modello)
        self.mapping_localizzazione = {
            'Strada Urbana': 1,
            'Comunale extraurbana': 2,
            'Altra strada': 3,
            'Statale': 4,
            'Autostrada': 5,
            "Statale entro l'abitato": 6,
            'Assente': 7,
            "Regionale entro l'abitato": 8,
            "Provinciale entro l'abitato": 9,
            'Regionale': 10,
            'Provinciale': 11
        }
        self.mapping_segnaletica = {
            'Verticale ed orizzontale': 1,
            'Verticale': 2,
            'Assente': 3,
            'Orizzontale': 4,
            'Temporanea di cantiere': 5
        }
        self.mapping_pavimentazione = {
            'Asfaltata': 1,
            'Acciotolata': 2,
            'In cubetti di porfido': 3,
            'Sterrata': 4,
            'Lastricata': 5,
            'Fondo naturale': 6,
            'Con buche': 7,
            'Strada pavimentata dissestata': 8,
            'Assente': 9,
            'Inghiaiata': 10,
            'In conglomerato cementizio': 11
        }
        self.mapping_tipo_strada = {
            'Una carreggiata a senso unico di marcia': 1,
            'Una carreggiata a doppio senso': 2,
            'Più di due carreggiate': 3,
            'Due carreggiate': 4,
            'Una carreggiata a senso unico alternato': 5,
            'Assente': 6
        }

    def mapping(self, info_strada):
        localizzazione = self.mapping_localizzazione[info_strada['Localizzazione']]
        segnaletica = self.mapping_segnaletica[info_strada['Segnaletica']]
        pavimentazione = self.mapping_pavimentazione[info_strada['Pavimentazione']]
        tipo_strada = self.mapping_tipo_strada[info_strada['TipoStrada']]
        return [np.asarray([localizzazione, segnaletica, pavimentazione, tipo_strada])]

    def predict(self, info_strada):
        input_modelo = self.mapping(info_strada)
        indice_pericolosita = self.model.predict(input_modelo)
        return indice_pericolosita[0]

class ModelloGenerativo():

    def __init__(self):
        self.project_id = "spheric-time-417914"
        self.location = "europe-west8"

        vertexai.init(project=self.project_id, location=self.location)

        self.model = GenerativeModel('gemini-pro')

    def generate_report(self, info_strada):
        localizzazione = info_strada['Localizzazione']
        segnaletica = info_strada['Segnaletica']
        pavimentazione = info_strada['Pavimentazione']
        tipo_strada = info_strada['TipoStrada']
        numero_incidenti = info_strada['NumeroIncidenti']
        numero_coinvolti = int(info_strada['Totale_Feriti']) + int(info_strada['Totale_Deceduti'])
        strada = info_strada['Strada']
        query = f'Generami un report discorsivo di 10 righe sulla rischiosità della strada {strada} di Roma con le seguenti' \
                f'caratteristiche: ' \
                f'categoria di strada: {localizzazione},' \
                f'segnaletica: {segnaletica},' \
                f'pavimentazione: {pavimentazione},' \
                f'tipologia di strada: {tipo_strada},' \
                f'numero incidenti registrati: {numero_incidenti},' \
                f'numero persone ferite negli incidenti: {numero_coinvolti}.'
        response = self.model.generate_content(query)
        return response.text
'''
if __name__ == '__main__':
    info_via = {
        "Strada":"Via Tuscolana",
        "Localizzazione": "Altra strada",
        "Segnaletica":"Orizzontale",
        "Pavimentazione": "Asfaltata",
        "TipoStrada": "Due carreggiate",
        "NumeroIncidenti":20,
        "Totale_Deceduti":3,
        "Totale_Feriti":15
    }
    modello_regressione = ModelloRegressione()
    modello_generativo = ModelloGenerativo()
    print(modello_regressione.predict(info_via))
    print(modello_generativo.generate_report(info_via))
    '''
