import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutsService } from 'src/app/layouts/layouts.service';
import { CategoryService } from '../category.service';

import { Page } from '../../constants/page.constants';
import { Category } from './../category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.less']
})
export class CategoryListComponent implements OnInit, OnDestroy {

  stillLoading = false;

  private getCategorySubs: Subscription;
  categories : Category[] = [];
  category: Category;

  private paginationSubs: Subscription;
  paginationParams: Object;

  isAuthenticated = false;
  private authListenerSubs: Subscription;
  
  @ViewChild('delete') deleteModal: NgbModalRef;
  private getResultListenerSubs: Subscription;

  constructor(private layoutsService: LayoutsService,
              private authService: AuthService,
              private categoryService: CategoryService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.layoutsService.setActivePage(Page.CATEGORY);
    this.layoutsService.setPageHeader(Page.CATEGORY);
    this.layoutsService.setPagination();
    this.getCategorySubs = this.categoryService.getCategoriesListener()
      .subscribe(res => {
        const category = res.category;
        this.stillLoading = false;
        this.categories = category['categories'];
        this.layoutsService.setCountPagination(category['total'], this.categories.length);
        this.layoutsService.setIsLoading(false);
      });
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(res => {
        this.isAuthenticated = res.isAuthenticated;
      });
    this.getResultListenerSubs = this.categoryService.getResultListener()
      .subscribe(res => {
        if(res) {
          this.modalService.dismissAll();
          this.getCategories();
        } else {
          /**
           * 
           *  CREATE A MODAL THAT SAYS IT WAS UNSUCCESSFUL
           * 
           */
        }
      })
    this.pagination();
  }

  ngOnDestroy() {
    this.getCategorySubs.unsubscribe();
    this.authListenerSubs.unsubscribe();
    this.paginationSubs.unsubscribe();
    this.getResultListenerSubs.unsubscribe();
    this.modalService.dismissAll()
  }

  pagination() {
    this.paginationSubs = this.layoutsService.getPaginationEvent()
      .subscribe(() => {
        this.getCategories();
      });
    this.getCategories();
  }

  getCategories() {
    this.layoutsService.setIsLoading(true);
    this.stillLoading = true;
    this.categoryService.getCategories(this.authService.getUserId(), this.layoutsService.getPagination());
    this.isAuthenticated = this.authService.getIsAuth();
  }
  
  deleteCategory(category) {
    this.category = category;
    this.openModal();
  }

  openModal() {
    this.modalService.open(this.deleteModal, { windowClass: 'modal-holder' }).result
      .then(() => { },
        (reason) => {
          if(reason) {
            this.categoryService.deleteCategory(reason._id);
          }
      });
  }
}
