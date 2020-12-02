import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { formatDistance } from "date-fns";
import { UploadFile, UploadXHRArgs, UploadChangeParam } from "ng-zorro-antd";
import { filter } from "rxjs/operators";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotesService } from "src/app/modules/system/shows/notes.service";
import { AppConstants } from "src/app/constants/AppConstants";


@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"],
})
export class NotesComponent implements OnInit {
  @Input() type: any; //revision | task
  @Input() itemId: any;
  @Input() mode: any; //feedback | notes
  @Output("onAttachClick") attachClick: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Input() skipAttachment: boolean;
  isScreenShotAdded: boolean;
  screenShotImage: any;
  showModal: boolean;
  showMoreComments = false;
  showInlineCommentEditor = -1;
  submitting = false;
  comments = [];
  user = {
    userName: "Test",
    thumbnail: "",
    replies: [],
  };
  inputValue = "";
  replyInputValue = "";
  visibilityState = [];
  uploading = false;

  customOptions = [
    {
      import: "attributors/style/size",
      whitelist: [
        "10px",
        "12px",
        "16px",
        "18px",
        "20px",
        "24px",
        "28px",
        "32px",
        "46px",
      ],
    },
  ];

  toolbarOptions = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [
        {
          size: [
            "10px",
            "12px",
            "16px",
            "18px",
            "20px",
            "24px",
            "28px",
            "32px",
            "46px",
          ],
        },
      ],
    ],
  };
  isDataReady: boolean;
  isDataEmpty: boolean;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: false,
    hidePreviewIconInNonImage: true,
  };
  fileList: any = [];
  fileListOuter: any = [];
  previewImage: string | undefined = "";
  previewVisible = false;

  constructor(
    private notesService: NotesService,
    private showsService: ShowsService,
    private helperService: HelperService,
    
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  imageFileAcceptList() {
    return AppConstants.IMAGE_FILE_ACCEPT_LIST;
  }

  getServiceName() {
    let serviceName = "";
    if (this.mode === "feedback") {
      if (this.type === "task") {
        serviceName = "getFeedbackByTask";
      } else if (this.type === "revision") {
        serviceName = "getFeedbackByRevision";
      }
    } else if (this.mode === "notes") {
      if (this.type === "task") {
        serviceName = "getNotesByTask";
      } else if (this.type === "revision") {
        serviceName = "getNotesByRevision";
      }
    }
    return serviceName;
  }

  async prepareData() {
    //this.isDataReady = false;
    this.isDataEmpty = false;
    this.fileList = [];
    this.fileListOuter = [];
    let serviceName = this.getServiceName();
    await this.notesService[serviceName](this.itemId)
      .toPromise()
      .then((resp) => {
        if (resp && resp.entity && resp.entity.length > 0) {
          this.comments = resp.entity;
          this.showMoreComments = this.comments.length > 2 ? true : false;
        } else {
          this.isDataEmpty = true;
        }
      })
      .catch((error) => {
        this.isDataEmpty = true;
        this.comments = [];
        //this.isDataReady = true;
      });
    if (this.helperService.userInfo && this.helperService.userInfo.thumbnail) {
      this.user.thumbnail = this.helperService.userInfo.thumbnail;
    }
    if (this.helperService.userInfo && this.helperService.userInfo.firstName) {
      this.user.userName = this.helperService.userInfo.firstName;
    }
    this.isDataReady = true;
  }

  tempNode: any;
  tempIndex: any;
  tempItem: any;

  handleSubmitAndUpload(node: string, index: number, item: any): void {
    if (this.mode === "feedback") {
      this.tempNode = node;
      this.tempIndex = index;
      this.tempItem = item;

      if (this.skipAttachment) {
        this.submitHandler(node, index, item);
      } else {
        this.getScreenShot();
      }
    } else {
      this.submitHandler(node, index, item);
    }
  }

  submitHandler(node: string, index: number, item: any): void {
    const currIndex = index;
    const comment = node === "parent" ? this.inputValue : this.replyInputValue;
    this.inputValue = this.replyInputValue = "";

    const formData = new FormData();
    // tslint:disable-next-line:no-any
    /*this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });*/

    const tempComment = {
      ...this.user,
      comment: comment,
      createdDate: new Date(),
    };
    formData.append("comment", JSON.stringify(tempComment));

    this.submitting = true;
    this.uploading = true;
    /*const req = new HttpRequest('POST', 'http://localhost/corstest/upload.php', formData, {
      reportProgress: true,
      withCredentials: true
    });*/

    this.submitting = false;
    this.inputValue = "";
    this.uploading = false;
    const commentList = {
      ...this.user,
      comment: comment,
      createdDate: tempComment.createdDate,
      attachments: [],
      replies: [],
    };
    let attachments = [];
    if (node === "parent") {
      this.comments = [...this.comments, commentList].map((e) => {
        return {
          ...e,
          displayTime: formatDistance(new Date(), new Date(e.createdDate)),
        };
      });
      this.showMoreComments = this.comments.length > 2 ? true : false;
      if (this.mode === "feedback") {
        if (this.isScreenShotAdded) {
          let attachment = new Object();
          attachment["attachment"] = this.screenShotImage;
          attachments.push(attachment);
        }
      } else {
        if (this.fileListOuter && this.fileListOuter.length > 0) {
          for (let i = 0; i < this.fileListOuter.length; i++) {
            if (
              this.fileListOuter[i] &&
              this.fileListOuter[i].response &&
              this.fileListOuter[i].response.fileDownloadUri
            ) {
              let attachment = new Object();
              attachment["attachment"] = this.fileListOuter[
                i
              ].response.fileDownloadUri;
              attachments.push(attachment);
            }
          }
        }
      }
    } else {
      this.visibilityState[currIndex] = "hide";
      if (!this.comments[currIndex].replies) {
        this.comments[currIndex].replies = [];
      }
      this.comments[currIndex].replies = [
        ...this.comments[currIndex].replies,
        commentList,
      ].map((e) => {
        return {
          ...e,
          displayTime: formatDistance(new Date(), new Date(e.createdDate)),
        };
      });
      if (this.mode === "feedback") {
        if (this.isScreenShotAdded) {
          let attachment = new Object();
          attachment["attachment"] = this.screenShotImage;
          attachments.push(attachment);
        }
      } else {
        if (this.fileList && this.fileList.length > 0) {
          for (let i = 0; i < this.fileList.length; i++) {
            if (
              this.fileList[i] &&
              this.fileList[i].response &&
              this.fileList[i].response.fileDownloadUri
            ) {
              let attachment = new Object();
              attachment["attachment"] = this.fileList[
                i
              ].response.fileDownloadUri;
              attachments.push(attachment);
            }
          }
        }
      }
    }

    let entityTypeId = AppConstants.TASK_ENTITY_ID;
    if (this.type === "revision") {
      entityTypeId = AppConstants.REVISION_ENTITY_ID;
    }

    let commentIn = {
      entityTypeId: entityTypeId,
      entityId: this.itemId,
      parentNotesId: item ? item.id : null,
      comment: comment,
      attachments: attachments,
    };
    this.createComment(commentIn);
  }

  createComment(commentIn: any) {
    let serviceName = "";
    if (this.mode === "notes") {
      serviceName = "createNote";
    } else if (this.mode === "feedback") {
      serviceName = "createFeedback";
    }
    this.notesService[serviceName](commentIn)
      .toPromise()
      .then((resp) => {
        if (resp && resp.entity) {
        }
        this.prepareData();
      })
      .catch((error) => {
        this.prepareData();
      });
  }

  showHideComments() {
    this.showMoreComments = !this.showMoreComments;
  }

  showCommentInlineReply(index) {
    this.showInlineCommentEditor = index;
    if (this.visibilityState[index] === "show") {
      this.visibilityState[index] = "hide";
    }
  }

  hideCommentInline(index) {
    this.showInlineCommentEditor = -1;
    this.visibilityState[index] =
      this.visibilityState[index] === "show" ? "hide" : "show";
  }

  getDisplayTime(node: any) {
    return formatDistance(new Date(), new Date(node.createdDate));
  }

  uploadAPI = () => {
    return this.showsService.uploadFileEndPoint();
  };

  uploadMonitor = (e: UploadChangeParam) => {};

  handlePreview(url) {
    
    if (url) {
      this.previewImage = url; //file.url || file.thumbUrl;
      this.previewVisible = true;
      this.showModal = true; 
    }
  }

  getScreenShot() {
    this.isScreenShotAdded = false;
    this.attachClick.emit(null);
  }

  updateReviewComment(event: any) {
    if (event && event.feedbackComment) {
      this.inputValue = event.feedbackComment;
      this.handleSubmitAndUpload("parent", -1, null);
    }
  }

  setAnnotationImage(imageData: any) {
    if (imageData) {
      let imageBlob = this.dataURItoBlob(
        imageData.replace(/^data:image\/(png|jpg);base64,/, "")
      );
      const date = new Date().valueOf();
      const imageName = date + "-screen-shot" + ".png";
      const formData = new FormData();
      const imageFile = new File([imageBlob], imageName, { type: "image/png" });
      formData.append("file", imageFile);
      this.showsService
        .uploadFile(formData)
        .toPromise()
        .then((resp: any) => {
          this.isScreenShotAdded = true;
          this.screenShotImage = resp.fileDownloadUri;
          this.submitHandler(this.tempNode, this.tempIndex, this.tempItem);
        })
        .catch((error: any) => {
          this.isScreenShotAdded = false;
          this.submitHandler(this.tempNode, this.tempIndex, this.tempItem);
        });
    } else {
      this.submitHandler(this.tempNode, this.tempIndex, this.tempItem);
    }
  }

  // previewScreenShot(node: any) {
  //   if (node === 'parent') {
  //     this.previewImage = this.screenShotImage;
  //     this.previewVisible = true;
  //   }
  // }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/png" });
    return blob;
  }
  /* Modal box starts*/
  hide()
  {
    this.showModal = false;
  }

   /* Modal box End*/
}
