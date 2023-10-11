import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { CredentialContext } from "../util/GoogleCredentialsProvider";
import { useContext, useMemo, useState } from "react";
import { User } from "../types/user";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export const apiBase = "https://localhost:32768";

const GET = <T>(instance: AxiosInstance, url: string, config?: AxiosRequestConfig<any>) =>
  instance.get(url, config).then((response) => response.data as T);

const POST = <T, V>(
  instance: AxiosInstance,
  url: string,
  data?: T,
  config?: AxiosRequestConfig<any>,
) => instance.post(url, data, config).then((response) => response.data as V);

class UserApi {
  instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  getUser() {
    return GET<User>(this.instance, "user");
  }
}

export default function useApi() {
  const [credential] = useContext(CredentialContext);

  return useMemo(() => {
    console.log("refreshing api", credential);
    const axiosInstance = axios.create({
      baseURL: apiBase + "/api",
      headers: {
        Authorization: `Bearer ${credential}`,
      },
    });

    return {
      user: new UserApi(axiosInstance),
    };
  }, [credential]);
}
