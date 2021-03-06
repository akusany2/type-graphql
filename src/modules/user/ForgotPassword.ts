import { Arg, Mutation, Resolver } from "type-graphql";
import { sendEmail } from "../../utils/sendEmail";
import { User } from "../../entity/User";
import { redis } from '../../redis';
import { v4 } from 'uuid';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';


@Resolver()
export class ForgotPasswordResolver {

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) return true;

    const token = v4();

    await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1day

    await sendEmail(email, `<a href="http://localhost:3000/user/change-password/${token}">http://localhost:3000/change-password/confirm/${token}</a>`)
    return true;
  }
}