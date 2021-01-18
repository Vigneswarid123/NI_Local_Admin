import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../Core/_providers/api-service/api.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  brandForm:FormGroup;
  submitted=false;

  selectedFile: ImageSnippet;
  constructor(private fB: FormBuilder,private adminService:ApiService) { }

  ngOnInit(): void {
  }
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      // this.imageService.uploadImage(this.selectedFile.file).subscribe(
      //   (res) => {
        
      //   },
      //   (err) => {
        
      //   })
    });

    reader.readAsDataURL(file);
  }
  OnSubmit(){
    
  }

}
