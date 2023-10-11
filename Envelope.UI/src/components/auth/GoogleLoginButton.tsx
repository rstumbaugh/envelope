import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { CredentialContext } from "../../util/GoogleCredentialsProvider";

export default function GoogleLoginButton() {
  const [, setCredential] = useContext(CredentialContext);

  return (
    <GoogleLogin
      onSuccess={({ credential }) => {
        setCredential(credential || "");
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}
