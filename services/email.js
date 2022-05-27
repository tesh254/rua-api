import formData from 'form-data';
import Mailgun from 'mailgun.js';
import axios from 'axios';

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'api', key: API_KEY });

export async function sendEmail(from, to, subject, text, html) {
    const messageData = {
        from: 'Rua <erick@samples.mailgun.org>',
        to: to.join(','),
        subject,
        text,
        html
    }

    try {
        const response = await client.messages.create(DOMAIN, messageData);

        console.log({ response });
    } catch (error) {
        console.error(error);
    }
}