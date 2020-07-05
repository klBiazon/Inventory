import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { ProductsService } from './../products.service';

import { Products } from './../products.model';
import * as $ from 'jquery';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { LayoutsService } from 'src/app/layouts/layouts.service';

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

  //AUTHENTICATION
  isAuthenticated = false;
  private authListenerSubs: Subscription;

  //PAGINATION
  totalCount;
  pagination = {
    page: 1,
    pageSize: 5
  };

  constructor(private productsService: ProductsService, 
      private errorHandlerService: ErrorHandlerService,
      private authService: AuthService,
      private layoutsService: LayoutsService) { }

  ngOnInit(): void {
    this.layoutsService.setPageHeader('Products');
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.productGet.unsubscribe();
    this.layoutsService.setIsLoading(false);
  }

  getProducts() {
    this.layoutsService.setIsLoading(true);
    this.stillLoading = true;
    this.productGet = this.productsService.get(null, this.pagination)
      .subscribe(res => {
        this.stillLoading = false;
        this.products = res['products'];
        this.totalCount = res['total'];
        this.layoutsService.setIsLoading(false);
      }, error => this.errorHandlerService.handleError(error));
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(res => {
        this.isAuthenticated = res.isAuthenticated;
      });
  }

  toConfirmDelete(product) {
    this.modalProductInfo = product;
    setTimeout(function (){ //had to user 'setTimeout' as the modal takes time to appear
        $('#delete').focus();   
    }, 500);
  }

  showImage(imgUrl) {
    this.imageClicked = imgUrl;
  }

  deleteProduct(productId) {
    this.productsService.delete(productId)
      .subscribe(res => {
        this.getProducts();
        document.getElementById('closeModal').click(); //Close modal
      }, error => this.errorHandlerService.handleError(error));
  }
}
