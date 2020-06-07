import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { ProductsService } from './../products.service';

import { Products } from './../products.model';
import * as $ from 'jquery';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less']
})
export class ProductListComponent implements OnInit {

  modalProductInfo;
  imageClicked;
  products: Products[] = [];
  isLoading: boolean;
  defaultImage = './../../../assets/defaultImg.png';

  //PAGINATION
  totalCount;
  pagination = {
    page: 1,
    pageSize: 5
  };

  constructor(private productsService: ProductsService, 
      private errorHandlerService: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.isLoading = true;
    this.productsService.get(null, this.pagination)
      .subscribe(res => {
        this.products = res['products'];
        this.totalCount = res['total'];
        this.isLoading = false;
      }, error => this.errorHandlerService.handleError(error));
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
