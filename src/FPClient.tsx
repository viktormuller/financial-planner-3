import axios, { AxiosInstance } from "axios";



export class FPClient {
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