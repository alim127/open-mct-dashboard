from websocket import create_connection
from random import randint
import time
import json 

def gentele():
    num = randint(50,100)

    return num
ws = create_connection("ws://localhost:8080/realtime")

try:
    while True:
        x = {
            "pwr.temp":gentele(),
            "prop.fuel": gentele()
        }
        result = json.dumps(x)
        ws.send(result)

        time.sleep(0.5)
except:

    ws.close()
 