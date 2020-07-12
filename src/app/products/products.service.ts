import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../services/api.service';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService {
  constructor (http: HttpClient) { 
    super(environment.SERVER_URL + 'products', http);
  }
}
