import { Component, OnInit } from '@angular/core';
import { DisplayImageService } from './../../services/display-image.service'
import { ErrorHandlerService } from './../../services/error-handler.service';
import { FormGroup, FormControl, Validators, NgForm, FormGroupDirective } from '@angular/forms';

import { Products } from './../products.model';
import { ProductsService } from '../products.service';
import { mimeType } from './../../services/mime-type.validator';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.less']
})
export class ProductFormComponent implements OnInit {

  form: FormGroup;
  product_id;
  productInfo;
  formMode = 'Add';
  defaultImage = './../../../assets/defaultImg.png';

  constructor(private productsService: ProductsService,
    private errorHandlerService: ErrorHandlerService,
    public displayImageService: DisplayImageService,
    private route: ActivatedRoute,
    private router: Router) { }

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
    this.resetForm();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("product_id")) {
        this.formMode = 'Save Changes';
        this.product_id = paramMap.get('product_id'); 
        this.productsService.get(this.product_id)
          .subscribe((res: Products) => {
            this.setFormValues(res);
            this.displayImageService.URL = res.imgUrl;
          }, error => {
            this.router.navigate(['/products']);
            this.errorHandlerService.handleError(error);
          });
      } else {
        this.formMode = 'Add';
        this.product_id = null;
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

    const productData = new FormData();
    if (this.formMode === 'Add') {
      productData.append("name", form.value.name);
      productData.append("imgUrl", form.value.imgUrl, form.value.name);
      this.productsService.post(productData)
        .subscribe(res => {
          this.productInfo = res['product'];
          this.resetForm();
          document.getElementById('confirmationModal').click();
        }, error => this.errorHandlerService.handleError(error));
    } else {
      productData.append("id", this.product_id);
      productData.append("name", form.value.name);
      if (typeof form.value.imgUrl === 'string') {
        productData.append("imgUrl", form.value.imgUrl);
      } else {
        productData.append("imgUrl", form.value.imgUrl, form.value.name);
      }
      
      this.productsService.put(productData)
        .subscribe(res => {
          this.productInfo = form.value;
          this.resetForm();
          document.getElementById('confirmationModal').click();
        }, error => this.errorHandlerService.handleError(error));
        
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
}
