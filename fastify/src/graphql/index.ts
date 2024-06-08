import merge from "lodash.merge";
import { IResolvers, MercuriusOptions } from "mercurius";
import buildContext from "./context";
import userResolvers from "./resolvers/user";
import schema from "./schema";

const buildResolvers = () => {
  const resolvers = [userResolvers];
  let mergedResolvers: IResolvers = {};
  let previous: IResolvers;
  resolvers.forEach((resolver) => {
    previous = resolver;

    if (!previous) {
      mergedResolvers = resolver;
      return;
    }

    mergedResolvers = merge<IResolvers, IResolvers>(mergedResolvers, resolver);
  });

  return mergedResolvers;
};

const mercuriusConfig: MercuriusOptions = {
  graphiql: true,
  schema: schema,
  resolvers: buildResolvers(),
  context: buildContext,
};

export default mercuriusConfig;
