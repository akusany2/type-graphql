import bcrypt from "bcryptjs";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../../entity/User";
import { isAuth } from '../middleware/isAuth';
import { RegisterInput } from "./register/RegisterInput";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmationEmail } from '../../utils/createConfirmationEmail';


@Resolver()
export class RegisterResolver {

  @Query(() => String)
  @UseMiddleware(isAuth)
  async hello() {
    return "Hello world";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();
    await sendEmail(email, await createConfirmationEmail(user.id))
    return user;
  }
}