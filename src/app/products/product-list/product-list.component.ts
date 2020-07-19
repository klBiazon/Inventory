import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
  private getProductSubs: Subscription;

  private deleteSubs: Subscription;
  result: boolean;
  
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
      private authService: AuthService,
      private layoutsService: LayoutsService) { }

  ngOnInit(): void {
    this.layoutsService.setPageHeader('Products');
    this.getProductSubs = this.productsService.getProductListener()
      .subscribe(res => {
        this.stillLoading = false;
        this.products = res['products'];
        this.layoutsService.setCountPagination(res['total'], this.products.length);
        this.layoutsService.setIsLoading(false);
      });
    this.deleteSubs = this.productsService.getResult()
      .subscribe(res => {
        if(res) {
          this.layoutsService.resetPagination();
          this.closeModal.nativeElement.click();
        }
    });
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(res => {
        this.isAuthenticated = res.isAuthenticated;
      });
    this.pagination();
  }

  ngOnDestroy(): void {
    this.authListenerSubs ? this.authListenerSubs.unsubscribe(): null;
    this.getProductSubs ? this.getProductSubs.unsubscribe() : null;
    this.paginationSubs ? this.paginationSubs.unsubscribe() : null;
    this.deleteSubs ? this.deleteSubs.unsubscribe() : null;
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
    this.productsService.getProducts(this.authService.getUserId(), this.paginationParams);
    this.isAuthenticated = this.authService.getIsAuth();
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
    this.productsService.deleteProduct(productId);
  }
}
