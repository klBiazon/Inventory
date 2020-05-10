import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from './../../services/error-handler.service';
import { ProductsService } from './../products.service';

import { Products } from './../products.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.less']
})
export class ProductListComponent implements OnInit {

  products: Products[]; 
  defaultImage = './../../../assets/defaultImg.png';

  constructor(private productsService: ProductsService, 
      private errorHandlerService: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productsService.get()
      .subscribe(res => {
        this.products = res['products'];
      }, error => this.errorHandlerService.handleError(error));
  }

  addProduct() {
    alert('CLICKED');
  }

}
