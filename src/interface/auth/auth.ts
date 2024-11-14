import  IOrder from'../../interface/order/order'

export interface ILogin {
    email:string;
    password:string;
}

export interface IRegister {
    email:string;
    name:string;
    password:string;
    confirmPassword:string;
    currentPage:number;
    order:IOrder[];
}


