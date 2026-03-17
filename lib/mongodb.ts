import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/carplatform";

if (!MONGODB_URI) {
  console.error("[MongoDB] MONGODB_URI environment variable is not set!");
  console.error("[MongoDB] Add MONGODB_URI to your .env.local file");
  console.error(
    "[MongoDB] Example: MONGODB_URI=mongodb://127.0.0.1:27017/carplatform",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(
      "[MongoDB] Connecting to:",
      MONGODB_URI.replace(/\/\/.*@/, "//<credentials>@"),
    );

    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((m) => {
        console.log("[MongoDB] Connected successfully!");
        return m;
      })
      .catch((err) => {
        console.error("[MongoDB] Connection error:", err.message);
        console.error("[MongoDB] Make sure MongoDB is running.");
        console.error(
          "[MongoDB] On Windows: run 'mongod' or start MongoDB service",
        );
        console.error(
          "[MongoDB] Or use MongoDB Atlas and update MONGODB_URI in .env.local",
        );
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
