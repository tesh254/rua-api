import mjml2html from "mjml";

export const generateReminderEmailTemplate = (issues) =>
  mjml2html(`
  <mjml>
  <mj-head>
     <mj-style>
     @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  
     * {
        font-family: 'Space Grotesk', sans-serif;
     }
     </mj-style>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
  
        <mj-image width="100px" src="https://res.cloudinary.com/duoxba7n1/image/upload/v1652908685/assets/rua-app-icon_1.png"></mj-image>
        
        <mj-text font-size="20px" font-weight="bold">
        Hey 👋</mj-text>
  
        <mj-text font-size="16px">
            You have some unread issues.
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
        <mj-column>
        ${issues
          .map((issue) => {
            return `<mj-text font-size="14px" line-height="1.5">
                <strong>${issue.title} </strong> by <strong>${issue.creator}</strong> dropped <strong>${issue.release_date}</strong>
                </mj-text><mj-divider border-width="1px" border-color="#c4c4c4">
                </mj-divider>`;
          })
          .join("")}
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
            <mj-button padding="8px" font-size="16px" border-radius="4px" href="https://userua.com/inbox" target="_blank" background-color="#cb0c0c">
              Go to <strong>Inbox </strong>📥
          </mj-button>
      </mj-column>
    </mj-section>
    <mj-section>
        <mj-column>
          <mj-text font-style="italic" >
            You are receiving this email because you hold an account in Rua, change your email preference in account settings
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
  </mjml>
`);
