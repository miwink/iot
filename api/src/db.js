import { InfluxDB, FieldType } from "influx";

const influx = new InfluxDB({
  host: "influx.michaelw.ink",
  port: 443,
  protocol: "https",
  username: "iotlnu",
  password: "micropython",
  database: "iot",
  schema: [
    {
      measurement: "waterlevel",
      fields: {
        level: FieldType.INTEGER,
      },
      tags: ["device"],
    },
  ],
});

console.log(influx);

export default influx;
