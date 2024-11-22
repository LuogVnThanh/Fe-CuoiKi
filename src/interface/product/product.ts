export interface IBooks {
  id: number;
  nameBook: string
  nameAuthor: string;
  publicationBook:string;
  category: string;
  status:string;
  image: string ;
}

export interface IBookCreate {
  id?: number;
  nameBook: string
  nameAuthor: string;
  publicationBook:string;
  category: string;
  status:string;
  image: string;  

}

