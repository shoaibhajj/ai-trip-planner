import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <SignIn redirectUrl={"/create-trip"} />
    </div>
  );
};

export default SignInPage;
