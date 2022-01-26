import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkIfEmailExist(_email) {
    const account = await prisma.account.findFirst({
        where: {
            in_app_email: _email,
        }
    })

    if (account && account.id) {
        return true;
    } else {
        return false;
    }
}