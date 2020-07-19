import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(@Inject(String) private apiURL: string, private http: HttpClient) { }

  get(id ?: string, pagination ?: any) {
    return this.http.get(this.apiURL + (id ? `/${id}` : '') + 
      (pagination ? `?page=${pagination?.page}&pageSize=${pagination?.pageSize}` : ''))
      .pipe(map(res => res));
  }

  post(postObj: FormData) {
    return this.http.post(this.apiURL, postObj)
      .pipe(map(res => res));
  }

  put(updateObj) {
    return this.http.put(this.apiURL + '/' + updateObj.get('id'), updateObj)
      .pipe(map(res => res));
  }

  delete(id) {
    return this.http.delete(this.apiURL + '/' + id)
      .pipe(map(res => res));
  }

  user(action: string, userObj) {
    return this.http.post(this.apiURL + '/' + action, userObj)
      .pipe(map(res => res));
  }
}
