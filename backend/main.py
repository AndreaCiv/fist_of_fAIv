from flask import Flask, request
import os
from flask_cors import CORS, cross_origin
import json
from regressione_e_report import ModelloRegressione, ModelloGenerativo


# instatiating flask app
api = Flask(__name__)
api.config['CORS_HEADERS'] = 'Content-Type'
# set header access control allow methods to all
cors = CORS(api, resources={r"/*": {"origins": "*"}})

mreg = ModelloRegressione()
mgen = ModelloGenerativo()

# route that sends inference task
# features 'Localizzazione', 'Segnaletica', 'Pavimentazione', 'TipoStrada'
@api.post("/inference")
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def inference():
    try:
        body = request.get_json()
        mreg_result = mreg.predict(body)
        ret = {
            "score" : mreg_result / 400
        }   
    except Exception as err:
        print("error:", err)
    finally:
        return  ret

@api.post("/road")
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def post_road():
    return 0


# entrypoint
if __name__ == "__main__":
    API_PORT = os.environ.get("API_PORT") or 5000
    api.run(host = "0.0.0.0", port = API_PORT, debug=True)