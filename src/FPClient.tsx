import axios, { AxiosInstance } from "axios";

export class FPClient {
  private client:AxiosInstance;
  constructor(){
    this.client = axios.create(
      {
        baseURL:"http://localhost:8000/api/"
      }
    )
  }

  async getLinkToken(userId?:string){  
    const response = await this.client.get("link_token?userId="+ userId);
    return response.data.link_token;
  }

  async setPublicPlaidToken(publicToken:string){
    console.log("Setting public plaid token.");
    const response = await this.client.post("set_access_token", {
      public_token: publicToken
    });
    console.log("Set access token");
    return response.data.itemId;
  }

  async getBalances(userId?:string){    
    const response = await this.client.get("balances");
    return response.data;
  }

}

export const fpClient = new FPClient();