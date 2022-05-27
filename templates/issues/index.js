export function generateIssues(issues) {
  return `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Issues - Rua</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            </style>
        </head>
        
        <body style="font-family: 'Space Grotesk', sans-serif !important;width:100%;">
            <section
                style="background:#fff;display:flex;flex-direction:column;justify-content: center;text-align: center;place-items: center;">
                <img src="https://res.cloudinary.com/duoxba7n1/image/upload/v1652908685/assets/rua-app-icon_1.png" alt=""
                    style="width:60px;" />
                <h3 style="margin:8px 0px;font-weight: bold;">
                    Hey 👋,
                </h3>
                <p style="margin:8px 0px;">
                    You have some issues to catch up on.
                </p>
                <hr>
                <ul style="list-style-type: none; padding:0px; text-align: left; max-width: 520px;">
                    ${issues
                      .map((issue) => {
                        return `<li style="padding: 4px 0px; border-bottom: 1px solid #c4c4c4;">
                            <p><strong>${issue.title} </strong> by <strong>${issue.creator}</strong> dropped <strong>${issue.release_date}</strong></p>
                        </li>`;
                      })
                      .join("")}
                </ul>
                <p>
                    Plus 5 more issues to catch up on.
                </p>
                <a href="https://userua.com/inbox" target="_blank">
                    <button
                        style="background: #cb0c0c;border:none;outline:none;padding:16px;font-weight: bold;font-size:16px;color:white;border-radius: 4px;cursor:pointer;">
                        Go to Inbox
                    </button>
                </a>
                <p>
                    <code>
                        You are receiving this email because <br> you are a Rua user, change email <br>preferences in account settings
                    </code>
                </p>
            </section>
        </body>
        
        </html>
        `;
}
