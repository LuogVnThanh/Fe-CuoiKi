import  IOrder from'../../interface/order/order'

export interface IUser {
  id: number
  name:string
  email: string
  password: string
  role: string
  currentPage:number
  Order:IOrder []
}

export interface IUserInfor {

  name:string
  role: string
}


