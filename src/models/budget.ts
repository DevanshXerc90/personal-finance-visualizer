import mongoose, { Schema } from 'mongoose';

const BudgetSchema = new Schema({
    month: { type: String, required: true },       // e.g. 'Jul 2025'
    category: { type: String, required: true },
    amount: { type: Number, required: true },
});

export default mongoose.models.Budget ||
    mongoose.model('Budget', BudgetSchema);
