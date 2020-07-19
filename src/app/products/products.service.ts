import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './../services/api.service';

import { environment } from '../../environments/environment';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProductsService extends ApiService {

  productListener = new Subject<any>()
  resultListener = new Subject<boolean>();

  constructor (http: HttpClient,
              private errorHandlerService: ErrorHandlerService,
              private router: Router) { 
    super(environment.SERVER_URL + 'products', http);
  }

  getProducts(userId ?: string, paginationParams ?: any) {
    this.get(userId, paginationParams)
      .subscribe(res => {
        this.productListener.next(res);
      }, error => {
        this.errorHandlerService.handleError(error);
        if(!paginationParams) {
          this.router.navigate(['/products']);
        }
      });
  }

  getProductListener(): Observable<any> {
    return this.productListener.asObservable();
  }

  addProduct(productData) {
    this.post(productData)
      .subscribe(res => {
        this.productListener.next(res['product']);
      }, error => this.errorHandlerService.handleError(error));
  }

  updateProduct(productData) {
    this.put(productData)
      .subscribe(res => {
        this.productListener.next(res);
      }, error => this.errorHandlerService.handleError(error));
  }

  deleteProduct(id): any {
    this.delete(id)
      .subscribe(() => {
        this.resultListener.next(true);
    }, error => {
      this.errorHandlerService.handleError(error);
      this.resultListener.next(false);
    });
  }

  getResult(): Observable<boolean> {
    return this.resultListener.asObservable();
  }
} 
