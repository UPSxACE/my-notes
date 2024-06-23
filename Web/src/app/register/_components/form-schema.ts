import { REGEX_PASSWORD, REGEX_USERNAME } from "@/utils/regexes";
import { z } from "zod";

const formSchema = z
  .object({
    username: z
      .string()
      .regex(
        REGEX_USERNAME,
        "Usernames can only include letters, numbers, periods, hyphens, and underscores, with the exception that periods, hyphens, and underscores cannot be placed at the start or end."
      )
      .min(3, "Please pick a bigger username")
      .max(24, "Your username is too big"),
    email: z
      .string()
      .min(1, "This field is required")
      .email("Invalid email format"),
    password: z
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
    fullName: z.string().min(1, "This field is required"),
  })
  .refine(
    (data) => {
      return data.password === data.repeatPassword;
    },
    {
      message: "The passwords don't match",
      path: ["repeatPassword"],
    }
  );

export default formSchema;
