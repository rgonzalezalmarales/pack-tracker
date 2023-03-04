export interface IFilters {
  offset: number;
  limit: number;
  sort?: string;
  desciption?: string;
  dateLte?: Date;
  dateGte?: Date;
  status?:string;
}
