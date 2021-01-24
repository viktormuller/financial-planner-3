import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BankAccount, FinancialAccount, FP_API } from "financial-planner-api";
import { Holding } from "financial-planner-api";
import { useEffect, useState } from "react";

export class AxiosFPClient implements FP_API {
  private client: AxiosInstance;
  accessToken: string;
  constructor() {
    let PROTOCOL = process.env.REACT_APP_SERVER_PROTOCOL || "https";
    let HOST = process.env.REACT_APP_SERVER_HOST;
    let PORT = process.env.REACT_APP_SERVER_PORT || (PROTOCOL === "http" ? 80 : 443);
    this.client = axios.create(
      {
        baseURL: `${PROTOCOL}://${HOST}:${PORT}/api/`
      }
    )

    this.client.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
      return config;
    })

  }
  async getCashFlowAccounts(userId?: string): Promise<FinancialAccount[]> {
    const cfAccounts = (await this.client.get<any, AxiosResponse<{ accounts: FinancialAccount[] }>>("CashFlowAccounts")).data.accounts;
    return cfAccounts;
  }
  async getHoldings(): Promise<Holding[]> {
    const holdings = (await this.client.get<any, AxiosResponse<{ holdings: Holding[] }>>("Holdings")).data.holdings;
    return holdings;
  }

  async getBankAccounts(): Promise<BankAccount[]> {
    const accounts = (await this.client.get<any, AxiosResponse<{ accounts: BankAccount[] }>>(`BankAccounts`)).data.accounts;
    return accounts;
  }



  async getLinkToken() {
    const response = await this.client.get("link_token");
    return response.data.link_token;
  }

  async setPublicToken(publicToken: string) {
    const response = await this.client.post("set_access_token", {
      public_token: publicToken
    });
    return response.data.itemId;
  }

  async hasPlaidAccessToken() {
    const response = await this.client
      .get<any, AxiosResponse<{ has_plaid_access_token: boolean }>>("has_plaid_access_token");
    return response.data.has_plaid_access_token;
  }

}

const fpClient = new AxiosFPClient();


export function useFPClient() {
  const [isReady, setReady] = useState(false);
  let { isAuthenticated, getAccessTokenSilently } = useAuth0();


  useEffect(() => {
    async function reloadToken() {
      if (fpClient.accessToken === undefined) {
        const token = await getAccessTokenSilently();
        fpClient.accessToken = token;
        setReady(true);
      } else if (!isReady) setReady(true);
    };
    if (isAuthenticated) reloadToken();
  }, [isAuthenticated, getAccessTokenSilently, isReady]);

  return {
    client: fpClient,
    isReady: isReady
  };
}