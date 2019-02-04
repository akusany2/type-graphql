import { v4 } from "uuid";
import { redis } from '../redis';
import { emailConfirmationPrefix } from '../modules/constants/redisPrefixes';

export const createConfirmationEmail = async (userId: number) => {
  const id = v4();

  await redis.set(emailConfirmationPrefix + id, userId, "ex", 60 * 60 * 24); // 1day

  return `<a href="http://localhost:3000/user/confirm/${id}">http://localhost:3000/user/confirm/${id}</a>`;
}