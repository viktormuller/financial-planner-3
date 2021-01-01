export const ADVISORS = [
  {
    id: "11111111", 
    name: "Ami Nash Shah", 
    company: "Hemmington Wealth Management"
  }, 
  {
    id: "22222222",
    name: "Viktor Muller", 
    company: "Goliath National Bank"
  }
]

export interface Advisor {
  id: string, 
  name: string, 
  company?: string
}

export class Advisors {
  static getAdvisor(id:string){
    return ADVISORS.find((current) => current.id === id);
  }
}