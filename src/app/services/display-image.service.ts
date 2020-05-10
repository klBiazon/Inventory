import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayImageService {

  imagePath;
  URL;
  message: string;
  fileName: string;

  constructor() { }

  preview(event: Event): File {
    const files = (event.target as HTMLInputElement).files;
    if (files.length === 0)
      return;
 
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = _event => { 
      this.URL = reader.result; 
    }
    this.fileName = files[0].name;

    return files[0];
  }
}
