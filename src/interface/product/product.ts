export interface IBooks {
  id: number;
  nameBook: string
  nameAuthor: string;
  publicationBook:string;
  category: string;
  status:string;
  image: File|null ;  // Cập nhật để có thể chứa cả File hoặc URL string
}

export interface IBookCreate {
  id?: number;
  nameBook: string
  nameAuthor: string;
  publicationBook:string;
  category: string;
  status:string;
  image: File|null;  // Cập nhật để có thể chứa cả File hoặc URL string

}

 