import { createContext, useReducer, Dispatch, useContext } from "react";
import _ from "lodash";

const localStorageKey = "googleAuthCredential";

const initialCredential: string = localStorage.getItem(localStorageKey) || "";

const setCredential = (_oldCred: string, newCred: string) => {
  localStorage.setItem(localStorageKey, newCred);
  return newCred;
};

export type CredentialContextType = [credential: string, setCredential: Dispatch<string>];

export const CredentialContext = createContext<CredentialContextType>(["", {} as Dispatch<string>]);

export default function GoogleCredentialsProvider(props: { children: any }) {
  const [credential, dispatch] = useReducer(setCredential, initialCredential);
  return (
    <CredentialContext.Provider value={[credential, dispatch]}>
      {props.children}
    </CredentialContext.Provider>
  );
}
