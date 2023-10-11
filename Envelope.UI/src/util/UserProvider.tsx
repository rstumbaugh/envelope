import { createContext, useEffect, useReducer } from "react";
import { User } from "../types/user";
import useApi from "../api/api";

type UserContextType = { user: User | undefined };

function reducer(_oldContext: UserContextType, newContext: UserContextType) {
  return newContext;
}

export const UserContext = createContext<UserContextType>({ user: undefined });

export default function UserProvider(props: { children: any }) {
  const [user, dispatch] = useReducer(reducer, { user: undefined });

  const api = useApi();
  useEffect(() => {
    api.user
      .getUser()
      .then((user) => {
        console.log("found user", user);
        dispatch({ user });
      })
      .catch((err) => {
        console.error("error getting user", err);
        dispatch({ user: undefined });
      });
  }, [api.user]);

  return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>;
}
