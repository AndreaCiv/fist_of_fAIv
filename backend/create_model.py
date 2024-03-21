import sklearn
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib

if __name__ == '__main__':
    df = pd.read_json('dataset_strade.json')

    def calcola_indice_pericolosita(df):
        w1 = 0.05
        w2 = 0.08
        w3 = 0.16
        w4 = 5.0
        w5 = 6.0
        w6 = 7.0
        w7 = 6.0
        
        numero_incidenti = df['NumeroIncidenti']
        numero_feriti = df['Totale_Feriti']
        numero_morti = df['Totale_Deceduti']
        tipo_strada = df['Localizzazione']
        segnaletica = df['Segnaletica']
        pavimentazione = df['Pavimentazione']
        corsie_strada = df['TipoStrada']
        
        # Calcolo del fattore tipo di strada
        if tipo_strada == 'Strada Urbana' or tipo_strada == 'Statale entro l\'abitato' or tipo_strada == 'Regionale entro l\'abitato' or tipo_strada == 'Provinciale entro l\'abitato':
            fattore_tipo_strada = 8.0
        elif tipo_strada == 'Comunale extraurbana' or tipo_strada == 'Regionale' or tipo_strada == 'Statale':
            fattore_tipo_strada = 10.0
        elif tipo_strada == 'Autostrada':
            fattore_tipo_strada = 5.0
        else:
            fattore_tipo_strada = 7.0  # Valore di default per altri tipi di strada
        
        # Calcolo del fattore segnaletica
        if segnaletica == 'Orizzontale':
            fattore_segnaletica = 8.0
        elif segnaletica == 'Verticale':
            fattore_segnaletica = 6.0
        elif segnaletica == 'Verticale ed orizzontale':
            fattore_segnaletica = 4.0
        else:
            fattore_segnaletica = 10.0  # Valore di default per segnaletica assente
        
        # Calcolo fattore pavimentazione
        if pavimentazione == 'Asfaltata' or pavimentazione == 'In conglomerato cementizio' or pavimentazione=='Lastricata':
            fattore_pavimentazione = 5.0
        elif pavimentazione == 'Acciotolata' or pavimentazione=='In cubetti di porfido':
            fattore_pavimentazione = 7.0
        elif pavimentazione in ['Sterrata', 'Fondo naturale', 'Con buche', 'Strada pavimentata dissestata', 'Inghiaiata']:
            fattore_pavimentazione = 10.0
        else:
            fattore_pavimentazione = 8.0
        
        #Calcolo fattore numero corsie
        if corsie_strada in ['Una carreggiata a senso unico di marcia','Due carreggiate', 'Più di due carreggiate']:
            fattore_corsie = 7.0
        elif corsie_strada in ['Una carreggiata a doppio senso','Una carreggiata a senso unico alternato']:
            fattore_corsie = 10.0
        else:
            fattore_corsie = 5.0
        # Calcolo dell'indice di pericolosità
        indice_pericolosita = (w1 * np.log(numero_incidenti)) + (w2 * numero_feriti) + (w3 * numero_morti) + (w4 * fattore_tipo_strada) + (w5 * fattore_segnaletica) + (w6 * fattore_pavimentazione + w7 * fattore_corsie)
        
        return indice_pericolosita

    df['Indice_Pericolosita'] = df.apply(calcola_indice_pericolosita, axis=1)

    
    model = DecisionTreeRegressor()

    #X = df[['NumeroIncidenti', 'Totale_Feriti', 'Totale_Deceduti', 'Localizzazione', 'Segnaletica', 'Pavimentazione', 'TipoStrada']]
    X = df[['Localizzazione', 'Segnaletica', 'Pavimentazione', 'TipoStrada']]
    y = df['Indice_Pericolosita']

    mapping_localizzazione = {
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
    X['Localizzazione'] = X['Localizzazione'].map(mapping_localizzazione)


    mapping = {
        'Verticale ed orizzontale': 1,
        'Verticale': 2,
        'Assente': 3,
        'Orizzontale': 4,
        'Temporanea di cantiere': 5
    }

    # Applica il mapping alla colonna 'Segnaletica'
    X['Segnaletica'] = X['Segnaletica'].map(mapping)

    pavimentazione_mapping = {
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
    X['Pavimentazione'] = X['Pavimentazione'].map(pavimentazione_mapping)

    mapping_tipo_strada = {
        'Una carreggiata a senso unico di marcia': 1,
        'Una carreggiata a doppio senso': 2,
        'Più di due carreggiate': 3,
        'Due carreggiate': 4,
        'Una carreggiata a senso unico alternato': 5,
        'Assente': 6
    }

    # Applica il mapping alla colonna 'TipoStrada'
    X['TipoStrada'] = X['TipoStrada'].map(mapping_tipo_strada)

   
    # Dividi il dataset in set di addestramento e set di test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

    # Addestra il modello
    model.fit(X_train, y_train)

    
    # Effettua predizioni sul set di test
    predictions = model.predict(X_test)

    # Valuta le prestazioni del modello
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    print("Mean Squared Error:", mse)
    print("R-squared:", r2)

    joblib.dump(model, 'modello_regression_tree.pkl')