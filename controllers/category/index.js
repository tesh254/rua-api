import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

export async function getCategories(_, value, { user }) {
  const categories = await prisma.category.findMany({
    where: {
      account_id: user.id,
    },
  });

  return categories;
}

export async function getCreatorsByCategory(_, { category_id }, { user }) {
  console.log({ category_id });
  const where_condition = category_id
    ? {
        AND: [
          {
            category_id: category_id,
          },
          {
            account_id: user.id,
          },
        ],
      }
    : {
        account_id: user.id,
      };

  const creators = await prisma.accountOnSubscriptions.findMany({
    where: where_condition,
    include: {
      subscription: true,
      account: true,
      category: true,
    },
  });

  return creators;
}

export async function getCreatorCount(_, {}, { user }) {
  const creators = await prisma.accountOnSubscriptions.count({
    where: {
      account_id: user.id,
    },
  });

  return {
    total_subs: creators,
  };
}

function generateRandomInteger(max) {
  return Math.floor(Math.random() * max) + 1;
}

export async function createCategory(_, { name }, { user }) {
  const category = await prisma.category.create({
    data: {
      account_id: user.id,
      name,
      name_slug: slugify(name) + "-" + generateRandomInteger(9999),
    },
  });

  return category;
}

export async function assignCreatorToCategory(
  _,
  { creator_id, category_id },
  { user }
) {
  const creator = await prisma.accountOnSubscriptions.findFirst({
    where: {
      AND: [
        {
          subscription_id: creator_id,
        },
        {
          account_id: user.id,
        },
      ],
    },
  });

  if (!creator) {
    throw new Error("Subscription does not exist");
  } else {
    const newData = await prisma.accountOnSubscriptions.update({
      where: {
        id: creator.id,
      },
      data: {
        category_id,
      },
      include: {
        account: true,
        subscription: true,
        category: true,
      },
    });

    return newData;
  }
}

export async function updateCategory(_, { category_id, name }, { user }) {
  const category = await prisma.category.findFirst({
    where: {
      AND: [
        {
          id: category_id,
        },
        {
          account_id: user.id,
        },
      ],
    },
  });

  if (!category) {
    throw new Error("Group does not exist");
  }

  const past_category = {
    ...category,
  };

  const new_category = await prisma.category.update({
    where: {
      id: past_category.id,
    },
    data: {
      name,
      name_slug: slugify(name) + "-" + generateRandomInteger(9999),
    },
  });

  return new_category;
}

export async function deleteCategory(_, { category_id }, { user }) {
  const category = await prisma.category.findFirst({
    where: {
      AND: [
        {
          id: category_id,
        },
        {
          account_id: user.id,
        },
      ],
    },
  });

  if (!category) {
    throw new Error("Group does not exist");
  }

  const past_category = {
    ...category,
  };

  await prisma.category.delete({
    where: {
      id: past_category.id,
    },
  });

  const link = await prisma.accountOnSubscriptions.findFirst({
    where: {
      AND: [
        {
          category_id: past_category.id,
        },
        {
          account_id: user.id
        }
      ]
    }
  })

  if (link) {
    await prisma.accountOnSubscriptions.update({
      where: {
        id: link.id,
      },
      data: {
        category_id: null,
      },
    });
  }

  return past_category;
}
