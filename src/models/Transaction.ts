import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Prevent model overwrite in dev
export default mongoose.models.Transaction ||
    mongoose.model('Transaction', TransactionSchema);
