import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getFeedDefaultType(_, { limit, order, page }, { user }) {
  const feed_count = await prisma.feed.count({
    where: {
      account_id: user.id,
    },
  });

  const total_pages = feed_count / limit;

  const jump = page > 1 ? (page - 1) * limit : 0;

  const feed = await prisma.feed.findMany({
    where: {
      account_id: user.id,
    },
    orderBy: {
      created_at: order,
    },
    skip: jump,
    take: limit,
    include: {
      subscription: true,
    },
  });

  return {
    limit,
    total_pages,
    current_page: page,
    feed,
  };
}

export async function getFeedDefaultTypeWithFilter(
  _,
  { limit, order, page, filters },
  { user }
) {
  const feed_count = await prisma.feed.count({
    where: {
      account_id: user.id,
    },
  });

  const parsed_filters = filters.map((item) => {
    return {
      [item.key]: item.value,
    };
  });

  const where_condition =
    parsed_filters.length > 0
      ? {
          AND: [
            {
              account_id: user.id,
            },
            ...parsed_filters,
          ],
        }
      : {
          account_id: user.id,
        };

  const total_pages = feed_count / limit;

  const jump = page > 1 ? (page - 1) * limit : 0;

  const feed = await prisma.feed.findMany({
    where: where_condition,
    orderBy: {
      created_at: order,
    },
    skip: jump,
    take: limit,
    include: {
      subscription: true,
    },
  });

  return {
    limit,
    total_pages,
    current_page: page,
    feed,
    filters
  };
}

export async function searchFeedSubject(
  _,
  { limit, cursor, jump, order, query },
  { user }
) {
  const condition =
    cursor && jump
      ? {
          take: limit,
          skip: jump,
          cursor: {
            id: cursor,
          },
        }
      : {
          take: limit,
        };

  const feed = await prisma.feed.findMany({
    orderBy: {
      created_at: order,
    },
    where: {
      account_id: user.id,
      title: {
        search: query,
      },
    },
    ...condition,
    include: {
      subscription: true,
    },
  });

  const last_feed_item = feed[feed.length - 1];

  const new_cursor = last_feed_item.id;

  return {
    limit,
    cursor: new_cursor,
    order,
    feed,
  };
}

export async function getFeedCursorType(
  _,
  { limit, cursor, jump, order },
  { user }
) {
  const condition =
    cursor && jump
      ? {
          take: limit,
          skip: jump,
          cursor: {
            id: cursor,
          },
        }
      : {
          take: limit,
        };

  const feed = await prisma.feed.findMany({
    orderBy: {
      created_at: order,
    },
    where: {
      account_id: user.id,
    },
    ...condition,
    include: {
      subscription: true,
    },
  });

  const last_feed_item = feed[feed.length - 1];

  const new_cursor = last_feed_item.id;

  return {
    limit,
    cursor: new_cursor,
    order,
    feed,
  };
}

export async function getFeedCursorTypeWithFilters(
  _,
  { limit, cursor, jump, order, filters },
  { user }
) {
  const parsed_filters = filters.map((item) => {
    return {
      [item.key]: item.value,
    };
  });

  const where_condition =
    parsed_filters.length > 0
      ? {
          AND: [
            {
              account_id: user.id,
            },
            ...parsed_filters,
          ],
        }
      : {
          account_id: user.id,
        };

  const condition =
    cursor && jump
      ? {
          take: limit,
          skip: jump,
          cursor: {
            id: cursor,
          },
        }
      : {
          take: limit,
        };

  const feed = await prisma.feed.findMany({
    orderBy: {
      created_at: order,
    },
    where: where_condition,
    ...condition,
    include: {
      subscription: true,
    },
  });

  const last_feed_item = feed[feed.length - 1];

  const new_cursor = last_feed_item && last_feed_item.id ? last_feed_item.id : null;

  return {
    limit,
    cursor: new_cursor,
    order,
    feed,
    filters
  };
}
