export interface IProduct {
  id: number;
  nameBook: string
  nameAuthor: string;
  publicationBook:string;
  category: ICate;
}


export interface ICate{
    id:number;
    nameCategory:string;
}