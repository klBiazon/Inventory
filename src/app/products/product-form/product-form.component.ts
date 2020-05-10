import { Component, OnInit } from '@angular/core';
import { DisplayImageService } from './../../services/display-image.service'
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Products } from './../products.model';
import { ProductsService } from '../products.service';
import { mimeType } from './../../services/mime-type.validator';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.less']
})
export class ProductFormComponent implements OnInit {

  products: Products;

  form: FormGroup;

  constructor(public displayImageService: DisplayImageService) { }

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

    // this.form.setValue({
    //   'title': 'Sample',
    //   'imgUrl': 'image'
    // });
  }

  imagePicked(file: File) {
    if (file) {
      this.form.patchValue({imgUrl: file});
      this.form.updateValueAndValidity();        
    }
  }

  submit(form) {
    console.log(form);
  }
}
