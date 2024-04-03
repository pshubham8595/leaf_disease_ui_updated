import { Component } from '@angular/core';
import { FileUploadService } from './services/file-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'leaf_disease_ui_updated';
  imageUrl: string | ArrayBuffer | null = "../assets/static_leaf.jpg";
  imageSelected: boolean = false;
  resultsFetched: boolean = false;
  resultString: string = "Detected disease is : NA";
  selectedFile:File | undefined;
  inputElement: HTMLInputElement | null = null;
  disease:string = "NA";
  predictionText: string = ""
  showLoading:boolean = false;

  constructor(public fileUploadService:FileUploadService){}
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.imageSelected = true;
        this.selectedFile = file
      };
      reader.readAsDataURL(file);
    } else {
      this.imageUrl = null;
      this.imageSelected = false;
    }
  }

  sendFileToServer(){
    console.log("Sending file to servier")
    this.showLoading = true
    this.resultsFetched = false
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile)
        .subscribe(response => {
          // Handle response if needed
          let jsonData = JSON.parse(JSON.stringify(response))
          console.log("Resp:" +JSON.stringify(response));
          this.disease = jsonData['disease']
          if(this.disease == "Potato___healthy"){
            this.predictionText = "Selected leaf image is healthy :\n"+this.disease+" ";
          }
          else{
            this.predictionText = "Selected leaf image has disease :\n"+this.disease+" ";
          }
          
          console.log(this.resultString);
          this.resultsFetched = true;
          this.showLoading = false;
        }, error => {
          console.error('Error uploading file:', error);
        });
    }
  }

}
