import { PrismaClient } from "@prisma/client";
import { encode } from "../../helpers/jwt";
import { checkPass, hashPass } from "../../helpers/password";

const prisma = new PrismaClient();

export async function fetchAccount(user_id) {
  return await prisma.account.findUnique({
    where: {
      id: user_id,
    },
    include: {
      plan: true,
    },
  });
}

export async function fetchProfile(_, args, ctx) {
  const { user } = ctx;

  if (!user) {
    throw new Error("You are not logged in");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    is_expired: (user.plan && user.plan.is_expired) || true,
    plan_name: user.plan && user.plan.name,
    plan_slug: user.plan && user.plan.plan_slug,
  };
}

export async function authenticateUser(_, { payload }) {
  try {
    const response = await prisma.account.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (response) {
      if (payload.auth_type === "local" && payload.password) {
        const passResponse = await checkPass(
          payload.password,
          response.password
        );
        if (passResponse) {
          return {
            token: encode({
              id: response.id,
              email: response.email,
            }),
            user: {
              id: response.id,
              email: response.email,
              name: response.name,
              is_expired: (response.plan && response.plan.is_expired) || true,
              plan_name: response.plan && response.plan.name,
              plan_slug: response.plan && response.plan.plan_slug,
            },
          };
        } else {
          throw new Error("Invalid password");
        }
      } else {
        return {
          token: encode({
            id: response.id,
            email: response.email,
          }),
          user: {
            id: response.id,
            email: response.email,
            name: response.name,
            is_expired: (response.plan && response.plan.is_expired) || true,
            plan_name: response.plan && response.plan.name,
            plan_slug: response.plan && response.plan.plan_slug,
          },
        };
      }
    } else {
      if (payload.auth_type === "local" && payload.password) {
        const hashedPass = await hashPass(payload.password);
        const newUser = await prisma.account.create({
          data: {
            email: payload.email,
            password: hashedPass,
            name: payload.name,
            auth_type: payload.auth_type,
          },
        });

        return {
          token: encode({
            id: newUser.id,
            email: newUser.email,
          }),
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            is_expired: (newUser.plan && newUser.plan.is_expired) || true,
            plan_name: newUser.plan && newUser.plan.name,
            plan_slug: newUser.plan && newUser.plan.plan_slug,
          },
        };
      } else {
        const newUser = await prisma.account.create({
          data: {
            email: payload.email,
            name: payload.name,
            auth_type: payload.auth_type,
          },
        });

        return {
          token: encode({
            id: newUser.id,
            email: newUser.email,
          }),
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            is_expired: (newUser.plan && newUser.plan.is_expired) || true,
            plan_name: newUser.plan && newUser.plan.name,
            plan_slug: newUser.plan && newUser.plan.plan_slug,
          },
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
