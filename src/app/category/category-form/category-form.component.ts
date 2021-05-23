import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LayoutsService } from 'src/app/layouts/layouts.service';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.less']
})
export class CategoryFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formMode: String = 'Add';
  categoryVal: Category;
  category_id;

  categorySubs: Subscription;
  errorSubs: Subscription;

  @ViewChild('categorySuccessModal') categorySuccessModal: NgbModalRef;

  constructor(private layoutsService: LayoutsService,
            private categoryService: CategoryService,
            private route: ActivatedRoute,
            private router: Router,
            private modalService: NgbModal) {
  }

  ngOnInit() {
    this.setSubscriptions();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has("category_id")) {
        this.formMode = 'Save Changes';
        this.layoutsService.setPageHeader('Edit Category');
        this.category_id = paramMap.get('category_id');
        this.categoryService.getCategories(this.category_id);
      } else {
        this.formMode = 'Add';
        this.layoutsService.setPageHeader('Add Category'); 
        this.setForm();
      }
    })
  }

  ngOnDestroy() {
    this.categorySubs.unsubscribe();
    this.errorSubs.unsubscribe();
  }

  setForm(value ?: Category) {
    this.form = new FormGroup({
      'name': new FormControl(value?.name, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'description': new FormControl(value?.description, {
        validators: [Validators.required, Validators.minLength(3)]
      })
    });
  }
  
  setSubscriptions() {
    this.categorySubs = this.categoryService.getCategoriesListener()
      .subscribe(res => {
        if(res.method === 'GET') {
          this.setForm(res.category);
        } else if(res.method === 'POST') {
          this.categoryVal = res.category;
          this.form.reset();
          this.openModal();
        } else if(res.method === 'PUT') {
          this.form.reset();
          this.openModal();
        }
      });
    this.errorSubs = this.categoryService.getErrorListener()
      .subscribe(err => {
        if(err) {
          this.router.navigate(['/category'])
        }
      })
  }
  
  submit(form: FormGroupDirective) {
    if(form.invalid) {
      return;
    }

    const categoryData = new FormData();
    categoryData.append('name', form.value.name);
    categoryData.append('description', form.value.description);

    if(this.formMode === 'Add') {
      this.categoryService.addCategory(categoryData);
    } else {
      categoryData.append('id', this.category_id);
      this.categoryVal = form.value;
      this.categoryService.updateCategory(categoryData);
    }
  }
  
  openModal() {
    this.modalService.open(this.categorySuccessModal, { windowClass: 'modal-holder' }).result
      .then(() => {
        this.router.navigate(['/category']);
      }, () => {
        this.router.navigate(['/category']);
      });
  }
}
