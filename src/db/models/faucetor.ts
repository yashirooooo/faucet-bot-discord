import mongoose from '../mongoose';

const Schema = mongoose.Schema;

// [RAW] record faucet man
const faucetor = new Schema({
    authorId: { type: String, index: true, unique: true },
    count: { type: Number }
});

export = mongoose.model('Faucetor', faucetor, 'Faucetor');
