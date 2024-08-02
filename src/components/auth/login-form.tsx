import CardWrapper from "@/components/auth/card-wrapper";

function LoginForm() {
  return (
    <CardWrapper
      headerLabel="Welcome Back!"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
    ></CardWrapper>
  );
}

export default LoginForm;
