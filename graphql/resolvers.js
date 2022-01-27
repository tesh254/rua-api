import { GraphQLScalarType } from "graphql";
import {
  authenticateUser,
  fetchProfile,
} from "../controllers/auth/authenticate";
import {
  getFeedCursorType,
  getFeedCursorTypeWithFilters,
  getFeedDefaultType,
  getFeedDefaultTypeWithFilter,
  searchFeedSubject,
} from "../controllers/feed";
import { protectQuery } from "../middleware/auth";

const resolvers = {
  Query: {
    profile: fetchProfile,
    feed_default: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, getFeedDefaultType, ...rest);
    },
    feed_cursor: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, getFeedCursorType, ...rest);
    },
    feed_cursor_filter: async (_, args, ctx, ...rest) => {
      return await protectQuery(
        _,
        args,
        ctx,
        getFeedCursorTypeWithFilters,
        ...rest
      );
    },
    feed_default_filter: async (_, args, ctx, ...rest) => {
      return await protectQuery(
        _,
        args,
        ctx,
        getFeedDefaultTypeWithFilter,
        ...rest
      );
    },
    feed_search: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, searchFeedSubject, ...rest);
    },
  },
  Mutation: {
    authenticateUser: authenticateUser,
  },
  // Any: new GraphQLScalarType({
  //   name: "Any",
  //   description: "Literally anything",
  //   serialize(value) {
  //     return value;
  //   },
  //   parseValue(value) {
  //     return value;
  //   },
  //   parseLiteral(ast) {
  //     return ast.value;
  //   },
  // }),
};

export default resolvers;
