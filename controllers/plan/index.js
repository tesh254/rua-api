import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

export async function createPlan(_, {
    email,
    paddle
}) {
    const user = await prisma.account.findFirst({
        where: {
            email,
        }
    })

    if (user) {
        const currentPlan = await prisma.plan.findFirst({
            where: {
                subscriber_id: user.id
            }
        })

        if (currentPlan) {
            const updatePlan = await prisma.plan.update({
                where: {
                    subscriber_id: user.id
                },
                data: {
                    plan_slug:slugify(paddle.plan_name),
                    name: paddle.plan_name,
                    price: parseFloat(paddle.sale_gross),
                    price_currency: paddle.currency,
                    price_start_date: new Date().toISOString(),
                    price_end_date: new Date(paddle.next_bill_date).toISOString(),
                    is_expired: false,
                    subscriber_id: user.id,
                    paddle_plan_id: paddle.subscription_id,
                    receipt_url: paddle.receipt_url,
                    plan_status: paddle.status,
                    last_event_time: new Date(paddle.event_time),
                    checkout_id: paddle.checkout_id,
                    transaction_status: paddle.alert_name,
                    paddle_customer_id: paddle.paddle_subscription_id,
                    unit_price: parseFloat(paddle.earnings)
                }
            })
    
            return updatePlan;
            
        } else {
            const newPlan = await prisma.plan.create({
                data: {
                    plan_slug:slugify(paddle.plan_name),
                    name: paddle.plan_name,
                    price: parseFloat(paddle.sale_gross),
                    price_currency: paddle.currency,
                    price_start_date: new Date().toISOString(),
                    price_end_date: new Date(paddle.next_bill_date).toISOString(),
                    is_expired: false,
                    subscriber_id: user.id,
                    paddle_plan_id: paddle.subscription_id,
                    receipt_url: paddle.receipt_url,
                    plan_status: paddle.status,
                    last_event_time: new Date(paddle.event_time),
                    checkout_id: paddle.checkout_id,
                    transaction_status: paddle.alert_name,
                    unit_price: parseFloat(paddle.earnings)
                }
            })
    
            return newPlan;
        }
    } else {
        throw new Error("No account associated with that email exists in Rua");
    }
}

