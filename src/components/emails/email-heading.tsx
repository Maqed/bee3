import React from "react";
import { Heading, Section, Hr } from "@react-email/components";

function EmailHeading() {
  return (
    <>
      <Section className="py-5">
        <Heading
          as="h1"
          className="text-center text-2xl font-bold text-primary"
        >
          Bee3
        </Heading>
      </Section>
      <Hr style={{ borderTop: "1px solid #eaeaea" }} />
    </>
  );
}

export default EmailHeading;
