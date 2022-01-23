import {
  authenticateUser,
  fetchProfile,
} from "../controllers/auth/authenticate";

const resolvers = {
    Query: {
        profile: fetchProfile
    },
    Mutation: {
        authenticateUser: authenticateUser
    }
}

export default resolvers;