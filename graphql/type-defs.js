const type_defs = `
    input AuthPayload {
        email: String!
        username: String
        password: String
        account_avatar: String
        auth_type: String!
    }

    input TogglePayload {
        feed_id: String
        current_status: Boolean
    }

    type User {
        id: String
        email: String
        username: String
        in_app_email: String
        is_expired: Boolean
        plan_name: String
        plan_slug: String
        is_onboarded: Boolean
    }

    type AuthResponse {
        token: String!
        user: User!
    }

    type AssignmentResponse {
        is_done: Boolean
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
        value: Boolean
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
        value: Boolean
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

    type CategoryItem {
        id: String
        name: String
        name_slug: String
        created_at: String
        updated_at: String
    }

    type CreatorItem {
        id: String
        source_email: String
        source_name: String
        platform_domain: String
        source_avatar: String
        created_at: String
        updated_at: String
    }

    type CreatorCategoryResponse {
        id: String
        account: User
        subscription: CreatorItem
        category: CategoryItem
        created_at: String
        updated_at: String
        category_id: String
        subscription_id: String
        account_id: String
    }

    type Stats {
        total_subs: Int
    }

    type Query {
        profile: User
        is_claimed(username: String!): Boolean
        has_account(email: String!): Boolean
        feed_default(limit: Int!, order: String!, page: Int!): FeedResponse
        feed_default_filter(limit: Int!, order: String!, page: Int!, filters: [FilterItemInput]): FeedResponse
        feed_cursor(limit: Int!, cursor: String, jump: Int!, order: String!): FeedResponse
        feed_cursor_filter(limit: Int!, cursor: String, jump: Int!, order: String!, filters: [FilterItemInput]): FeedResponse
        feed_search(limit: Int!, query: String!, order: String!, cursor: String, jump: Int!): FeedResponse
        
        group: [CategoryItem]
        creators(category_id: String): [CreatorCategoryResponse]
        stats: Stats

    }

    type Mutation {
        authenticateUser(payload: AuthPayload!): AuthResponse

        markFeedItemAsHidden(feed_id: String, current_status: Boolean): FeedItem
        markFeedItemAsRead(feed_id: String, current_status: Boolean): FeedItem
        deleteFeedItem(feed_id: String): FeedItem

        createCategory(name: String): CategoryItem
        assignCreatorToCategory(creator_id: String!, category_id: String!): CreatorCategoryResponse
        updateCategory(category_id: String!, name: String!): CategoryItem
        deleteCategory(category_id: String!): CategoryItem 
    }
`;

export default type_defs;
