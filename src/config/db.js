import { PrismaClient } from "@prisma/client";

//Create a log from the prisma connection.
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

//DB connection
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB is live");
  } catch (error) {
    console.log(`DB connection failed: ${error.message}`);
    process.exit(1); //Make sure you take care of any overflow risk event
  }
};

//DB disconnection
const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
