// import { Nitro } from "nitropack";
import mongoose from "mongoose";
import { Price } from "./models/Price";
import historicalData from "./btc.json";
import { $fetch } from "ofetch";

const importData = async () => {
  try {
    const monthData = await $fetch(
      "https://api.coindesk.com/v1/bpi/historical/close.json"
    );
    for await (let key of Object.keys(monthData.bpi)) {
      if (key > "2024-02-20") {
        historicalData.push({
          date: key,
          price: monthData.bpi[key],
        });
      }
    }

    const dayData = await $fetch(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    const todayDate = dayData.time.updatedISO.substr(0, 10);
    const todayRate = dayData.bpi.USD.rate;
    if ((await historicalData.at(-1).date) < todayDate) {
      historicalData.push({
        date: todayDate,
        price: todayRate,
      });
    }

    await Price.create(historicalData);
    console.log("data successfully imported", historicalData.at(-1).date);
  } catch (error) {
    console.log("error", error);
  }
};

// _nitroApp: Nitro
export default async () => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.mongodbUri).then(() => {
      console.log("Connected to MongoDB");
      Price.find().then((data) => {
        if (data.length) {
          mongoose.connection.db.dropCollection("prices");
        }
        importData();
      });
    });
  } catch (e) {
    console.error(e);
  }
};
