import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { UploadFile } from "ng-zorro-antd";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { NgxImageCompressService } from "ngx-image-compress";

@Component({
  selector: "app-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.scss"],
})
export class ImageUploadComponent implements OnInit {
  @Input() name: any = "file-upload";
  @Input() imageUrl: any;
  @Input() showPreview: any = true;
  @Output() onChange = new EventEmitter<any>();
  imageSrc: any;
  isChanged: boolean;

  showUploadList = {
    showPreviewIcon: this.showPreview,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };

  fileList: any = [];
  previewImage: string | undefined = "";
  previewVisible = false;

  constructor(
    private showsService: ShowsService,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit() {
    if (this.imageUrl) {
      this.imageSrc = this.imageUrl;
    }
    this.showUploadList.showPreviewIcon = this.showPreview;
    if (this.imageUrl) {
      this.fileList = [
        {
          uid: -1,
          name: "thumb.png",
          status: "done",
          url: this.imageUrl,
        },
      ];
    }
  }

  removeImage() {
    if (this.imageUrl) {
      this.isChanged = true;
    }
    this.imageSrc = null;
    this.fileList = [];
  }

  imageFileAcceptList() {
    if (this.name == "fav") {
      return AppConstants.FAV_ICON_ACCEPT_LIST;
    }
    return AppConstants.IMAGE_FILE_ACCEPT_LIST;
  }

  handlePreview = (/*file: UploadFile*/) => {
    if (!this.showPreview) {
      return;
    }
    if (this.imageSrc) {
      this.previewImage = this.imageSrc; //file.url || file.thumbUrl;
      this.previewVisible = true;
    }
  };

  onFileChange(event: any) {
    this.isChanged = true;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      //this.fileList = this.fileList.concat(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        var image = reader.result;
        var orientation = -1;
        this.sizeOfOriginalImage =
          this.imageCompress.byteCount(image) / (1024 * 1024);

        this.imageCompress
          .compressFile(image, orientation, 50, 50)
          .then((result) => {
            this.imgResultAfterCompress = result;
            this.localCompressedURl = result;
            this.sizeOFCompressedImage =
              this.imageCompress.byteCount(result) / (1024 * 1024);

            // create file from byte
            var fileName: any = file["name"];
            const imageName = fileName;
            // call method that creates a blob from dataUri
            const imageBlob = this.dataURItoBlob(
              this.imgResultAfterCompress.split(",")[1]
            );

            //const formData = new FormData();
            const imageFileNew = new File([imageBlob], imageName, {
              type: file.type,
            });
            this.fileList = this.fileList.concat(imageFileNew);
            //formData.append("file", imageFileNew);

            //imageFile created below is the new compressed file which can be send to API in form data
            const imageFile = new File([result], imageName, {
              type: file.type,
            });
            //this.fileList[0] = imageFile;
            //this.fileList = this.fileList.concat(imageFile);
            //file = imageFile;
          });

        /*this.myForm.patchValue({
          fileSource: reader.result
        });*/
      };
    }
  }

  handleUpload(): void {
    if (!this.isChanged) {
      return;
    }
    if (!this.imageSrc) {
      let e = {
        type: "success",
        fileDownloadUri: "",
      };
      this.onChange.emit(e);
      return;
    }
    const formData = new FormData();
    /*this.fileList.forEach((file: any) => {
      formData.append("files[]", file);
    });*/
    formData.append("file", this.fileList[0]);

    let serviceName = "uploadFile";
    if (this.name == "fav") {
      serviceName = "uploadFavIcon";
    }

    this.showsService[serviceName](formData)
      .toPromise()
      .then((resp: any) => {
        let e = {
          type: "success",
          fileDownloadUri: resp.fileDownloadUri,
        };
        this.onChange.emit(e);
      })
      .catch((error: any) => {
        let e = {
          type: "error",
          error: error,
          fileDownloadUri: "",
        };
        this.onChange.emit(e);
      });
  }

  uploadAPI = () => {
    return this.showsService.uploadFileEndPoint();
  };

  sizeOfOriginalImage;
  imgResultAfterCompress;
  localCompressedURl;
  sizeOFCompressedImage;
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpeg" });
    return blob;
  }
}
