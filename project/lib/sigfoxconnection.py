from network import Sigfox
import socket

class SigfoxConnection:
    def __init__(self, ctrlbyte):
        self.sigfox = Sigfox(mode=Sigfox.SIGFOX, rcz=Sigfox.RCZ1)

        # create a Sigfox socket
        self.socket = socket.socket(socket.AF_SIGFOX, socket.SOCK_RAW)

        # make the socket blocking
        self.socket.setblocking(True)

        # configure it as uplink only
        self.socket.setsockopt(socket.SOL_SIGFOX, socket.SO_RX, False)
        self.ctrlbyte = ctrlbyte
        self.buffer = bytearray(0)

    def data_to_buffer(self, data_array, size=12):
        length = len(data_array)
        r = length % 2
        for i in range(0, length - 1, 2):
            byte = (data_array[i] << 12 | data_array[i + 1]).to_bytes(3, 'big')
            self.buffer += byte

        if r == 1:
            self.buffer += (data_array[length - 1] << 12).to_bytes(2, 'big')

    def send(self):
        buff = self.ctrlbyte + self.buffer

        self.socket.send(buff)
        #print(len(self.buffer))
        self.buffer = bytearray(0)