import { PrismaClient } from "@prisma/client";
import { encode } from "../../helpers/jwt";
import { checkPass, hashPass } from "../../helpers/password";

const prisma = new PrismaClient();

export async function fetchAccount(user_id) {
  return await prisma.account.findFirst({
    where: {
      id: user_id,
    },
    include: {
      plan: true,
    },
  });
}

export async function checkUserName(_, { username }) {
  const user = await prisma.account.findFirst({
    where: {
      username: username,
    },
  });

  return !!user;
}

export async function checkEmail(_, { email }) {
  const user = await prisma.account.findFirst({ where: { email: email } });

  return user && user.id ? true : false;
}

export async function saveUser(data, has_pass) {
  const { username } = data;

  const clean_username = username.toLowerCase().replace(/\s/g, "");

  const isExists = await checkUserName(null, { username: clean_username });

  if (isExists) {
    throw new Error("Username already exists");
  } else {
    const hash = await hashPass(data.password);
    const correctData = has_pass
      ? {
          ...data,
          password: hash,
        }
      : data;

    const newUser = await prisma.account.create({
      data: {
        ...correctData,
        username: clean_username,
        in_app_email: `${clean_username}@rua-mail.com`,
      },
    });

    return newUser;
  }
}

export async function fetchProfile(_, args, ctx) {
  const { user } = ctx;

  if (!user) {
    throw new Error("You are not logged in");
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    in_app_email: user.in_app_email,
    is_expired: (user.plan && user.plan.is_expired) || true,
    plan_name: user.plan && user.plan.name,
    plan_slug: user.plan && user.plan.plan_slug,
    is_onboarded: user?.is_onboarded,
  };
}

export async function authenticateUser(_, { payload }) {
  try {
    const response = await prisma.account.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (!response) {
      const newUser = await saveUser(payload);

      return {
        token: encode({
          id: newUser.id,
        }),
        user: {
          id: newUser.id,
          email: newUser.email,
          username: response.username ?? newUser.username,
          in_app_email: newUser.in_app_email,
          is_expired: (newUser.plan && newUser.plan.is_expired) || true,
          plan_name: newUser.plan && newUser.plan.name,
          plan_slug: newUser.plan && newUser.plan.plan_slug,
          is_onboarded: newUser.is_onboarded,
        },
      };
    }
    return {
      token: encode({
        id: response.id,
      }),
      user: {
        id: response.id,
        email: response.email,
        username: response.username,
        in_app_email: response.in_app_email,
        is_expired: (response.plan && response.plan.is_expired) || true,
        plan_name: response.plan && response.plan.name,
        plan_slug: response.plan && response.plan.plan_slug,
        is_onboarded: response.is_onboarded,
      },
    };
  } catch (error) {
    throw new Error(error);
  }
}
