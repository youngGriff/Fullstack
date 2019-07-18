import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category, Message} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CategoriesService {
  constructor(private http: HttpClient) {
  }
  public fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/category');
  }

  public getById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/category/${id}`);
  }

  deleteCategory(category: Category):  Observable<Message> {
    return this.http.delete<Message>(`/api/category/${category._id}`)
  }

  public create(name: string, image?: File): Observable<Category> {
    const fd = new FormData();
    fd.append('name', name);

    if (image) {
      fd.append('image', image);

    }
    return this.http.post<Category>(`/api/category/`, fd);

  }

  public update(id: string, name: string, image?: File): Observable<Category> {
    const fd = new FormData();
    fd.append('name', name);

    if (image) {
      fd.append('image', image);

    }
    return this.http.patch<Category>(`/api/category/${id}`, fd);

  }
}
