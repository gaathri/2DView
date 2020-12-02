import { Injectable } from "@angular/core";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";

@Injectable({
  providedIn: "root",
})
export class TemplatesService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  /** Template APIs START */

  getTemplate(id: any) {
    let endPoint = this.apiUrl + AppConstants.TEMPLATE + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "episode";
    }
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateTemplate(templateIn: any) {
    const endPoint = this.apiUrl + AppConstants.TEMPLATE + "/" + templateIn.id;
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, templateIn);
  }

  cloneTaskTemplate(templateId: any) {
    const endPoint =
      this.apiUrl + AppConstants.TEMPLATE + "/clone/" + templateId;
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getTemplatesByType(templateId: any) {
    let endPoint = this.apiUrl + AppConstants.TEMPLATE_LIST + "/" + templateId;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "template-list-" + templateId;
    }
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  editTaskTemplateName(templateId: any, templateIn: any) {
    const endPoint =
      this.apiUrl + AppConstants.TEMPLATE + "/inline-edit/" + templateId;
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, templateIn);
  }

  deleteTaskTemplate(templateId: any) {
    const endPoint =
      this.apiUrl + AppConstants.TEMPLATE + "/" + templateId + "/delete";
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  getTaskTemplateTableInfo(id: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.TASK_TEMPLATE_INFO +
      "/" +
      id +
      "?sortBy=taskTypeSequence&dir=DESC";
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "task-template-info";
    }
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  addTaskTypeSequence(templateId: any, taskTypeSequence: any) {
    let endPoint =
      this.apiUrl + AppConstants.ADD_TASK_TYPE_SEQUENCE + "/" + templateId;
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, taskTypeSequence);
  }

  deleteTaskTypeSequence(templateId: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.TASK_TYPE_SEQUENCE +
      "/" +
      templateId +
      "/delete";
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }

  inlineEdit(taskId: any, taskIn: any) {
    const endPoint =
      this.apiUrl + AppConstants.INLINE_EDIT_TASK_TYPE_SEQUENCE + "/" + taskId;
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.patch<any>(endPoint, taskIn);
  }

  getPackingTypes() {
    let endPoint = this.apiUrl + AppConstants.PACKING_TYPES;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "packing-types";
    }
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getPackingAttributes() {
    let endPoint = this.apiUrl + AppConstants.PACKING_ATTRIBUTES;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "packing-attributes";
    }
    this.logger.log("TemplatesService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  /** Template APIs END */

  getMailTypes() {
    let endPoint = this.apiUrl + "mailType";
    return this.http.get<any>(endPoint);
  }

  getMailTypeById(id: any) {
    let endPoint = this.apiUrl + "mailType/" + id;
    return this.http.get<any>(endPoint);
  }

  getMailtemplateById(id: any) {
    //list-by-mailtype
    let endPoint = this.apiUrl + "mailtemplate/list-by-mailtype/" + id;
    return this.http.get<any>(endPoint);
  }

  updateMailTemplate(templateIn: any) {
    //http://localhost:8080/portal/api/mailtemplate/list-by-mailtype/1
    const endPoint = this.apiUrl + "mailtemplate/" + templateIn.id;
    return this.http.put<any>(endPoint, templateIn);
  }
}
