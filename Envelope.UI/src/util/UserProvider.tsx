import { createContext, useEffect, useState } from "react";
import { User } from "../types/user";
import useApi from "../api/api";

type UserContextType = { user: User | undefined };

export const UserContext = createContext<UserContextType>({ user: undefined });

export default function UserProvider(props: { children: any }) {
  const [user, setUser] = useState<UserContextType>({ user: undefined });

  const api = useApi();
  useEffect(() => {
    api.user
      .getUser()
      .then((user) => {
        console.log("found user", user);
        setUser({ user });
      })
      .catch((err) => {
        console.error("error getting user", err);
        setUser({ user: undefined });
      });
  }, [api.user]);

  return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>;
}
