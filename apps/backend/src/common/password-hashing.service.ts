import * as bcrypt from "bcrypt";

export class PasswordHashingService {
  private readonly HASH_ROUNDS = 10;

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.HASH_ROUNDS);
  }

  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
