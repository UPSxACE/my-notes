import jwt from "jsonwebtoken";
import z, { ZodType } from "zod";
type JwtPayload = {
  id: number;
  permissions: number;
  isDemo: boolean;
} & jwt.JwtPayload;

class Jwt {
  #SECRET: string;

  constructor() {
    const SECRET = process.env.JWT_SECRET;

    if (!SECRET) {
      throw new Error("Missing JWT_SECRET environment variable");
    }

    this.#SECRET = SECRET;
  }
  signToken(id: number, permissions: number, isDemo: boolean = false): string {
    const payload: JwtPayload = {
      id,
      permissions,
      isDemo,
    };

    return jwt.sign(payload, this.#SECRET, {
      // algorithm: "ES256",
      expiresIn: "2d",
    });
  }

  verify(token: string): JwtPayload | null {
    try {
      const result = jwt.verify(token, this.#SECRET);
      if (typeof result === "string") {
        return null;
      }

      const Payload = z.object({
        id: z.number(),
        permissions: z.number(),
        isDemo: z.boolean(),
        exp: z.number(),
      }) satisfies ZodType<JwtPayload>;

      const { success, data } = Payload.safeParse(result);
      if (!success) {
        return null;
      }

      return data;
    } catch (err) {
      return null;
    }
  }
}

export default Jwt;
