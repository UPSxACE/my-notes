import argon2, { argon2id } from "argon2";
import os from "os";

export default class Passwords {
  #CONFIG: argon2.Options = {
    type: argon2id,
    memoryCost: 128 * 1024, // 128mb
    parallelism: os.cpus().length,
  };

  async hashPassword(password: string) {
    return await argon2.hash(password, this.#CONFIG);
  }

  async verifyPassword(hash: string, password: string) {
    return await argon2.verify(hash, password);
  }
}
