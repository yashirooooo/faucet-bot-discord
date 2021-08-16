import Faucetor from './models/faucetor';

export const saveFaucetor = async (authorId: number) => {
  const faucetor = new Faucetor({
    authorId: authorId,
  });
  faucetor.save();
};

export const queryFaucetor = async (authorId: number) => {
    return Faucetor.findOne(authorId).exec();
}