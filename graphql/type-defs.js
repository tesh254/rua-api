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

    type Subscription {
        id: String
        source_email: String
        source_name: String
        platform_domain: String
        source_avatar: String
        created_at: String
        updated_at: String
    }

    input FilterItemInput {
        key: String
        value: String
    }

    type FeedItem {
        id: String
        title: String
        feed_hosted_url: String
        is_read: Boolean
        is_hidden: Boolean
        subscription: Subscription
        created_at: String
        updated_at: String
    }

    type FilterItem {
        key: String
        value: String
    }

    type FeedResponse {
        feed: [FeedItem]
        limit: Int
        total_pages: Int
        current_page: Int
        cursor: String
        order: String
        filters: [FilterItem]
    }

    type Query {
        profile: User
        feed_default(limit: Int!, order: String!, page: Int!): FeedResponse
        feed_default_filter(limit: Int!, order: String!, page: Int!, filters: [FilterItemInput]): FeedResponse
        feed_cursor(limit: Int!, cursor: String, jump: Int!, order: String!): FeedResponse
        feed_cursor_filter(limit: Int!, cursor: String, jump: Int!, order: String!, filters: [FilterItemInput]): FeedResponse
        feed_search(limit: Int!, query: String!, order: String!, cursor: String): FeedResponse
    }
`;

export default type_defs;
