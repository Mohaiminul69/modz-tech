/*
 * One-off: write the shop's contact details into the existing Settings document.
 * (The seed only creates settings when none exist.) Until the admin Settings page
 * exists, edit the values below and run:
 *
 *   npx tsx --env-file-if-exists=.env.local scripts/set-contact.ts
 */
import mongoose from "mongoose";
import { Settings } from "../src/models/settings";

const contact = {
  phone: "+880 1786-503069",
  email: "modztech.store@gmail.com",
  hours: "10am–11pm",
  facebookUrl: "https://www.facebook.com/profile.php?id=61577609936117",
  messengerUrl: "https://m.me/61577609936117",
  whatsappUrl: "https://wa.me/8801786503069",
};

const main = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");
  await mongoose.connect(uri);
  const result = await Settings.updateOne({ key: "site" }, { $set: contact });
  if (result.matchedCount === 0) throw new Error('No settings found. Run "npm run seed" first.');
  const doc = await Settings.findOne({ key: "site" }).lean();
  console.log(`Updated settings in "${mongoose.connection.name}":`);
  console.log({ phone: doc?.phone, email: doc?.email, hours: doc?.hours, facebookUrl: doc?.facebookUrl, messengerUrl: doc?.messengerUrl, whatsappUrl: doc?.whatsappUrl });
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
