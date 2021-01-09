import axios, { AxiosInstance, AxiosResponse } from "axios";
import { BankAccount, FP_API } from "financial-planner-api";

export class AxiosFPClient implements FP_API {
  private client:AxiosInstance;
  constructor(){       
    let PROTOCOL = process.env.REACT_APP_SERVER_PROTOCOL || "https";
    let HOST = process.env.REACT_APP_SERVER_HOST;    
    let PORT = process.env.REACT_APP_SERVER_PORT || (PROTOCOL === "http"?80:443);
    this.client = axios.create(
      {
        baseURL:`${PROTOCOL}://${HOST}:${PORT}/api/`
      }
    )
 
    //Add retry interceptor
    //TODO: limit retries, exponential backoff 
    this.client.interceptors.response.use(
      (response)=>{
        return response;
      },
      (error)=>{        
        const { config} = error;
        if(error.config.data) error.config.data = JSON.parse(error.config.data);
        const originalRequest = config;  
        if(error.response && error.response.status) {                    
          return new Promise(
            (resolve, reject) => {
              setTimeout(() => resolve(this.client.request(originalRequest)), 1000);
            }
          ) 
        } else return Promise.reject(error);
      }
    )    
  }

  async getBankAccounts(userId: string):Promise<BankAccount[]> {
    let accounts = (await this.client.get<any,AxiosResponse<{accounts: BankAccount[]}>>(`BankAccounts`)).data.accounts;    
    return accounts;
  }
 
  

  async getLinkToken(userId?:string){  
    const response = await this.client.get("link_token?userId="+ userId);
    return response.data.link_token;
  }

  async setPublicToken(publicToken:string, userId?: string){    
    const response = await this.client.post("set_access_token", {
      public_token: publicToken
    });
    return response.data.itemId;
  }

}

export const fpClient = new AxiosFPClient();