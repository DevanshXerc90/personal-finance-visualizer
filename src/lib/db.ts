import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;


if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env');
}

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
    mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || {
    conn: null,
    promise: null,
};

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;
    globalWithMongoose.mongoose = cached;

    return cached.conn;
}
