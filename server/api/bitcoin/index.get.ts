import { Price } from "~/server/models/Price";

export default defineEventHandler(async () => {
  const data = await Price.find().sort("date").exec();

  return data;
});
