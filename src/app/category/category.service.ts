import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Observable, Subject } from 'rxjs';
import { Method } from '../constants/method.constants';

@Injectable({
    providedIn: 'root'
})
export class CategoryService extends ApiService {

  categoriesListener = new Subject<any>();
  resultListener = new Subject<boolean>();
  errorListener = new Subject<boolean>();

  constructor(http: HttpClient,
            private errorHandlerService: ErrorHandlerService) {
    super(environment.SERVER_URL + 'category', http);
  }

  getCategories(categoryId ?: string, paginationParams ?: any) {
    this.get(categoryId, paginationParams)
      .subscribe(res => {
        this.categoriesListener.next({
          method: Method.GET,
          category: res
        });
      }, error => {
        this.errorListener.next(true);
        this.errorHandlerService.handleError(error);
      });
  }

  addCategory(categoryData) {
    this.post(categoryData)
      .subscribe(res => {
        this.categoriesListener.next({
          method: Method.POST,
          category: res['category']
        });
      }, error => {
        this.errorHandlerService.handleError(error)
      });
  }

  updateCategory(categoryData) {
    this.put(categoryData)
      .subscribe(res => {
        this.categoriesListener.next({
          method: Method.PUT,
          category: res
        });
      }, error => this.errorHandlerService.handleError(error));
  }

  deleteCategory(id): any {
    this.delete(id)
      .subscribe(() => {
        this.resultListener.next(true);
    }, error => {
      this.errorHandlerService.handleError(error);
      this.resultListener.next(false);
    });
  }

  getCategoriesListener(): Observable<any> {
    return this.categoriesListener.asObservable();
  }

  getResultListener(): Observable<boolean> {
    return this.resultListener.asObservable();
  }

  getErrorListener(): Observable<boolean> {
    return this.errorListener.asObservable();
  }
}