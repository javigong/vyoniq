import * as React from "react";

interface WaitlistWelcomeEmailProps {
  name: string;
}

export const WaitlistWelcomeEmail: React.FC<
  Readonly<WaitlistWelcomeEmailProps>
> = ({ name }) => (
  <div>
    <h1>
      Welcome to the <a href="https://vyoniq.com/">Vyoniq</a> Waitlist, {name}!
    </h1>
    <p>
      Thank you for signing up. We're thrilled to have you on board as we
      prepare to launch Vyoniq Tables.
    </p>
    <p>
      We are hard at work building a revolutionary, AI-powered data management
      solution, and you are now one of the first in line to get access.
    </p>
    <p>We'll be in touch with more updates soon. Stay tuned!</p>
    <br />
    <p>Best regards,</p>
    <p>The Vyoniq Team</p>
  </div>
);
