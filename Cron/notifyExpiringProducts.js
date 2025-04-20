const cron = require("node-cron");
const dayjs = require("dayjs");
const twilio = require("twilio");
const client = twilio(
  "AC9ae271d1346a07fea01a424b990dbbcf",
  "24b43db42543f2b5a88298dc1c968bf2"
);
const { getAllExpiredProducts } = require("../Services/productService");

cron.schedule("* * * * *", async () => {
  console.log("⏰ Running cron job to check expiring products...");

  try {
    const now = dayjs();
    const inOneMonth = now.add(1, "month");

    const expiringProducts = await getAllExpiredProducts(inOneMonth, now);
    console.log(expiringProducts);
    let message = "⏳ Reminder:";
    let i = 0;
    /*for (const product of expiringProducts) {
      if (i < 2) {
        message = ` Your product "${
          product.label
        }" is expiring soon (on ${dayjs(product.dateExp).format(
          "YYYY-MM-DD"
        )}).`;
        await client.messages.create({
          body: message,
          from: "+12318259542", // your Twilio number
          to: "+21656440114",
        });
        i++;
      }
    }
*/
    console.log(message);

    console.log("✅ Notification job completed.");
  } catch (err) {
    console.error("❌ Error in cron job:", err.message);
  }
});
