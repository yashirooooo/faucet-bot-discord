import mongoose from '../mongoose';

const Schema = mongoose.Schema;

// [RAW] record faucet man
const faucetor = new Schema({
    authorId: {type: String, index: true, unique: true},
});

export = mongoose.model('Faucetor', faucetor, 'Faucetor');
