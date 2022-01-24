const type_defs = `
    input AuthPayload {
        email: String!
        username: String
        password: String
        user_avatar: String
        auth_type: String!
    }

    type User {
        id: String
        email: String
        username: String
        in_app_email: String
        is_expired: Boolean
        plan_name: String
        plan_slug: String
    }

    type AuthResponse {
        token: String!
        user: User!
    }

    type Mutation {
        authenticateUser(payload: AuthPayload!): AuthResponse
    }

    type Query {
        profile: User
    }
`;

export default type_defs;
