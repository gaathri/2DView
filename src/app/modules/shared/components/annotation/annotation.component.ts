import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import videojs from "video.js";
import { fabric } from "fabric";
import "videojs-markers-plugin";
import { PlaylistService } from "src/app/modules/system/playlist/playlist.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { Location } from "@angular/common";
import { UsersService } from "src/app/modules/system/configs/users.service";

declare function createLineArrow(
  []: any[],
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  opacity: number
): any;

@Component({
  selector: "app-annotation",
  templateUrl: "./annotation.component.html",
  styleUrls: ["./annotation.component.scss"],
})
export class AnnotationComponent implements OnInit, OnDestroy {
  @ViewChild("video", { static: false }) videoElement: ElementRef;
  @ViewChild("myImage", { static: false }) imageElement: ElementRef;
  @ViewChild("canvas", { static: false }) canvasElement;
  @ViewChild("myVideoCanvas", { static: false }) myVideoCanvas;
  @ViewChild("myImageHolder", { static: false }) myImageHolder: ElementRef;

  //@Input() playlistId: any;
  //@Input() playlistInfo: any;
  @Input() revisionInfo: any;
  @Input() isFirst: boolean;
  @Input() isLast: boolean;

  @Output("onNext")
  onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output("onPrev")
  onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output("onAnnotationInit")
  annotationInit: EventEmitter<any> = new EventEmitter<any>();
  @Output("onAnnotationClose")
  annotationClose: EventEmitter<any> = new EventEmitter<any>();
  @Output("onAnnotationComplete")
  annotationComplete: EventEmitter<any> = new EventEmitter<any>();
  @Output("onReviewComment")
  reviewCommentHandler: EventEmitter<any> = new EventEmitter<any>();
  isReviewUpdated: boolean;
  disableReject: boolean;
  disableApprove: boolean;
  modalTitle: any;
  modalBody: any;
  isAlertVisible: boolean;
  userAction: any;

  video: any;
  canvas: any;
  tool = "Select";
  x0;
  y0;
  x1;
  y1;
  selected = null;
  state = [];
  mode = "add";
  mods = 0;

  action = "none";
  selectedColor = "rgba(0,0,0,0)";
  selectedStrokeColor = "#00b15f";

  isCircle = false;
  isSquare = false;
  isFont = false;
  isPencil = false;
  isMousePointer = false;
  isDelete = false;
  isSelect = false;
  isCanvasCreated = false;
  isUpdated = false;
  runOnce = false;

  opacityValue = 1;
  strokeValue = 5;
  frameRate = 24;

  prevPlayHead = -1;
  annotation = {};
  historyUndo: any[];
  historyRedo: any[];
  historyNextState: string;
  historyProcessing = false;
  blockAnnotationControls = "block";
  markerClicked = false;
  currTime = -1;
  SVGData = "";
  renderedVideoWidth = 0;
  renderedVideoHeight = 0;
  renderedVideoTop = 0;
  renderedVideoLeft = 0;
  showVideo: boolean;
  showImage: boolean;
  creativeType: any;
  ANNOTATION_TYPE = {
    NONE: "none",
    VIDEO: "video",
    IMAGE: "image",
  };
  creativeError: boolean;
  imageLoaing: boolean = true;
  isPortrait: boolean = false;
  isSmallImage: boolean = false;
  imageWidth: any;
  imageHeight: any;
  dataReady: boolean;
  isCreated: boolean;

  inBounds = true;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true,
  };

  position = { x: 0, y: -500 };
  currentframe = 0;
  fps = 24;
  userId: any;
  userOut: any;
  feedbackComment: any;

  isLarge: boolean; // = true;
  areaWidth = 852;
  areaHeight = 540;
  playerWidth = "852px";
  playerHeight = "540px";

  resolutionSD = {
    width: 852,
    height: 540,
  };

  resolutionHD = {
    width: 1280,
    height: 780,
  };

  resolutionFullHD = {
    width: 1920,
    height: 1140,
  };

  resolution4K = {
    width: 3840,
    height: 2220,
  };
  /*  
  Recommended dimensions: 
  426 x 240 (240p), 
  640 x 360 (360p), 
  854 x 480 (480p), 
  1280 x 720 (720p), 
  1920 x 1080 (1080p), 
  2560 x 1440 (1440p),
  3840 x 2160 (2160p).
  */
  constructor(
    private playlistService: PlaylistService,
    private helperService: HelperService,
    private notificationService: NotificationService,
    private usersService: UsersService,
    private location: Location
  ) {}

  checkEdge(event) {
    this.edge = event;
  }

  setCanvasTop() {
    if (this.isLarge) {
      if (!this.showVideo) {
        return "-780px";
      }
      //780-30
      return "-750px";
    } else {
      if (!this.showVideo) {
        return "-540px";
      }
      //540-30
      return "-510px";
    }
  }
  ngOnInit() {
    console.log(
      "Dim : " +
        document.documentElement.clientWidth +
        " x " +
        document.documentElement.clientHeight
    );

    let clientWidth = document.documentElement.clientWidth;

    let clientHeight = document.documentElement.clientHeight;
    console.log(
      "Your screen resolution is: " +
        window.screen.width * window.devicePixelRatio +
        "x" +
        window.screen.height * window.devicePixelRatio
    );

    this.areaWidth = this.resolutionSD.width;
    this.areaHeight = this.resolutionSD.height;
    this.isLarge = false;

    /*if (clientWidth > 1920 && clientHeight > 1080) {
      this.areaWidth = this.resolutionFullHD.width;
      this.areaHeight = this.resolutionFullHD.height;
    } else */ if (
      clientWidth >= 1920 &&
      clientHeight >= 1080
    ) {
      this.areaWidth = this.resolutionHD.width;
      this.areaHeight = this.resolutionHD.height;
      this.isLarge = true;
    }
    console.log("isLarge : " + this.isLarge);
    console.log("area : " + this.areaWidth + " x " + this.areaHeight);
    this.playerWidth = this.areaWidth + "px";
    this.playerHeight = this.areaHeight + "px";

    // areaWidth = 852;
    // areaHeight = 540;
    // playerWidth = "852px";
    // playerHeight = "540px";

    /*if (this.isLarge) {
      this.areaWidth = 1280;
      this.areaHeight = 780;

      this.playerWidth = "1280px";
      this.playerHeight = "780px";
    }*/
    this.prepareData(this.revisionInfo);
  }

  async prepareData(revisionInfo: any) {
    if (!revisionInfo.creativeUrl) {
      revisionInfo.creativeUrl = "unknown_empty.mp4";
    }

    this.userId = this.helperService.loginInfo.id;
    await this.getUser(this.userId);
    this.resetAll();
    this.revisionInfo = revisionInfo;
    //this.revisionInfo.creativeUrl = `https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4`;
    //this.revisionInfo.creativeUrl = `https://1.bp.blogspot.com/-ulBmIJ7dHBc/XEfJ6ywHW7I/AAAAAAAAB-c/UYdeP9vXWFE4T2ro3J3uab1dAmnk761oACLcBGAs/s1600/20190123_062705.png`;
    //this.revisionInfo.creativeUrl = `assets/BAG_BAG_1010-rpBrief2_qt17.mp4`;
    //this.revisionInfo.creativeUrl = `assets/BAG_BAG_1010-rpBrief2_qt17.mp4`;
    //this.revisionInfo.creativeUrl = `assets/images/no-image.png`;
    //this.revisionInfo.creativeUrl = `assets/images/logo.png`;
    //this.revisionInfo.creativeUrl = `assets/images/login-bg-full.png`;
    //let videoExt = ["mp4", "mov"];

    let imageExt = [".jpg", ".jpeg", ".png", ".tif"];
    if (this.revisionInfo && this.revisionInfo.creativeUrl) {
      let creativeUrl = this.revisionInfo.creativeUrl;
      let isImageCreative = imageExt.find((item) => {
        if (creativeUrl.indexOf(item) > -1) {
          return true;
        }
      });
      if (isImageCreative) {
        //this.revisionInfo.creativeUrl = `https://1.bp.blogspot.com/-ulBmIJ7dHBc/XEfJ6ywHW7I/AAAAAAAAB-c/UYdeP9vXWFE4T2ro3J3uab1dAmnk761oACLcBGAs/s1600/20190123_062705.png`;
        this.creativeType = this.ANNOTATION_TYPE.IMAGE;
        this.showImage = true;
        this.imageLoaing = true;
        this.creativeError = false;
      } else {
        this.creativeType = this.ANNOTATION_TYPE.VIDEO;
        this.showVideo = true;
      }
    }

    if (
      this.revisionInfo &&
      this.revisionInfo.versionType &&
      this.revisionInfo.versionType === "RENDER"
    ) {
      this.disableReject = true;
      this.disableApprove = true;
    } else {
      this.disableReject =
        this.revisionInfo &&
        this.revisionInfo.status &&
        this.revisionInfo.status === "REJECTED"
          ? true
          : false;
      this.disableApprove =
        this.revisionInfo &&
        this.revisionInfo.status &&
        this.revisionInfo.status === "APPROVED"
          ? true
          : false;
    }

    try {
      var oldPlayer = document.getElementById("video_holder");
      if (oldPlayer) {
        videojs(oldPlayer).dispose();
      }
    } catch (e) {}

    setTimeout(() => {
      this.dataReady = true;
      setTimeout(() => {
        if (this.creativeType === this.ANNOTATION_TYPE.VIDEO) {
          this.createPlayer();
        }
        this.annotationInit.emit(null);
      }, 10);
    }, 200);
  }

  createPlayer() {
    /*let _w = 852;
    let _h = 540;
    if (this.isLarge) {
      _w = 1280;
      _h = 780;
    }*/

    let _w = this.areaWidth;
    let _h = this.areaHeight;

    const options = {
      preload: "auto",
      width: _w,
      height: _h,
      inactivityTimeout: 0,
      playbackRates: [0.1, 0.5, 1],

      // fluid: true,
      // responsive: true,
      // aspectRatio: '16:9',
      // loop: true,
      controlBar: {
        muteToggle: true,
        pictureInPictureToggle: false,
        // remainingTimeDisplay: false, - if turned off - seekbar click issue, set display none in css
        durationDisplay: false,
        currentTimeDisplay: false,
        fullscreenToggle: false,
        volumePanel: false,
        fullscreenDisplay: false,
        fullscreen: false,
      },
    };
    this.video = videojs(this.videoElement.nativeElement, options);
    let videoSrc = "assets/BAG_BAG_1010-rpBrief2_qt17.mp4";
    if (this.revisionInfo && this.revisionInfo.creativeUrl) {
      if (this.revisionInfo.creativeUrl.indexOf(".mp4") > -1) {
        videoSrc = this.revisionInfo.creativeUrl;
      }
    }

    this.video.src([
      {
        type: "video/mp4",
        // src: '/assets/yume_pub_content_2017_640x360.mp4'
        //src: "assets/BAG_BAG_1010-rpBrief2_qt17.mp4",
        // src: '/assets/BAG_BAG_1010-rpBrief2_qt17.mov'
        src: videoSrc,
      },
    ]);
    this.video.on("loadedmetadata", () => {
      this.getVideoDimensions();
    });
    this.video.on("pause", () => {
      if (!this.video.waiting) {
        this.prevPlayHead = 0;
        this.blockAnnotationControls = "none";
      }
    });
    this.video.on("play", () => {
      if (!this.video.waiting) {
        this.saveAnnotations();
      }
    });
    this.video.on("ended", () => {
      this.saveAnnotations();
    });
    this.video.on("ready", () => {
      this.video.defaultPlaybackRate(1);
    });
    this.video.one("playing", () => {
      this.tool = "Select";
      this.blockAnnotationControls = "block";
      this.loadCanvas();
    });
    this.video.controlBar.progressControl.on("mouseup", (event) => {
      this.clearCanvas();
    });
    this.video.on("timeupdate", () => {
      const seekBarPerc = this.video.controlBar.progressControl.seekBar.el_.getAttribute(
        "aria-valuenow"
      );
      this.currTime = (seekBarPerc / 100) * this.video.duration();
      this.currentframe = Math.round(this.video.currentTime() * this.fps);
    });
    this.video.on("playerresize", () => {
      this.resizeCanvas();
    });

    class ResizeButton extends videojs.getComponent("Button") {
      ref: any;
      // tslint:disable-next-line:no-shadowed-variable
      constructor(player, options, parentRef) {
        super(player, options);
        super.addClass("vjs-fullscreen-control");
        this.ref = parentRef;
      }
      public handleClick(e) {
        ref.playerWidth = ref.playerWidth === "852px" ? "1280px" : "852px";
        ref.playerHeight = ref.playerHeight === "540px" ? "780px" : "540px";
        ref.video.dimensions(ref.playerWidth, ref.playerHeight);
      }
    }

    const resizeButton = new ResizeButton(this.video, options, this);
    //this.video.controlBar.addChild(resizeButton);

    const ref = this;
    this.video.markers({
      markerStyle: {
        width: "4px",
        "border-radius": "40%",
        "background-color": "#80fd92",
      },
      markerTip: {
        display: false,
      },
      onMarkerReached(marker, index) {},
      onMarkerClick(marker) {
        ref.markerClicked = true;
        ref.video.pause();
        this.tool = "Select";
        ref.blockAnnotationControls = "none";
        ref.renderCanvas(marker.time);
      },
    });
    this.isCreated = true;
  }

  getCanvasWidth() {
    let canvasWidth = 0;
    if (this.creativeType === this.ANNOTATION_TYPE.VIDEO) {
      canvasWidth = this.video.currentWidth();
    } else if (this.creativeType === this.ANNOTATION_TYPE.IMAGE) {
      //canvasWidth = document.getElementsByClassName("myImage")[0].clientWidth;
      canvasWidth = this.imageWidth;
    }
    return canvasWidth;
  }
  getCanvasHeight() {
    let canvasHeight = 0;
    if (this.creativeType === this.ANNOTATION_TYPE.VIDEO) {
      canvasHeight =
        this.video.currentHeight() -
        this.video.getChild("controlBar").currentHeight() * 2;
      //canvasHeight = this.video.currentHeight();
    } else if (this.creativeType === this.ANNOTATION_TYPE.IMAGE) {
      //canvasHeight = document.getElementsByClassName("myImage")[0].clientHeight;
      canvasHeight = this.imageHeight;
    }
    return canvasHeight;
  }

  getCanvasLeft() {
    let canvasLeft = 0;
    if (this.creativeType === this.ANNOTATION_TYPE.VIDEO) {
    } else if (this.creativeType === this.ANNOTATION_TYPE.IMAGE) {
      canvasLeft = document.getElementsByClassName("myImage")[0]["offsetLeft"];
    }
    return canvasLeft;
  }

  getCanvasTop() {
    let canvasTop = 0;
    if (this.creativeType === this.ANNOTATION_TYPE.VIDEO) {
    } else if (this.creativeType === this.ANNOTATION_TYPE.IMAGE) {
      canvasTop = document.getElementsByClassName("myImage")[0]["offsetTop"];
    }
    return canvasTop;
  }

  setImgClasses() {
    let imgClasses = {
      //"img-portrait": this.isPortrait,
      //"img-landscape": !this.isPortrait,
    };
    if (this.isSmallImage) {
      imgClasses = {
        "img-sm": this.isSmallImage,
      };
    } else {
      imgClasses = {
        "img-portrait": this.isPortrait,
        "img-landscape": !this.isPortrait,
      };
    }

    return imgClasses;
  }

  onImageLoad(e) {
    this.imageLoaing = false;
    this.isPortrait = false;
    this.isSmallImage = false;
    try {
      var img = e.target;
      img.offsetY;

      if (img.naturalHeight > img.naturalWidth) {
        this.isPortrait = true;
      } else {
        this.isPortrait = false;
      }
      if (
        img.naturalHeight < this.areaHeight &&
        img.naturalWidth < this.areaWidth
      ) {
        this.isSmallImage = true;
      }
      setTimeout(() => {
        //this.imageWidth = img.width;
        //this.imageHeight = img.height;
        this.imageWidth = img.clientWidth;
        this.imageHeight = img.clientHeight;
        this.tool = "Select";
        this.blockAnnotationControls = "none";
        this.loadCanvas();
      }, 200);
    } catch (e) {}
  }

  onImageError() {
    this.imageLoaing = false;
    this.creativeError = true;
  }

  loadCanvas() {
    this.canvas = new fabric.Canvas("myCanvas");
    let w = this.getCanvasWidth();
    let h = this.getCanvasHeight();
    let l = this.getCanvasLeft();
    let t = this.getCanvasTop();
    this.canvas.setWidth(w);
    this.canvas.setHeight(h);
    //this.canvas.style.left = l + "px";
    //this.canvas.style.top = t + "px";

    this.canvas.hoverCursor = "pointer";
    this.canvas.selection = false;
    this.isCanvasCreated = true;
    this.registerMouse();
    this._historyInit();
  }

  renderCanvas(markerTime) {
    if (this.annotation[markerTime] !== null) {
      this.canvas.isDrawingMode = false;
      if (this.annotation[markerTime] !== undefined) {
        this.canvas.loadFromJSON(this.annotation[markerTime]).renderAll();
        if (this.video.currentWidth() !== 852) {
          this.resizeCanvas();
        }
      }
    }
  }

  resizeCanvas() {
    if (!this.isCanvasCreated) {
      return;
    }
    this.canvas.setWidth(this.video.currentWidth());
    this.canvas.setHeight(
      this.video.currentHeight() -
        this.video.getChild("controlBar").currentHeight() * 2
    );
    let widthRatio = 0;
    let heightRatio = 0;
    let pathScale = 1;
    if (this.video.currentWidth() === 852) {
      widthRatio = 852 / 1280;
      heightRatio = 480 / 720;
      pathScale = 1;
    } else {
      widthRatio = 1280 / 852;
      heightRatio = 720 / 480;
      pathScale = 1.5;
    }
    this.canvasSetObjectValues(widthRatio, heightRatio, pathScale);
    this.canvas.renderAll();
  }

  canvasSetObjectValues(widthRatio, heightRatio, pathScale) {
    this.canvas.getObjects().map((o) => {
      if (o.type === "ellipse") {
        o.set({
          rx: o.rx * widthRatio,
          ry: o.ry * heightRatio,
          top: o.top * heightRatio,
          left: o.left * widthRatio,
        });
      }
      if (o.type === "rect" || o.type === "lineArrow") {
        o.set({
          width: o.width * widthRatio,
          height: o.height * heightRatio,
          top: o.top * heightRatio,
          left: o.left * widthRatio,
        });
      }
      if (o.type === "i-text") {
        o.set({
          top: o.top * heightRatio,
          left: o.left * widthRatio,
        });
      }
      if (o.type === "path") {
        o.set({
          top: o.top * heightRatio,
          left: o.left * widthRatio,
          scaleX: pathScale,
          scaleY: pathScale,
        });
      }
      o.setCoords();
    });
  }

  addAnnotation() {
    if (this.creativeType !== this.ANNOTATION_TYPE.VIDEO) {
      return;
    }
    const seekBarPerc = this.video.controlBar.progressControl.seekBar.el_.getAttribute(
      "aria-valuenow"
    );
    this.currTime = (seekBarPerc / 100) * this.video.duration();
    if (this.video.markers.getMarkers().length === 0) {
      this.video.markers.add([{ time: this.currTime, class: "special-blue" }]);
      this.video.markers.updateTime();
    } else {
      let markerFound = false;
      const markers = this.video.markers.getMarkers();
      for (const [index, marker] of markers.entries()) {
        if (marker.time === this.currTime) {
          markerFound = true;
        }
      }
      if (!markerFound) {
        this.video.markers.add([
          { time: this.currTime, class: "special-blue" },
        ]);
        this.video.markers.updateTime();
      }
    }
  }

  saveAnnotations() {
    if (this.runOnce === false) {
      this.runOnce = true;
      return;
    }
    if (this.video.currentWidth() !== 852) {
      const widthRatio = 852 / 1280;
      const heightRatio = 480 / 720;
      const pathScale = 1;
      this.canvasSetObjectValues(widthRatio, heightRatio, pathScale);
    }
    this.annotation[this.currTime] = JSON.stringify(this.canvas.toJSON());
    this.clearCanvas();
    this.tool = "Select";
    this.blockAnnotationControls = "block";
  }

  clearCanvas() {
    if (this.isCanvasCreated) {
      this.canvas.clear();
      this.clearHistory();
      this.historyProcessing = false;
    }
  }

  getVideoDimensions() {
    const regionHeight = this.video.currentHeight();
    const videoAspect = this.video.videoWidth() / this.video.videoHeight();
    const regionAspect = this.video.currentWidth() / regionHeight;

    if (
      this.video.videoWidth() <= this.video.currentWidth() &&
      this.video.videoHeight() <= regionHeight
    ) {
      this.renderedVideoWidth = this.video.videoWidth();
      this.renderedVideoHeight = this.video.videoHeight();
    } else if (videoAspect > regionAspect) {
      this.renderedVideoWidth = this.video.currentWidth();
      this.renderedVideoHeight = this.renderedVideoWidth * (1 / videoAspect);
    } else {
      this.renderedVideoHeight = regionHeight;
      this.renderedVideoWidth = this.renderedVideoHeight * videoAspect;
    }
    this.renderedVideoLeft = Math.abs(
      Math.round((this.video.currentWidth() - this.renderedVideoWidth) / 2)
    );
    this.renderedVideoTop = Math.abs(
      Math.round((regionHeight - this.renderedVideoHeight) / 2)
    );
  }

  registerMouse() {
    this.canvas.on("selection:created", (event) => {
      this.updateDrawingComponents(event);
    });
    this.canvas.on("selection:updated", (event) => {
      this.updateDrawingComponents(event);
    });
    this.canvas.observe("mouse:down", (options) => {
      const pointer = this.canvas.getPointer(options.e);
      this.x0 = pointer.x;
      this.y0 = pointer.y;
      this.canvas.isDrawingMode = false;
      switch (this.tool) {
        case "Freeline": {
          this.canvas.isDrawingMode = true;
          this.canvas.freeDrawingBrush.width = this.strokeValue;
          this.canvas.freeDrawingBrush.color = this.selectedStrokeColor;
          this.canvas.freeDrawingBrush.opacity = this.opacityValue;
          break;
        }
        case "Rectangle": {
          const rectangle = new fabric.Rect({
            top: this.y0,
            left: this.x0,
            fill: this.selectedColor,
            selectable: false,
            strokeWidth: this.strokeValue,
            stroke: this.selectedStrokeColor,
            opacity: this.opacityValue,
            borderColor: this.selectedStrokeColor,
          });
          this.canvas.add(rectangle);
          this.selected = rectangle;
          break;
        }
        case "Ellipse": {
          const ellipse = new fabric.Ellipse({
            //originX: "center",
            //originY: "center",
            originY: "top",
            originX: "left",
            top: this.y0,
            left: this.x0,
            fill: this.selectedColor,
            rx: 0,
            ry: 0,
            selectable: false,
            strokeWidth: this.strokeValue,
            stroke: this.selectedStrokeColor,
            opacity: this.opacityValue,
          });
          this.canvas.add(ellipse);
          this.selected = ellipse;
          break;
        }
        case "Arrow": {
          this.canvas.isDrawingMode = true;
          this.canvas.isDrawingMode = true;
          const points = [this.x0, this.y0, this.x0, this.y0];
          const arrowLine = createLineArrow(
            points,
            this.selectedColor,
            this.selectedStrokeColor,
            this.strokeValue,
            this.opacityValue
          );
          this.canvas.add(arrowLine);
          this.selected = arrowLine;
          break;
        }
        case "TextBox": {
          const textBox = new fabric.IText("", {
            left: this.x0,
            top: this.y0,
            fontFamily: "arial black",
            fill: this.selectedColor,
            //fill: this.selectedStrokeColor,
            //strokeWidth: this.strokeValue,
            strokeWidth: 1,
            stroke: this.selectedStrokeColor,
            opacity: this.opacityValue,
            fontSize: 24,
            originX: "left",
            hasRotatingPoint: true,
            editable: true,
            backgroundColor: "rgba(0,0,0,0.2)",
          });
          this.canvas.add(textBox);
          this.tool = "Select";
          this.canvas.setActiveObject(textBox);
          textBox.enterEditing();
          this.selected = null;
          // this.objectsSelectable(true);
          break;
        }
      }
    });

    this.canvas.observe("mouse:move", (options) => {
      if (this.selected != null) {
        const pointer = this.canvas.getPointer(options.e);
        const tempX2 = pointer.x;
        const tempY2 = pointer.y;
        const changeInX = tempX2 - this.x0;
        const changeInY = tempY2 - this.y0;
        switch (this.tool) {
          case "Rectangle": {
            if (this.selected !== null) {
              this.selected.set({
                width: changeInX,
                height: changeInY,
              });
              this.selected.setCoords();
            }
            this.canvas.renderAll();
            break;
          }
          case "Ellipse": {
            var orgX = "left";
            var orgY = "top";
            if (this.x0 > pointer.x) {
              orgX = "right";
            } else {
              orgX = "left";
            }
            if (this.y0 > pointer.y) {
              orgY = "bottom";
            } else {
              orgY = "top";
            }
            if (this.selected !== null) {
              this.selected.set({
                rx: Math.abs(changeInX),
                ry: Math.abs(changeInY),
                originX: orgX,
                originY: orgY,
              });
              this.selected.setCoords();
            }
            this.canvas.renderAll();
            break;
          }
          case "Arrow": {
            if (this.selected !== null) {
              if (!this.canvas.isDrawingMode) {
                return;
              }
              this.selected.set({
                x2: tempX2,
                y2: tempY2,
              });
              this.selected.setCoords();
              this.canvas.renderAll();
              break;
            }
          }
        }
      }
    });

    this.canvas.observe("mouse:up", (e) => {
      switch (this.tool) {
        case "Arrow": {
          if (this.selected !== null) {
            this.selected.set({
              dirty: true,
              objectCaching: true,
            });
            this.canvas.renderAll();
            this.canvas.isDrawingMode = false;
          }
          break;
        }
      }
      if (this.mode === "add") {
        this.selected = null;
      }
      this.x0 = 0;
      this.y0 = 0;
    });
  }

  objectsSelectable(isSelectable) {
    this.canvas.forEachObject((obj) => {
      obj.selectable = isSelectable;
    });
  }

  deleteObjects() {
    const activeObjects = this.canvas.getActiveObjects();
    if (this.canvas.getActiveObjects().length > 0) {
      //if (confirm("Are you sure?")) {
      this.canvas.discardActiveObject();
      this.canvas.remove(...activeObjects);
      if (this.canvas.toJSON().objects.length === 0) {
        let markerIndex = -1;
        const markers = this.video.markers.getMarkers();
        for (const [index, marker] of markers.entries()) {
          if (marker.time === this.currTime) {
            markerIndex = index;
          }
        }
        if (markerIndex !== -1) {
          this.video.markers.remove([markerIndex]);
        }
      }
      this.actionBtnClick("Select");
      //}
    }
  }

  updateDrawingComponents(event) {
    if (this.canvas.getActiveObjects().length === 1) {
      const type = event.target.type;
      this.opacityValue = this.getActiveStyle("opacity");
      if (type !== "i-text") {
        this.strokeValue = this.getActiveStyle("strokeWidth");
      }
      if (type !== "path") {
        this.selectedColor = this.getActiveStyle("fill");
      }
      this.selectedStrokeColor = this.getActiveStyle("stroke");

      const activeObject = this.canvas.getActiveObject();
      activeObject.set({
        transparentCorners: false,
        cornerColor: "#80fd92",
        cornerStrokeColor: "#ff7070",
        borderColor: "#ff7070",
        cornerSize: 10,
        padding: 5,
        cornerStyle: "circle",
        borderDashArray: [5, 5],
      });
    }
  }

  getActiveStyle(styleName) {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) {
      return "";
    }
    return activeObject.getSelectionStyles && activeObject.isEditing
      ? activeObject.getSelectionStyles()[styleName] || ""
      : activeObject[styleName] || "";
  }

  onOpacityChange(ref) {
    if (this.canvas) {
      this.canvas.isDrawingMode = false;
      this.setActiveStyle("opacity", ref);
    }
  }

  onStrokeChange(ref) {
    if (this.canvas) {
      this.canvas.isDrawingMode = false;
      this.setActiveStyle("strokeWidth", ref);
    }
  }

  backgroundColorChange(ref) {
    if (this.canvas) {
      this.canvas.isDrawingMode = false;
      this.setActiveStyle("fill", ref);
    }
  }

  strokeColorChange(ref) {
    if (this.canvas) {
      this.canvas.isDrawingMode = false;
      this.setActiveStyle("stroke", ref);
    }
  }

  setActiveStyle(styleName, value) {
    if (this.canvas) {
      const activeObjects = this.canvas.getActiveObjects();
      if (!activeObjects) {
        return;
      }
      if (activeObjects) {
        activeObjects.forEach((obj) => {
          if (obj.setSelectionStyles && obj.isEditing) {
            const style = {};
            style[styleName] = value;
            obj.setSelectionStyles(style);
          } else {
            obj.set(styleName, value);
          }
          obj.setCoords();
        });
      }
      this.canvas.requestRenderAll();
    }
  }

  actionBtnClick(ref) {
    if (this.isCanvasCreated === false) {
      return false;
    }
    this.markerClicked = false;
    this.tool = ref;
    this.btnReset();
    this.canvas.isDrawingMode = false;
    switch (ref) {
      case "Ellipse":
        this.isCircle = true;
        break;
      case "Rectangle":
        this.isSquare = true;
        break;
      case "TextBox":
        this.isFont = true;
        break;
      case "Freeline":
        this.isPencil = true;
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush.width = this.strokeValue;
        this.canvas.freeDrawingBrush.color = this.selectedStrokeColor;
        break;
      case "Arrow":
        this.isMousePointer = true;
        break;
      case "Redo":
        this.redo();
        this.isSelect = true;
        break;
      case "Undo":
        this.undo();
        this.isSelect = true;
        break;
      case "ColorFill":
        this.isSelect = true;
        break;
      case "Delete":
        this.isSelect = true;
        this.deleteObjects();
        break;
      case "Select":
        this.isSelect = true;
        break;
      case "Stroke":
        this.isSelect = true;
        break;
    }
    if (
      this.tool === "Select" ||
      this.tool === "Delete" ||
      this.tool === "Redo" ||
      this.tool === "Undo" ||
      this.tool === "ColorFill" ||
      this.tool === "Stroke"
    ) {
      this.objectsSelectable(true);
    } else {
      this.objectsSelectable(false);
    }
  }

  btnReset() {
    this.isCircle = false;
    this.isSquare = false;
    this.isFont = false;
    this.isPencil = false;
    this.isMousePointer = false;
    this.isDelete = false;
    this.isSelect = false;
  }

  // undo & redo - History Maintenance

  _historyAddEvents() {
    if (this.canvas) {
      this.canvas.on("object:added", () => {
        this._historySaveAction();
      });
      this.canvas.on("object:removed", () => {
        this._historySaveAction();
      });
      this.canvas.on("object:modified", () => {
        this._historySaveAction();
      });
      this.canvas.on("object:skewing", () => {
        this._historySaveAction();
      });
    }
  }

  _historyRemoveEvents() {
    if (this.canvas) {
      this.canvas.off("object:added", () => {
        this._historySaveAction();
      });
      this.canvas.off("object:removed", () => {
        this._historySaveAction();
      });
      this.canvas.off("object:modified", () => {
        this._historySaveAction();
      });
      this.canvas.off("object:skewing", () => {
        this._historySaveAction();
      });
    }
  }

  _historyNext() {
    const data = this.canvas.toDatalessJSON(this.canvas.extraProps);
    if (data.objects.length === 0) {
    }
    return JSON.stringify(this.canvas.toDatalessJSON(this.canvas.extraProps));
  }

  _historyInit() {
    this.historyUndo = [];
    this.historyRedo = [];
    this.historyNextState = this._historyNext();
    this._historyAddEvents();
  }

  _historyDispose() {
    this._historyRemoveEvents();
  }

  _historySaveAction() {
    if (this.markerClicked) {
      return;
    }
    if (this.historyProcessing) {
      return;
    }
    this.isUpdated = true;
    const json = this.historyNextState;
    this.historyUndo.push(json);
    this.historyNextState = this._historyNext();
    this.addAnnotation();
  }

  undo() {
    this.historyProcessing = true;
    if (this.isUpdated) {
      this.isUpdated = false;
      const json = this.historyNextState;
      this.historyUndo.push(json);
    }
    const history = this.historyUndo.pop();
    if (history) {
      this.historyRedo.push(this._historyNext());
      this.canvas.loadFromJSON(history).renderAll();
    }
    this.historyProcessing = false;
  }

  redo() {
    this.historyProcessing = true;
    const history = this.historyRedo.pop();
    if (history) {
      this.historyUndo.push(this._historyNext());
      this.canvas.loadFromJSON(history).renderAll();
    }
    this.historyProcessing = false;
  }

  clearHistory() {
    this.historyUndo = [];
    this.historyRedo = [];
  }

  ngOnDestroy(): void {
    this._historyDispose();
  }

  saveImg() {
    let imageData = "";
    if (!fabric.Canvas.supports("toDataURL")) {
      if (this.isCanvasCreated) {
        const ctx = this.myVideoCanvas.nativeElement.getContext("2d");
        let assetHeightRegion = 0;
        let assetWidthRegion = 0;
        if (this.creativeType === this.ANNOTATION_TYPE.VIDEO) {
          assetHeightRegion =
            this.video.currentHeight() -
            this.video.getChild("controlBar").currentHeight() * 2;
          this.myVideoCanvas.nativeElement.width = this.video.currentWidth();
          this.myVideoCanvas.nativeElement.height = assetHeightRegion;

          ctx.drawImage(
            this.videoElement.nativeElement,
            0,
            0,
            this.myVideoCanvas.nativeElement.width,
            this.myVideoCanvas.nativeElement.height
          );
          ctx.drawImage(
            this.canvasElement.nativeElement,
            0,
            0,
            this.video.currentWidth(),
            assetHeightRegion
          );
        } else if (this.creativeType === this.ANNOTATION_TYPE.IMAGE) {
          assetWidthRegion = this.getCanvasWidth();
          assetHeightRegion = this.getCanvasHeight();
          this.myVideoCanvas.nativeElement.width = assetWidthRegion;
          this.myVideoCanvas.nativeElement.height = assetHeightRegion;
          ctx.drawImage(
            this.imageElement.nativeElement,
            0,
            0,
            this.myVideoCanvas.nativeElement.width,
            this.myVideoCanvas.nativeElement.height
          );
          ctx.drawImage(
            this.canvasElement.nativeElement,
            0,
            0,
            assetWidthRegion,
            assetHeightRegion
          );
        }

        // download file

        // const imgType = 'image/png';
        // const imgData = this.myVideoCanvas.nativeElement.toDataURL(imgType);
        // document.location.href = imgData.replace(imgType, 'image/octet-stream');

        // open in new tab
        // const w = window.open('about:blank', 'name');
        // let DW = '';
        // DW += '<img src=\'';
        // DW += this.myVideoCanvas.nativeElement.toDataURL('image/png');
        // DW += '\' alt=\'from canvas\'/>';
        // w.document.write(DW);
        // w.document.title = 'test';
        try {
          imageData = this.myVideoCanvas.nativeElement.toDataURL("image/png");
        } catch (e) {
          imageData = this.canvas.toDataURL("png");
        }
      }
    } else {
      window.open(this.canvas.toDataURL("png"));
      imageData = this.canvas.toDataURL("png");
    }
    return imageData;
  }

  rejectHandler() {
    this.userAction = "reject";
    this.modalTitle = "Reject Version";
    this.modalBody = "Are you sure to reject this version?";
    this.isAlertVisible = true;
  }

  approveHandler() {
    this.userAction = "approve";
    this.modalTitle = "Approve Version";
    this.modalBody = "Are you sure to approve this version?";
    this.isAlertVisible = true;
  }

  postComment() {
    if (this.feedbackComment) {
      let commentInfo = {
        feedbackComment: this.feedbackComment,
      };
      this.reviewCommentHandler.emit(commentInfo);
      this.feedbackComment = "";
    }
  }

  closeAnnotation() {
    let event = {
      isReviewUpdated: this.isReviewUpdated,
    };
    this.annotationClose.emit(event);
  }

  onConfirm() {
    this.isAlertVisible = false;
    this.postComment();
    if (this.userAction === "reject") {
      this.rejectConfirm();
    } else {
      this.approveConfirm();
    }
  }

  onCancel() {
    this.isAlertVisible = false;
  }

  async rejectConfirm() {
    let isEditSuccess = false;
    let errorMessage = AppConstants.REJECT_PLAYLIST_ERROR;
    await this.playlistService
      .rejectPlaylist(this.revisionInfo.taskRevisionId)
      .toPromise()
      .then((resp: any) => {
        isEditSuccess = true;
      })
      .catch((error: any) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        isEditSuccess = false;
      });
    if (isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: AppConstants.REJECT_PLAYLIST_SUCCESS,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
      this.disableReject = !this.disableReject;
      this.disableApprove = !this.disableApprove;
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
    this.isReviewUpdated = true;
    //this.location.back();
    //this.annotationComplete.emit(null);
  }

  async approveConfirm() {
    let isEditSuccess = false;
    let errorMessage = AppConstants.APPROVE_PLAYLIST_ERROR;
    await this.playlistService
      .approvePlaylist(this.revisionInfo.taskRevisionId)
      .toPromise()
      .then((resp: any) => {
        isEditSuccess = true;
      })
      .catch((error: any) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        isEditSuccess = false;
      });
    if (isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: AppConstants.APPROVE_PLAYLIST_SUCCESS,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
      this.disableReject = !this.disableReject;
      this.disableApprove = !this.disableApprove;
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
    this.isReviewUpdated = true;
    //this.location.back();
    //this.annotationComplete.emit(null);
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  handleNext() {
    if (this.isLast) {
      return;
    }
    this.resetAll();
    this.onNext.emit(null);
  }

  handlePrev() {
    if (this.isFirst) {
      return;
    }
    this.resetAll();
    this.onPrev.emit(null);
  }

  resetAll() {
    this.feedbackComment = null;
    this.dataReady = false;
    this.showVideo = false;
    this.showImage = false;
    this.isCreated = false;
    this.showVideo = false;
    this.showImage = false;
    this.isCanvasCreated = false;
    this.clearCanvas();
    this.creativeType = this.ANNOTATION_TYPE.NONE;
  }

  async getUser(userId: any) {
    await this.usersService
      .getUser(userId)
      .toPromise()
      .then((resp: any) => {
        this.userOut = resp.entity;
      })
      .catch((error: any) => {
        this.userOut = null;
      });
    this.helperService.userInfo = this.userOut;
  }

  getAvatarInfo() {
    let user = {
      firstName: "U",
      lastName: "N",
      thumbnail: "",
    };
    if (this.userOut) {
      if (this.userOut.firstName) {
        user.firstName = this.userOut.firstName;
      }
      if (this.userOut.lastName) {
        user.lastName = this.userOut.lastName;
      }
      if (this.userOut.thumbnail) {
        user.thumbnail = this.userOut.thumbnail;
      }
    }

    return {
      ...user,
      size: "default",
    };
  }
}
