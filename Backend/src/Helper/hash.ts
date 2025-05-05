import * as argon from 'argon2';

// implementation of hashing using argon based on argon documentation.
const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword: string = await argon.hash(password, { type: argon.argon2id });
  return hashedPassword;
};

const verifyHashPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isCorrect: boolean = await argon.verify(hashedPassword, password);
  return isCorrect;
};

export { hashPassword, verifyHashPassword };
