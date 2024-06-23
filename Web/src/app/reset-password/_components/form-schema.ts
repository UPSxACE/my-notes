import { REGEX_PASSWORD } from "@/utils/regexes";
import { z } from "zod";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .regex(REGEX_PASSWORD, "Your password contains illegal characters")
      .min(8, "Your password is too small")
      .max(64, "Your password is too big")
      .refine(
        (data) => data.toLowerCase() !== data && data.toUpperCase() !== data,
        {
          message:
            "Your password needs at least 1 lower case and 1 upper case character",
        }
      )
      .refine(
        (data) => {
          const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
          return data.split("").some((letter) => numbers.includes(letter));
        },
        {
          message: "Your password needs at least 1 number",
        }
      ),
    repeatPassword: z.string().min(0, "This field is required"),
  })
  .refine(
    (data) => {
      return data.newPassword === data.repeatPassword;
    },
    {
      message: "The passwords don't match",
      path: ["repeatPassword"],
    }
  );

export default formSchema;
