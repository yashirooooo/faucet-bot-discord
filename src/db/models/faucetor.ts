import mongoose from '../mongoose';

const Schema = mongoose.Schema;

// [RAW] record faucet man
const faucetor = new Schema({
    authorId: {type: Number, index: true, unique: true},
});

export = mongoose.model('Faucetor', faucetor, 'Faucetor');
