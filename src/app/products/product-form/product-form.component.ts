import { Component, OnInit, OnDestroy, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { DisplayImageService } from './../../services/display-image.service'
import { FormGroup, FormControl, Validators, FormGroupDirective, FormArray } from '@angular/forms';

import { ProductsService } from '../products.service';
import { mimeType } from './../../services/mime-type.validator';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { LayoutsService } from 'src/app/layouts/layouts.service';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from 'src/app/category/category.service';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.less']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  product_id;
  productInfo;
  formMode = 'Add';
  defaultImage = './../../../assets/defaultImg.png';
  stillLoading = false;
  categoryList;

  private getProductSubs: Subscription;
  private getCategoriesSubs: Subscription;

  @ViewChild('confirmation') confirmationModal: NgbModalRef;

  constructor(private productsService: ProductsService,
    public displayImageService: DisplayImageService,
    private route: ActivatedRoute,
    private router: Router,
    private layoutsService: LayoutsService,
    private modalService: NgbModal,
    private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.setForm();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("product_id")) {
        this.formMode = 'Save Changes';
        this.layoutsService.setPageHeader('Edit Product');
        this.product_id = paramMap.get('product_id'); 
        this.productsService.getProducts(this.product_id);
      } else {
        this.formMode = 'Add';
        this.layoutsService.setPageHeader('Add Product');
        this.product_id = null;
      }
    });
    this.setSubscriptions();
    this.categoryService.getCategories();
  }

  ngOnDestroy() {
    this.getProductSubs.unsubscribe();
    this.getCategoriesSubs.unsubscribe();
  }

  get categories() {
    return <FormArray>this.form.get("categories");
  }

  setForm() {
    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'price': new FormControl('', {
        validators: [Validators.required]
      }),
      'description': new FormControl(null),
      'categories': new FormArray([]),
      'imgUrl': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
  }

  setSubscriptions() {
    this.getProductSubs = this.productsService.getProductListener()
      .subscribe(res => {
        if (this.formMode === 'Add') {
          this.productInfo = res;
          this.resetForm();
          this.stillLoading = false;
          this.openModal();
        } else {
          if(!res.message) {
            this.setFormValues(res);
            this.displayImageService.URL = res.imgUrl;
          } else {
            this.productInfo = this.form.value;
            this.productInfo['imgUrl'] = res.imgUrl;
            this.resetForm();
            this.openModal();
            this.stillLoading = false;
          }
        }
      });
    this.getCategoriesSubs = this.categoryService.getCategoriesListener()
      .subscribe(res => {
        this.categoryList = res.categories;
      });
  }

  setFormValues(val) {
    val.categories.map(category => {
      this.categories.push(new FormControl(category));
    });
    this.form.setValue({
      'name': val.name,
      'imgUrl': val.imgUrl,
      'description': val.description,
      'price': val.price,
      'categories': this.categories.value
    });
  }

  categoryChecked(e) {
    if (e.target.checked) {
      this.categories.push(new FormControl(e.target.value));
    } else {
      this.categories.controls.map((item: FormControl, i) => {
        if (item.value == e.target.value) {
          this.categories.removeAt(i);
          return;
        }
      });
    }
  }

  setCategoryChecked(categoryId) {
    return this.categories.value.includes(categoryId);
  }

  imagePicked(file: File) {
    if (file) {
      this.form.patchValue({imgUrl: file});
      this.form.updateValueAndValidity();
    }
  }

  submit(form: FormGroupDirective) {
    if(form.invalid || form.value.categories.length === 0) {
      return;
    }

    this.stillLoading = true;
    const productData = new FormData();
    productData.append("name", form.value.name);
    productData.append("description", form.value.description ?? '');
    productData.append("price", form.value.price);
    form.value.categories.map(category => {
      productData.append("categories", category);
    });

    if (this.formMode === 'Add') {
      productData.append("imgUrl", form.value.imgUrl, form.value.name);
      this.productsService.addProduct(productData);
    } else {
      productData.append("id", this.product_id);
      if (typeof form.value.imgUrl === 'string') {
        productData.append("imgUrl", form.value.imgUrl);
      } else {
        productData.append("imgUrl", form.value.imgUrl, form.value.name);
      }
      this.productsService.updateProduct(productData);
    }
  }

  resetForm() {
    this.categories.clear();
    this.form.reset();
    this.form.setValue({
      'name': null,
      'imgUrl': null,
      'price': null,
      'description': null,
      'categories': []
    });
    this.displayImageService.resetDisplayImageService();
  }

  openModal() {
    const modalRef = this.modalService.open(this.confirmationModal).result.then((result) => {
      this.router.navigate(['/products']);
    }, (reason) => {
      this.router.navigate(['/products']);
    });
  }
}
