import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleCredentialsProvider from "./util/GoogleCredentialsProvider.tsx";
import config from "./config.json";
import UserProvider from "./util/UserProvider.tsx";
import Budget from "./pages/Budget.tsx";
import Account from "./components/account/Account.tsx";
import MonthlyBudget from "./components/budget/MonthlyBudget.tsx";
import ConnectionContextProvider from "./util/ConnectionProvider.tsx";
import StoreProvider from "./store/store.tsx";

export interface LoaderData {
  budgetId: string;
  accountId: string;
}

const idLoader = ({ params }: any) => ({ budgetId: params.id, accountId: params.accountId });

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/budget/:id",
        element: <Budget />,
        loader: idLoader,
        children: [
          {
            path: "/budget/:id",
            element: <MonthlyBudget />,
            loader: idLoader,
          },
          {
            path: "/budget/:id/account/:accountId",
            element: <Account />,
            loader: idLoader,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleCredentialsProvider>
      <UserProvider>
        <ConnectionContextProvider>
          <StoreProvider>
            <GoogleOAuthProvider clientId={config.googleClientId}>
              <RouterProvider router={router} />
            </GoogleOAuthProvider>
          </StoreProvider>
        </ConnectionContextProvider>
      </UserProvider>
    </GoogleCredentialsProvider>
  </React.StrictMode>,
);
