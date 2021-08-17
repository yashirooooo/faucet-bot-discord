import Faucetor from './models/faucetor';

export const saveFaucetor = async (authorId: string) => {
  const faucetor = new Faucetor({
    authorId,
    count: 1
  });
  faucetor.save();
};

export const updateFaucetor = async (authorId: string, usedCount: number) => {
    await Faucetor.findOneAndUpdate({authorId}, {
        $set: {
            count: usedCount
        }
    }).exec();
}

export const queryFaucetor = async (authorId: string) => {
  return Faucetor.findOne({authorId}).exec();
}