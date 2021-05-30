import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from './../products.service';
import { Products } from './../products.model';

import { AuthService } from 'src/app/auth/auth.service';
import { LayoutsService } from 'src/app/layouts/layouts.service';
import { Page } from '../../constants/page.constants';

import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  @ViewChild('delete') deleteModal: NgbModalRef;
  @ViewChild('showImage') showImageModal: NgbModalRef;

  //AUTHENTICATION
  isAuthenticated = false;
  private authListenerSubs: Subscription;

  //PAGINATION
  private paginationSubs: Subscription;
  paginationParams: Object;

  constructor(private productsService: ProductsService,
      private authService: AuthService,
      private layoutsService: LayoutsService,
      private modalService: NgbModal) { }

  ngOnInit(): void {
    this.layoutsService.setActivePage(Page.PRODUCT);
    this.layoutsService.setPageHeader(Page.PRODUCT);
    this.layoutsService.setPagination();
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
    this.modalService.dismissAll();
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

  openDeleteModal(product) {
    this.modalProductInfo = product;
    this.modalService.open(this.deleteModal, { windowClass: 'modal-holder' }).result
      .then(() => { },
        (reason) => {
          if(reason !== 0 && reason !== 1) {
            this.productsService.deleteProduct(reason);
          }
      });
  }

  openShowImageModal(imgUrl) {
    this.imageClicked = imgUrl;
    this.modalService.open(this.showImageModal, { windowClass: 'modal-holder' })
  }
}
