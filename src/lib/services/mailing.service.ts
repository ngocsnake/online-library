import Mailgun from 'mailgun.js';
import { appEnv } from '../configs/env';

const mailgun = new Mailgun(FormData);

class MailingService {
  getClient() {
    const mailgunKey = appEnv.maigun.apiKey;
    if (!mailgunKey) throw new Error("Please configure mailgun first!");

    return mailgun.client({
      username: 'api',
      key: mailgunKey
    })
  }
  sendEmail(to: string, subject: string, body: string) {
    const client = this.getClient();
    return client.messages.create(appEnv.maigun.domain ?? 'dev.stable.vn', {
      to,
      from: 'noreply@dfreebooks.com',
      subject,
      html: body,
    });
  }
}

export default new MailingService();
