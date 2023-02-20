export interface IHttpAdpater {
  get<T>(url: string): Promise<T>;
}
