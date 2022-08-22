import Mailgun from 'mailgun-js';

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = Mailgun({ apiKey: API_KEY, domain: DOMAIN });

export async function sendEmail(from, to, subject, text, html) {
    const messageData = {
        from: 'Rua <mailgun@alerts.userua.com>',
        to,
        subject,
        text: html,
        html
    }

    try {
        return new Promise((resolve, reject) => {
            mg.messages().send(messageData, (error, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            })
        })
    } catch (error) {
        console.error(error);
    }
}