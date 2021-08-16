import Faucetor from './models/faucetor';

export const saveFaucetor = async (authorId: string) => {
  const faucetor = new Faucetor({
    authorId,
  });
  faucetor.save();
};

export const queryFaucetor = async (authorId: string) => {
  return Faucetor.findOne({authorId}).exec();
}