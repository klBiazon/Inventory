import { Component, OnInit, OnDestroy, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { DisplayImageService } from './../../services/display-image.service'
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { ProductsService } from '../products.service';
import { mimeType } from './../../services/mime-type.validator';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { LayoutsService } from 'src/app/layouts/layouts.service';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.less']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formValues;
  product_id;
  productInfo;
  formMode = 'Add';
  defaultImage = './../../../assets/defaultImg.png';
  stillLoading = false;

  private getProductSubs: Subscription;

  @ViewChild('confirmation') confirmationModal: NgbModalRef;

  constructor(private productsService: ProductsService,
    public displayImageService: DisplayImageService,
    private route: ActivatedRoute,
    private router: Router,
    private layoutsService: LayoutsService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'imgUrl': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.setSubscriptions();
    this.resetForm();
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
  }

  ngOnDestroy() {
    this.getProductSubs.unsubscribe();
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
  }

  setFormValues(val) {
    this.form.setValue({
      'name': val.name,
      'imgUrl': val.imgUrl
    });
  }

  imagePicked(file: File) {
    if (file) {
      this.form.patchValue({imgUrl: file});
      this.form.updateValueAndValidity();
    }
  }

  submit(form: FormGroupDirective) {
    if(form.invalid) {
      return;
    }

    this.stillLoading = true;
    const productData = new FormData();
    if (this.formMode === 'Add') {
      productData.append("name", form.value.name);
      productData.append("imgUrl", form.value.imgUrl, form.value.name);
      this.productsService.addProduct(productData);
    } else {
      productData.append("id", this.product_id);
      productData.append("name", form.value.name);
      if (typeof form.value.imgUrl === 'string') {
        productData.append("imgUrl", form.value.imgUrl);
      } else {
        productData.append("imgUrl", form.value.imgUrl, form.value.name);
      }
      this.formValues = form;
      this.productsService.updateProduct(productData);
    }
  }

  resetForm() {
    this.form.reset();
    this.form.setValue({
      'name': null,
      'imgUrl': null
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
