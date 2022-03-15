import { GraphQLScalarType } from "graphql";
import {
  authenticateUser,
  checkEmail,
  fetchProfile,
} from "../controllers/auth/authenticate";
import {
  getFeedCursorType,
  getFeedCursorTypeWithFilters,
  getFeedDefaultType,
  getFeedDefaultTypeWithFilter,
  searchFeedSubject,
  markFeedItemAsHidden,
  markFeedItemAsRead,
  deleteFeedItem,
  getSingleFeed,
} from "../controllers/feed";
import { createPlan } from '../controllers/plan'
import {
  getCategories,
  getCreatorsByCategory,
  getCreatorCount,
  createCategory,
  assignCreatorToCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category";
import { checkUserName } from "../controllers/auth/authenticate";
import { protectQuery } from "../middleware/auth";

const resolvers = {
  Query: {
    profile: fetchProfile,
    is_claimed: async (...args) => checkUserName(...args),
    has_account: async (...args) => checkEmail(...args),
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
    group: async (_, args, ctx, ...rest) => {
      return await getCategories(_, args, ctx, getCategories, ...rest);
    },
    creators: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, getCreatorsByCategory, ...rest);
    },
    stats: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, getCreatorCount, ...rest);
    },
    issue: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, getSingleFeed, ...rest);
    }
  },
  Mutation: {
    authenticateUser: authenticateUser,
    markFeedItemAsHidden: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, markFeedItemAsHidden, ...rest);
    },
    markFeedItemAsRead: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, markFeedItemAsRead, ...rest);
    },
    deleteFeedItem: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, deleteFeedItem, ...rest);
    },
    deleteCategory: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, deleteCategory, ...rest);
    },
    updateCategory: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, updateCategory, ...rest);
    },
    assignCreatorToCategory: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, assignCreatorToCategory, ...rest);
    },
    createCategory: async (_, args, ctx, ...rest) => {
      return await protectQuery(_, args, ctx, createCategory, ...rest);
    },
    plan: createPlan
  },
};

export default resolvers;
