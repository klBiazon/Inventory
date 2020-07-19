import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FunctionCall } from '@angular/compiler';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class LayoutsService {
  
  private pageHeaderListener = new Subject<string>();
  private pageHeader: string;

  private isLoadingListener = new Subject<boolean>();
  private isLoading;

  private countForPaginationListener = new Subject<{ totalCount: number, dataLength: number }>();
  private count: Object;
  private functionCallListener = new Subject<any>();
  private paginationParams = {
    page: 1,
    pageSize: 5
  };

  constructor() { }

  setPageHeader(value: string) {
    this.pageHeaderListener.next(value);
    this.pageHeader = value;
  }

  getPageHeaderListener(): Observable<string> {
    return this.pageHeaderListener.asObservable();
  }

  getPageHeader(): string {
    return this.pageHeader;
  }

  setIsLoading(value: boolean) {
    this.isLoadingListener.next(value);
    this.isLoading = value;
  }

  getIsLoadingListener(): Observable<boolean> {
    return this.isLoadingListener.asObservable();
  }

  getIsLoading(): boolean {
    return this.isLoading;
  }

  getCountPaginationListener(): Observable<{ totalCount: number, dataLength: number }> {
    return this.countForPaginationListener.asObservable();
  }

  getCountPagination() {
    return this.count;
  }

  setCountPagination(totalCount: number, dataLength: number) {
    if(totalCount && dataLength) {
      this.count = {
        'totalCount': totalCount,
        'dataLength': dataLength
      };
      this.countForPaginationListener.next({totalCount, dataLength});  
    }
  }

  getPaginationEvent(): Observable<any>{ 
    return this.functionCallListener.asObservable();
  }

  setPaginationEvent(paginationParams) {
    this.functionCallListener.next(paginationParams);
  }

  getPagination() {
    return this.paginationParams;
  }

  setPagination(value: {page: number, pageSize: number}) {
    this.paginationParams = {
      'page': value.page,
      'pageSize': value.pageSize
    };
  }

  resetPagination() {
    this.paginationParams = {
      page: 1,
      pageSize: 5
    };
    this.setPaginationEvent(this.paginationParams);
  }
}