---
title: "Project IoT"
disqus: hackmd
---

## Tutorial on how to build a vase water level measurement device

Michael Wink - mw223mk

This tutorial will show you how to build you own water level sensor, that you can use to know when to pour some more water to the vase with flowers.
The project uses the LoPy4 Pycom microcontroller, which has the ability to connect to different types of networks like Lora and Sigfox. The sensor used is a ... water sensor
that you can find in most Kjell & Co stores.

This project is pretty simple to setup, as the code for running this service is provided. What takes up most of the time is the deployment of the services and getting the API keys.
Therefore, the whole setup will probably take approximately 10-30 min assuming the provided code is used.

Business requirements:

- Being available for startup at any place
- ETc...

What needs to be included:

- [ ] Title
- [ ] Your name and student credentials (xx666x)
- [ ] Short project overview
- [ ] How much time it might take to do (approximation)

### Objective

Describe why you have chosen to build this specific device. What purpose does it serve? What do you want to do with the data, and what new insights do you think it will give?

- [ ] Why you chose the project
- [ ] What purpose does it serve
- [ ] What insights you think it will give

I chose this project because I do have a lot of plants at home, but I keep forgetting to water them from time to time. I therefore built this to remind me to water my plants by
sending an SMS to my phone. The data collected during the day could be used to analyse a lot of interesting things, for example how fast the water evaporates/is drunk by the plants.
These analyses will probably remind me to water my plants more often as I will know how often it actually needs some watering.

### Material

Explain all material that is needed. All sensors, where you bought them and their specifications. Please also provide pictures of what you have bought and what you are using.

- [ ] List of material
- [ ] What the different things (sensors, wires, controllers) do - short specifications
- [ ] Where you bought them and how much they cost

- [ ] LoPy4 Pycom microcontroller (preferrebly but not necessary. It mostly needs to support the MicroPython and the Sigfox network protocol) ~ 80 EUR
- [ ] A ... Luxorparts Vattensensor for Arduino (link) ~ 5 EUR
- [ ] 3 Jumper cables Female-Male ~ 10 EUR https://www.kjell.com/se/produkter/el-verktyg/elektronik/elektroniklabb/delbar-kopplingskabel-40-pol-30-cm-hane-hona-p87024
- [ ] A MicroUSB - USB cable ~ 10 EUR

### Computer setup

How is the device programmed. Which IDE are you using. Describe all steps from flashing the firmware, installing plugins in your favorite editor. How flashing is done on MicroPython.

- [ ] Chosen IDE

I've chosen VSCode, as that is the IDE I am mostly used to. I also has a large variety of extensions and has support for the PyMakr plugin.

- [ ] How the code is uploaded

Everything is containerised using Docker, and then pushed Docker Hub.

The api server is deployed to a some sort of web service. I've used Google Cloud.

- [ ] Steps that you needed to do for your computer. Installation of Node.js, extra drivers, etc.

If using VSCode as I did, it is highly recommended to use the PyMakr plugin, which is used to connect to the Pycom microcontroller and upload code.

### Putting everything together

How is all the electronics connected? Describe all the wiring, good if you can show a circuit diagram. Be specific on how to connect everything, and what to think of in terms of resistors, current and voltage. Is this only for a development setup or could it be used in production?

![Picture](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Image")

- [ ] Circuit diagram (can be hand drawn)
- [ ] \*Electrical calculations

#### Electrical Calculations

Because the device is pretty much idle most of the time, only polling the sensors every x min, the energy consumption isn't that high. The costly operation is sending messages
over the SigFox network. Using the chart provided by Pycom, one can assume that the average energy consumption is somewhere between 35 and 91 mA. This could probably be improved if
one would use deepsleep when idle, although if one wants to poll the sensor every couple of minutes, the startup and shutdown could maybe be more costly than just letting the device
be idle.

### Platform

Describe your choice of platform. If you have tried different platforms it can be good to provide a comparison.
Is your platform based on a local installation or a cloud? Do you plan to use a paid subscription or a free? Describe the different alternatives on going forward if you want to scale your idea.

The project is dependent on a couple of services:

- Docker Hub
- Hosting Service
- Sigfox Network

To host your own docker image on a private account you will have to sign up for one. Luckily there are no costs of having a basic account.

A hosting service can be a bit difficult

To get access to the Sigfox network it is recommenden to follow this tutorial, as it will result in you having an account that includes a 1-year pro subscription. More details can
be found here: [Register your Pycom device on Sigfox](https://docs.pycom.io/gettingstarted/registration/sigfox/). After you have set up your account you should be able to see your Pycom device when clicking on the [Device Tab](https://backend.sigfox.com/device/list). From there you have access to different settings regarding your device. When clicking on the ID of your device a new view is opened that is specific to that device. In the sidebar there are different options, the most useful being the messages tab where you can see all the messsages being sent by your device, and whether they were succesful or not.

It is also possible to click at the **Device Type**, which opens another view displaying information about relevant for all these types of devices. From this you

- [ ] Describe platform in terms of functionality
- [ ] \*Explain and elaborate what made you choose this platform

### The code

Import your code here, and don’t forget to explain what you have done!

```python=
from watersensor import WaterSensor
from sigfoxconnection import SigfoxConnection
from time import sleep

# Important constants, decides how often it should send a message over Sigfox and
# poll the water sensor

messagesPerHour = 4
sensors = 1
measurements = 6
sleeptime = 5

# init Sigfox for RCZ1 (Europe)

# Creates an instance of the WaterSensor class.
w = WaterSensor()

# Concatenate the sensor and measurement constants into a single byte
ctrlbyte = (sensors << 4 | measurements & 0xf).to_bytes(1, 'big')

# Creates a new Sigfox Connection, with a set ctrlbyte
s = SigfoxConnection(ctrlbyte)
data = []

# Creates infinite measure and network connection loop
while True:
    for i in range (measurements):
        # Read from the sensor
        value  = w.read()
        print(value)
        # Append it to the array
        data.append(value)
        # Sleeps a calculated amount of time
        sleep(sleeptime / (messagesPerHour * measurements) - 2)
        #sleep(5)
    # Convert the data to a buffer prepared for sending
    s.data_to_buffer(data)
    print("Sending data...")
    # Sends
    s.send()
    data = []
```

### Transmitting the data / connectivity

How is the data transmitted to the internet? Describe the package format. All the different steps that are needed in getting the data to your end point. Explain both the code and choice of wireless protocols

- [ ] How often is the data sent?

The frequency of sending messages is predefined to be 4 times per hour, or 96 times a day. This limit was defined based on the subscription registered on Sigfox, where a 1-year pro
contract was received. This means that a maximum of 140 messages can be sent in one day. The frequency is determined by some variables inside the code, and can therefore easily
be modified if one would want to send more or less frequent.

- [ ] Which wireless protocols did you use (WiFi, LoRa, etc …)?
      My device does as previosusly mentioned only use the Sigfox network for communicating with my API server hosted on the internet. This choice was made due to Sigfox being the only network that was in range when trying to connect. WiFi and Bluetooth was of course also available, but made the choice to not use these network capabilites as it could make it dependent to my home. One of my project requirements I had setup was to make work outside too.
- [ ] Which transport protocols were used (MQTT, webhook, etc …)

As there two parts in communicating between the device and my server over Sigfox, there were two types of protocols used. Between

Between the Sigfox backend and my server the protocol used was https. The Sigfox backend creates a new PUT request to my API hosted at https://iot.michaelw.ink .

- [ ] \*Elaborate on the design choices regarding data transmission and wireless protocols. That is how your choices affect the device range and battery consumption.

### Presenting the data

Describe the presentation part. How is the dashboard built? How long is the data preserved in the database?

- [ ] Provide visual examples on how the dashboard looks. Pictures needed. Grafana Pictures
- [ ] How often is data saved in the database.
- [ ] \*Explain your choice of database. Influxdb
- [ ] \*Automation/triggers of the data. Sigfox Callback

### Finalizing the design

Show the final results of your project. Give your final thoughts on how you think the project went. What could have been done in an other way, or even better? Pictures are nice!

- [ ] Show final results of the project
- [ ] Pictures

### Troubleshooting

#### A message was sent from the device, but is not displayed in the Sigfox Backend under Messages

- From the **Devices** view, click on your device's ID. On the top-right there should be a button called "Disengage sequence number". Click on the button.
