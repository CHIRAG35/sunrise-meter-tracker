const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run() {

  const response = await fetch(
    "https://urjavi.com/qpay?token=goc8miIAB5x47xB4tHUHaA"
  );

  const html = await response.text();

  const match = html.match(/const SERVER_DATA = (.*?);/s);

  if (!match) {
    throw new Error("SERVER_DATA not found");
  }

  const data = JSON.parse(match[1]);

  await db.collection("meter_logs").add({
    balance: parseFloat(data.balance),
    grid: parseFloat(data.grid),
    dg: parseFloat(data.dg),
    syncAt: data.syncat,
    recordedAt: new Date().toISOString()
  });

  console.log("Saved:", data.balance);
}

run();
