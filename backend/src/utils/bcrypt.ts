import bcrypt from "bcrypt";

export const hashValue = async (
  value: string,
  saltRound?: number
): Promise<string> => {
  return bcrypt.hash(value, saltRound || 10);
};

export const compareValue = async (value: string, hashedValue: string) =>
  bcrypt.compare(value, hashedValue).catch(() => false);
