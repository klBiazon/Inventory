import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { ProductsService } from './../products.service';
import { Products } from './../products.model';

import { AuthService } from 'src/app/auth/auth.service';
import { LayoutsService } from 'src/app/layouts/layouts.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less']
})
export class ProductListComponent implements OnInit, OnDestroy {

  modalProductInfo;
  imageClicked;
  products: Products[] = [];
  defaultImage = './../../../assets/defaultImg.png';
  stillLoading = false;
  private productGet: Subscription;
  
  @ViewChild('closeModal')
  closeModal?: ElementRef;
  @ViewChild('delete')
  delete?: ElementRef;

  //AUTHENTICATION
  isAuthenticated = false;
  private authListenerSubs: Subscription;

  //PAGINATION
  private paginationSubs: Subscription;
  paginationParams: Object;

  constructor(private productsService: ProductsService, 
      private errorHandlerService: ErrorHandlerService,
      private authService: AuthService,
      private layoutsService: LayoutsService) { }

  ngOnInit(): void {
    this.layoutsService.setPageHeader('Products');
    this.pagination();
  }

  ngOnDestroy(): void {
    this.authListenerSubs ? this.authListenerSubs.unsubscribe(): null;
    this.productGet ? this.productGet.unsubscribe() : null;
    this.paginationSubs ? this.paginationSubs.unsubscribe() : null;
    this.layoutsService.setIsLoading(false);
  }

  pagination() {
    this.paginationSubs = this.layoutsService.getPaginationEvent()
      .subscribe(pagination => {
        this.paginationParams = pagination;
        this.getProducts();
      });
    this.paginationParams = this.layoutsService.getPagination();
    this.getProducts();
  }

  getProducts() {
    this.layoutsService.setIsLoading(true);
    this.stillLoading = true;
    this.productGet = this.productsService.get(this.authService.getUserId(), this.paginationParams)
      .subscribe(res => {
        this.stillLoading = false;
        this.products = res['products'];
        this.layoutsService.setCountPagination(res['total'], this.products.length);
        this.layoutsService.setIsLoading(false);
      }, error => this.errorHandlerService.handleError(error));
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(res => {
        this.isAuthenticated = res.isAuthenticated;
      });
  }

  toConfirmDelete(product) {
    let deleteElem = this.delete.nativeElement;
    this.modalProductInfo = product;
    setTimeout(function (){ //had to user 'setTimeout' as the modal takes time to appear
      deleteElem.focus();
    }, 500);
  }

  showImage(imgUrl) {
    this.imageClicked = imgUrl;
  }

  deleteProduct(productId) {
    this.productsService.delete(productId)
      .subscribe(res => {
        this.getProducts();
        this.closeModal.nativeElement.click();
      }, error => this.errorHandlerService.handleError(error));
  }
}
