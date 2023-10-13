import { useContext, useState } from "react";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import { UserContext } from "../util/UserProvider";

export default function Home(props: any) {
  //const [, setCredential] = useContext(CredentialContext);
  //const loggedIn = useLoggedIn();

  const { user } = useContext(UserContext);

  return (
    <div>
      Home page
      <br />
      <br />
      <p>Name: {user?.name}</p>
      <GoogleLoginButton />
    </div>
  );
}
