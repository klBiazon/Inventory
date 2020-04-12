import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export class ApiService {

  constructor(private SERVER_URL: string, private http: HttpClient) { }

  get() {
    return this.http.get(this.SERVER_URL)
      .pipe(map(res => res));
  }

  post(postObj) {
    return this.http.post(this.SERVER_URL, JSON.stringify(postObj))
      .pipe(map(res => res));
  }

  put(updateObj) {
    return this.http.put(this.SERVER_URL + '/' + updateObj.id, JSON.stringify(updateObj))
      .pipe(map(res => res));
  }

  delete(id) {
    return this.http.delete(this.SERVER_URL + '/' + id)
      .pipe(map(res => res));;
  }
}
