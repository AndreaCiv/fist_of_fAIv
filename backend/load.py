import os
import pymongo
import json

# entrypoint
if __name__ == "__main__":
    try:
        client = pymongo.MongoClient('mongodb://mongodb:27017/')
        db = client['data_finale']
        Collection_incidenti = db['incidenti']
        Collection_strade = db['strade']

        with open("dataset_incidenti.json") as file:
            file_data = json.load(file)
        Collection_incidenti.insert_many(file_data)

        with open("dataset_strade.json") as file:
            file_data = json.load(file)
        Collection_strade.insert_many(file_data)


    except Exception as e:
        print("Non vaaaaaaaaaaa", e)