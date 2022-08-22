import { PrismaClient } from "@prisma/client";
import { EmailDeleteQueue as deleteS3FileQueue } from "../../bullmq/issue-handler";

const prisma = new PrismaClient();

export async function deleteFeedItem(_, { feed_id }, { user }) {
  const feed = await prisma.feed.findFirst({
    where: {
      AND: [
        {
          id: feed_id,
        },
        {
          account_id: user.id,
        },
      ],
    },
  });

  const prev_feed = {
    ...feed,
  };

  const host_url = feed.feed_hosted_url;

  await deleteS3FileQueue.add("delete-s3-file", {
    host_url,
  });

  await prisma.feed.delete({
    where: {
      id: feed_id,
    },
  });

  return prev_feed;
}

export async function markFeedItemAsRead(
  _,
  { feed_id, current_status },
  { user }
) {
  const feed = await prisma.feed.findFirst({
    where: {
      AND: [
        {
          id: feed_id,
        },
        {
          account_id: user.id,
        },
      ],
    },
  });

  if (!feed) {
    throw new Error("Issue does not exists");
  } else {
    const update_feed = await prisma.feed.update({
      where: {
        id: feed_id,
      },
      data: {
        is_read: !current_status,
      },
    });

    return update_feed;
  }
}

export async function markFeedItemAsHidden(
  _,
  { feed_id, current_status },
  { user }
) {
  const feed = await prisma.feed.findFirst({
    where: {
      AND: [
        {
          id: feed_id,
        },
        {
          account_id: user.id,
        },
      ],
    },
  });

  if (!feed) {
    throw new Error("Issue not found");
  } else {
    const update_feed = await prisma.feed.update({
      where: {
        id: feed_id,
      },
      data: {
        is_hidden: !current_status,
      },
    });

    return update_feed;
  }
}

export async function getFeedDefaultType(_, { limit, order, page }, { user }) {
  const feed_count = await prisma.feed.count({
    where: {
      account_id: user.id,
    },
  });

  console.log(feed_count);

  const total_pages =
    parseInt(Math.round(feed_count / limit), 10) < 1
      ? 1
      : parseInt(Math.round(feed_count / limit), 10);

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

  const total_pages =
    parseInt(Math.round(feed_count / limit), 10) < 1
      ? 1
      : parseInt(Math.round(feed_count / limit), 10);

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
    filters,
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

export async function getSingleFeed(_, { feed_id }, { user }) {
  const feed = await prisma.feed.findFirst({
    where: {
      AND: [
        {
          account_id: user.id,
        },
        {
          id: feed_id,
        },
      ],
    },
    include: {
      subscription: true,
    },
  });

  if (!feed) {
    throw new Error("Cannot find the newsletter issue");
  }

  return feed;
}

export async function markIssueAsRead(_, { feed_id }, { user }) {
  const feed = await prisma.feed.findFirst({
    where: {
      AND: [
        {
          account_id: user.id,
        },
        {
          id: feed_id,
        },
      ],
    },
  });

  if (feed) {
    const updateFeed = await prisma.feed.update({
      where: {
        id: feed_id,
      },
      data: {
        is_read: !feed.is_read,
      },
    });

    return updateFeed;
  } else {
    throw new Error("Cannot find the newsletter issue");
  }
}

export async function markIssueAsHidden(_, { feed_id }, { user }) {
  const feed = await prisma.feed.findFirst({
    where: {
      AND: [
        {
          account_id: user.id,
        },
        {
          id: feed_id,
        },
      ],
    },
  });

  if (feed) {
    const updateFeed = await prisma.feed.update({
      where: {
        id: feed_id,
      },
      data: {
        is_hidden: !feed.is_hidden,
      },
    });

    return updateFeed;
  } else {
    throw new Error("Cannot find the newsletter issue");``
  }
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

  const new_cursor =
    last_feed_item && last_feed_item.id ? last_feed_item.id : null;

  return {
    limit,
    cursor: new_cursor,
    order,
    feed,
    filters,
  };
}
