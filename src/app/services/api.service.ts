import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(@Inject(String) private SERVER_URL: string, private http: HttpClient) { }

  get(id ?: string, pagination ?: any) {
    return this.http.get(this.SERVER_URL + (id ? '/' + id : '')
     + `?page=${pagination?.page}&pageSize=${pagination?.pageSize}`)
      .pipe(map(res => res));
  }

  post(postObj: FormData) {
    return this.http.post(this.SERVER_URL, postObj)
      .pipe(map(res => res));
  }

  put(updateObj) {
    return this.http.put(this.SERVER_URL + '/' + updateObj.get('id'), updateObj)
      .pipe(map(res => res));
  }

  delete(id) {
    return this.http.delete(this.SERVER_URL + '/' + id)
      .pipe(map(res => res));
  }

  user(action: string, userObj) {
    return this.http.post(this.SERVER_URL + '/' + action, userObj)
      .pipe(map(res => res));
  }
}
