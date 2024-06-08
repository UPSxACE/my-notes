import { IResolvers } from "mercurius";
import { users } from "../../database/users";

const userResolvers: IResolvers = {
  Query: {
    hello(root, { name }, { authorization }, info) {
      console.log("auth: ", authorization);
      return "hello " + name;
    },
  },
  Mutation: {
    createUser(root, { data }, { authorization, db }, info) {
      const { email, fullName, password, username } = data;

      const result = db
        .insert(users)
        .values(data)
        .then((row) => {
          row;
        });

      return true;
    },
  },
};

export default userResolvers;
