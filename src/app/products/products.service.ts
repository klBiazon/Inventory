import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../services/api.service';


@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService {
  constructor (http: HttpClient) { 
    super('http://localhost:3000/api/products', http);
  }
}
