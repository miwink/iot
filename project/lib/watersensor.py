from machine import ADC

class WaterSensor:
    def __init__(self, pin='P17'):
        self.adc = ADC()
        self.pin = self.adc.channel(pin=pin, attn=ADC.ATTN_11DB)
        self.data = []

    def read(self, measurementAvg=10):
        avg = 0
        if measurementAvg <= 0:
            return -1

        for x in range(0, measurementAvg):
            avg += self.pin.value()
            
        avg = int(avg / measurementAvg)

        self.data.append(avg)

        return avg