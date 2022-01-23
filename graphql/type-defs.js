const type_defs = `
    input AuthPayload {
        email: String!
        name: String
        password: String
        auth_type: String!
    }

    type User {
        id: String
        email: String
        name: String
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
