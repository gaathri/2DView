import { Component, OnInit, Input } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { TemplatesService } from "../templates.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-template-tree-table",
  templateUrl: "./template-tree-table.component.html",
  styleUrls: ["./template-tree-table.component.scss"],
})
export class TemplateTreeTableComponent implements OnInit {
  @Input() selectedTemplate: any;
  @Input() type: any;
  @Input() isReadOnly: any;
  isDataReady: boolean;
  rowCount = 0;
  rows: any;
  //rows_show = [{ "id": 1, "parentId": null, "name": "Show Template", "treeStatus": "expanded", "childIds": [2, 4, 6, 7] }, { "id": 2, "parentId": 1, "name": "CLIENT_IN", "treeStatus": "expanded", "childIds": [] }, { "id": 4, "parentId": 1, "name": "CLIENT_OUT", "treeStatus": "expanded", "childIds": [5] }, { "id": 5, "parentId": 4, "name": "FINALS", "treeStatus": "collapsed", "childIds": [] }, { "id": 6, "parentId": 1, "name": "EDITORIAL", "treeStatus": "collapsed", "childIds": [] }, { "id": 7, "parentId": 1, "name": "REFERENCES", "treeStatus": "expanded", "childIds": [8, 9, 10] }, { "id": 8, "parentId": 7, "name": "IMAGES", "treeStatus": "collapsed", "childIds": [] }, { "id": 9, "parentId": 7, "name": "PDFS", "treeStatus": "collapsed", "childIds": [] }, { "id": 10, "parentId": 7, "name": "VIDEOCLIPS", "treeStatus": "collapsed", "childIds": [] }];
  //rows_shot = [{ "id": 1, "parentId": null, "name": "Shot Template", "treeStatus": "expanded", "childIds": [2, 4] }, { "id": 2, "parentId": 1, "name": "2D", "treeStatus": "expanded", "childIds": [11] }, { "id": 4, "parentId": 1, "name": "3D", "treeStatus": "expanded", "childIds": [5, 14, 15] }, { "id": 5, "parentId": 4, "name": "FX", "treeStatus": "expanded", "childIds": [16] }, { "id": 11, "parentId": 2, "name": "NUKE", "treeStatus": "expanded", "childIds": [12, 13] }, { "id": 12, "parentId": 11, "name": "RENDER", "treeStatus": "collapsed", "childIds": [] }, { "id": 13, "parentId": 11, "name": "SCENES", "treeStatus": "collapsed", "childIds": [] }, { "id": 14, "parentId": 4, "name": "LAYOUT", "treeStatus": "expanded", "childIds": [18, 21] }, { "id": 15, "parentId": 4, "name": "LIGHT", "treeStatus": "expanded", "childIds": [19, 22] }, { "id": 16, "parentId": 5, "name": "3DSMAX", "treeStatus": "expanded", "childIds": [17, 20] }, { "id": 17, "parentId": 16, "name": "GEO", "treeStatus": "collapsed", "childIds": [] }, { "id": 18, "parentId": 14, "name": "GEO", "treeStatus": "collapsed", "childIds": [] }, { "id": 19, "parentId": 15, "name": "GEO", "treeStatus": "collapsed", "childIds": [] }, { "id": 20, "parentId": 16, "name": "RENDER", "treeStatus": "collapsed", "childIds": [] }, { "id": 21, "parentId": 14, "name": "RENDER", "treeStatus": "collapsed", "childIds": [] }, { "id": 22, "parentId": 15, "name": "RENDER", "treeStatus": "collapsed", "childIds": [] }];
  //rows_pack = [{"id":1,"parentId":null,"name":"Pack Template","treeStatus":"collapsed","childIds":[],"typeName":"Random Type 01","attributeName":"Random Attribute 01","typeId":1,"attributeId":1}];
  idsToBeRemoved = [];
  editing = {};
  /** Dropdown inline edit vars - START */
  isEditSuccess: boolean;
  isVisible: boolean;
  modalTitle: any;
  myrow: any;
  mycolName: any;

  isTypeSelect: boolean;
  selectedTypeId: any;
  packingTypes: any;

  isAttributeSelect: boolean;
  selectedAttributeId: any;
  packingAttributes: any;
  /** Dropdown inline edit vars - END*/

  constructor(
    private helperService: HelperService,
    private templatesService: TemplatesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  isDisabled(template?: any) {
    if (this.isReadOnly) {
      return true;
    }
    if (template && template.isDefault === 1) {
      return true;
    }
    return false;
  }

  isAddDisabled(row?: any) {
    if (
      this.isReadOnly ||
      this.selectedTemplate.isDefault ||
      (row && row.level > 4)
    ) {
      return true;
    }
    return false;
  }

  isDeleteDisabled(rowIndex?: any) {
    if (this.isReadOnly || this.selectedTemplate.isDefault || rowIndex == 0) {
      return true;
    }
    return false;
  }

  findRowCount() {
    if (this.rows && this.rows.length > 0) {
      this.rowCount = this.getMaxId(this.rows, "id");
    } else {
      this.rowCount = 0;
    }
  }

  getMaxId(data: any, key: any) {
    let max = data.reduce(function (prev: any, current: any) {
      return prev[key] > current[key] ? prev : current;
    });
    return max[key];
  }

  addHandler(parent: any) {
    this.rowCount++;
    let child = { ...parent };
    child.id = this.rowCount;
    child.parentId = parent.id;
    child.name = "Folder_" + this.getRand();
    child.treeStatus = "collapsed";
    child.childIds = [];
    parent.treeStatus = "expanded";
    parent.childIds.push(child.id);
    this.rows = [...this.rows, child];
  }

  getRand() {
    return Math.floor(new Date().valueOf() * Math.random());
  }

  enableEdit(row: any, colName: any) {
    if (this.selectedTemplate.isDefault) {
      return;
    }

    this.resetEditFlags();
    this.editing[row.id + "-" + colName] = true;

    if (colName === "typeName") {
      this.getPackingTypes();
    } else if (colName === "attributeName") {
      this.getPackingAttributes();
    }
  }

  inlineEditHandler(row: any, colName: any) {
    this.resetEditFlags();
    this.myrow = row;
    this.mycolName = colName;
    this.isTypeSelect = false;
    this.isAttributeSelect = false;
    this.modalTitle = "";

    if (colName === "typeName") {
      this.modalTitle = "Edit Package Type";
      this.selectedTypeId = row.typeId;
      this.isTypeSelect = true;
      this.getPackingTypes();
    } else if (colName === "attributeName") {
      this.modalTitle = "Edit Package Attribute";
      this.selectedAttributeId = row.attributeId;
      this.isAttributeSelect = true;
      this.getPackingAttributes();
    }

    if (this.modalTitle !== "") {
      this.showModal();
    }
  }

  async inlineEditConfirm(row: any, colName: any) {
    let shotId = row.id;
    let shotIn: any;
    this.isVisible = false;
    if (colName === "typeName") {
      this.isTypeSelect = false;
      if (this.selectedTypeId !== row.typeId) {
        // shotIn = {
        //   type: 'seasonId',
        //   seasonId: row.seasonId
        // }
        // await this.updateConfirm(row, col, shotId, shotIn);
        // if (this.isEditSuccess) {
        //   row[colName] = this.getTypeNameById(row.typeId);
        // }
        row[colName] = this.getTypeNameById(row.typeId);
      }
    } else if (colName === "attributeName") {
      this.isAttributeSelect = false;
      if (this.selectedAttributeId !== row.attributeId) {
        // shotIn = {
        //   type: 'seasonId',
        //   seasonId: row.seasonId
        // }
        // await this.updateConfirm(row, col, shotId, shotIn);
        // if (this.isEditSuccess) {
        //   row[colName] = this.getAttributeNameById(row.typeId);
        // }
        row[colName] = this.getAttributeNameById(row.typeId);
      }
    }
  }

  inlineEditCancel(row: any, colName: any) {
    this.isVisible = false;
    if (colName === "typeName") {
      this.isTypeSelect = false;
      row.typeId = this.selectedTypeId;
    } else if (colName === "attributeName") {
      this.isAttributeSelect = false;
      row.attributeId = this.selectedAttributeId;
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  getTypeNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.packingTypes,
      "id",
      id
    );
    if (matched) {
      return matched.packingTypeName;
    } else {
      return "";
    }
  }

  getAttributeNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.packingAttributes,
      "id",
      id
    );
    if (matched) {
      return matched.packingAttributeName;
    } else {
      return "";
    }
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  updateValue(row: any, colName: any, event: any) {
    let isInvalidPattern = this.isPatternError(event.target.value);

    if (isInvalidPattern) {
      this.showNotification({
        type: "warning",
        title: "Operation not allowed...!",
        content: "Folder Name error. Use another name.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
      event.target.value = row[colName];
      return;
    }
    let isDuplicateName = this.isDuplicate(row, event.target.value);

    if (isDuplicateName) {
      this.showNotification({
        type: "warning",
        title: "Operation not allowed...!",
        content: "A folder with this name already exists. Use another name.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
      event.target.value = row[colName];
      return;
    }
    if (row[colName] != event.target.value) {
      row[colName] = event.target.value;
    }
    this.editing[row.id + "-" + colName] = false;
  }

  isPatternError(value: any) {
    let patt = new RegExp(AppConstants.folderNameRE);
    let isValid = patt.test(value);
    return !isValid;
  }

  isDuplicate(child: any, value: any) {
    let parentNode = this.getNode(child.parentId);
    if (!parentNode) {
      return false;
    }
    let duplicate = false;
    let siblingsIds = parentNode.childIds;
    let sibling: any;
    for (let i = 0; i < siblingsIds.length; i++) {
      if (siblingsIds[i] !== child.id) {
        sibling = this.getNode(siblingsIds[i]);
        if (sibling && sibling.name === value) {
          duplicate = true;
          break;
        }
      }
    }
    return duplicate;
  }

  onChange(row: any, colName: any, event: any): void {
    this.editing[row.id + "-" + colName] = false;
    if (colName === "typeName") {
      row.typeId = event;
      row[colName] = this.getTypeNameById(event);
    } else if (colName === "attributeName") {
      row.attributeId = event;
      row[colName] = this.getAttributeNameById(event);
    }
  }

  resetEditFlags() {
    for (let key in this.editing) {
      if (this.editing.hasOwnProperty(key)) {
        this.editing[key] = false;
      }
    }
  }

  deleteHandler(row: any) {
    this.idsToBeRemoved = [row.id];
    this.getIdsToBeRemoved(row);
    this.rows = this.rows.filter((row) => {
      return !this.idsToBeRemoved.includes(row.id);
    });
    if (row.parentId) {
      let parentNode = this.getNode(row.parentId);
      parentNode.childIds = parentNode.childIds.filter(
        (c: any) => c !== row.id
      );
    }
  }

  getIdsToBeRemoved(node: any) {
    if (node.childIds.length > 0) {
      this.idsToBeRemoved.push(...node.childIds);
      for (let i = 0; i < node.childIds.length; i++) {
        let subNode = this.getNode(node.childIds[i]);
        this.getIdsToBeRemoved(subNode);
      }
    }
  }

  getNode(id: any) {
    return id
      ? this.helperService.findObjectInArrayByKey(this.rows, "id", id)
      : null;
  }

  onTreeAction(row: any) {
    if (row.childIds && row.childIds.length > 0) {
      if (row.treeStatus === "collapsed") {
        row.treeStatus = "expanded";
      } else {
        row.treeStatus = "collapsed";
      }
      this.rows = [...this.rows];
      // setTimeout(() => {
      //   this.rows = [...this.rows];
      // }, 10);
      /*if (row.treeStatus === 'collapsed') {
        row.treeStatus = 'expanded';
      } else {
        row.treeStatus = 'collapsed';
      }*/
    }
  }

  async clickHandler(template: any) {
    await this.getTableInfo(template.id);
    if (this.selectedTemplate) {
      let folderStructureKey = this.getFolderStructureKey();
      if (folderStructureKey) {
        this.rows = JSON.parse(this.selectedTemplate[folderStructureKey]);
      }
      this.findRowCount();
    }
  }

  async getTableInfo(id: any) {
    await this.templatesService
      .getTemplate(id)
      .toPromise()
      .then((resp: any) => {
        this.selectedTemplate = resp.entity;
      })
      .catch((error: any) => {
        this.selectedTemplate = null;
      });
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  getFolderStructureKey() {
    let folderStructureKey = "";
    if (this.type === "show") {
      folderStructureKey = "showFolderStructure";
    } else if (this.type === "shot") {
      folderStructureKey = "shotFolderStructure";
    } else if (this.type === "pack") {
      folderStructureKey = "packageFolderStructure";
    }
    return folderStructureKey;
  }

  async saveHandler() {
    let selectedTemplateCopy = JSON.parse(
      JSON.stringify(this.selectedTemplate)
    );
    let folderStructureKey = this.getFolderStructureKey();
    if (folderStructureKey) {
      selectedTemplateCopy[folderStructureKey] = JSON.stringify(this.rows);
      let successMessage = AppConstants.TEMPLATE_MODIFICATION_SUCCESS;
      let errorMessage = AppConstants.TEMPLATE_MODIFICATION_ERROR;
      let isSuccess = false;
      await this.templatesService
        .updateTemplate(selectedTemplateCopy)
        .toPromise()
        .then((resp: any) => {
          isSuccess = true;
          this.showNotification({
            type: "success",
            title: "Success",
            content: successMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        })
        .catch((error: any) => {
          this.showNotification({
            type: "error",
            title: "Error",
            content: errorMessage,
            duration: AppConstants.NOTIFICATION_DURATION,
          });
        });
      if (isSuccess) {
      } else {
        this.clickHandler(this.selectedTemplate);
      }
    }
  }

  async getPackingTypes() {
    await this.templatesService
      .getPackingTypes()
      .toPromise()
      .then((resp: any) => {
        this.packingTypes = resp.entity;
      })
      .catch((error: any) => {
        this.packingTypes = null;
      });
  }

  async getPackingAttributes() {
    await this.templatesService
      .getPackingAttributes()
      .toPromise()
      .then((resp: any) => {
        this.packingAttributes = resp.entity;
      })
      .catch((error: any) => {
        this.packingAttributes = null;
      });
  }
}
