from pymongo import MongoClient
import json
from pymongo import InsertOne
def get_database(): 
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient('mongodb://localhost:27017/')
   # Create the database for our example (we will use the same database throughout the tutorial
   db = client['data']
   return db

'''def inserisci_dati(database, nome_tabella, percorso):
    collection_name = database[nome_tabella]
    requesting = []

    with open(percorso, 'r') as f:
        for jsonObj in f:
            myDict = json.loads(jsonObj)
            requesting.append(InsertOne(myDict))'''

    
# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":   
  
   # Get the database
   dbname = get_database()

