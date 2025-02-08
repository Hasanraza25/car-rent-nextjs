import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="clerk-sign-in-page">
      <SignIn />
    </div>
  );
};

export default SignInPage;