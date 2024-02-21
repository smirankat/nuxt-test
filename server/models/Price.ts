import { Schema, model } from "mongoose";

const PriceSchema = new Schema({
  date: {
    type: Date,
  },
  price: {
    type: String,
  },
});

export const Price = model<any>("Price", PriceSchema);
