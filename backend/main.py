from flask import Flask
import os
from flask_cors import CORS, cross_origin
import pymongo
import json
from pymongo import InsertOne

# db
#uri = "mongodb://mongodb:27017/"

# instatiating flask app
api = Flask(__name__)
api.config['CORS_HEADERS'] = 'Content-Type'
# set header access control allow methods to all
cors = CORS(api, resources={r"/*": {"origins": "*"}})

#client = pymongo.MongoClient('mongodb://mongodb:27017/')

# route that sends inference task
@api.get("/test")
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def test():
    try:
        ret = {
            "message" : "Hello World"
        }   
    except Exception as err:
        print("error:", err)
    finally:
        return  ret


# entrypoint
if __name__ == "__main__":
    API_PORT = os.environ.get("API_PORT") or 5000
    api.run(host = "0.0.0.0", port = API_PORT, debug=True)