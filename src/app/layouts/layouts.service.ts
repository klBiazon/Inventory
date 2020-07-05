import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutsService {
  
  private pageHeaderListener = new Subject<string>();
  private pageHeader: string;

  
  private isLoadingListener = new Subject<boolean>();
  private isLoading;

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
}