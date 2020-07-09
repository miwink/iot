# main.py -- put your code here!

from watersensor import WaterSensor
from sigfoxconnection import SigfoxConnection
from time import sleep

# Important constants

messagesPerHour = 4
sensors = 1
measurements = 6
sleeptime = 5

# init Sigfox for RCZ1 (Europe)

w = WaterSensor()
ctrlbyte = (sensors << 4 | measurements & 0xf).to_bytes(1, 'big')
s = SigfoxConnection(ctrlbyte)
data = []

while True:
    for i in range (measurements):
        value  = w.read()
        print(value)
        data.append(value)
        #sleep(sleeptime / (messagesPerHour * measurements) - 2)
        sleep(5)
    s.data_to_buffer(data)
    print("Sending data...")
    s.send()
    data = []





