import * as React from "react";

interface EmailVerificationTokenProps {
  name: string;
  confirmLink: string;
}

export const EmailVerificationToken: React.FC<
  Readonly<EmailVerificationTokenProps>
> = ({ name, confirmLink }) => (
  <div>
    <nav>
      <h1 className="text-2xl">Bee3Live</h1>
    </nav>
    <h2 className="text-xl">Welcome, {name}!</h2>
    <p className="text-lg">
      Click <a href={confirmLink}>here</a> to confirm email.
    </p>
  </div>
);
