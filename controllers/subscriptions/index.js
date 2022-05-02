import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSubscriptions(_, _args, { user }) {
    try {
        const subscriptions = await prisma.accountOnSubscriptions.findMany({
            where: {
                AND: [
                    {
                        id: user.id,
                    },
                    {
                        is_unsubscribed: true
                    }
                ]
            },
            include: {
                account: true,
                subscription: true,
                category: true,
            }
        });

        return subscriptions;
    } catch (error) {
        throw new Error(error.message)
    }
}

export async function unsubscribe(_, { subscription_id }, { user }) {
    
}
