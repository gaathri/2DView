import { Injectable } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { environment } from "src/environments/environment";
import { HttpService } from "../../core/services/http.service";
import { LoggerService } from "../../core/services/logger.service";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  /** Variables declarations - START */
  private apiUrl = environment.apiUrl;
  private apiUrlLocal = environment.apiUrlLocal;
  isLocal = environment.isLocal;
  /** Variables declarations - END */

  constructor(private http: HttpService, private logger: LoggerService) {}

  getReportTypes() {
    let endPoint = this.apiUrl + AppConstants.REPORT_TYPE_LIST;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "report-type-list";
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getDaterange(id: any) {
    let endPoint = this.apiUrl + AppConstants.REPORT_DATE_RANGE + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "report-date-range";
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getReportKPI(reportTypeId: any, params: any) {
    let endPoint = this.apiUrl + AppConstants.REPORT_KPI + "/" + reportTypeId;
    if (params) {
      endPoint += "?" + params;
    }
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "report-kpi";
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  downloadReportKPI(reportTypeId: any, params: any) {
    let endPoint = this.apiUrl + "report/downloadAsxls/" + reportTypeId;
    if (params) {
      endPoint += "?" + params;
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint, {
      responseType: "blob",
      observe: "response",
    });
    //return this.http.get<any>(endPoint);
  }

  getReportData(reportTypeId: any, dateRangeTypeId: any, params: any) {
    let endPoint =
      this.apiUrl +
      AppConstants.REPORT_DATA +
      "/" +
      reportTypeId +
      "/" +
      dateRangeTypeId;
    if (params) {
      endPoint += "?" + params;
    }
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "report-kpi";
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  downloadReportData(reportTypeId: any, dateRangeTypeId: any, params: any) {
    let endPoint = this.apiUrl + "report/downloadAsxls/" + reportTypeId;

    if (params) {
      endPoint += "?" + params;
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint, {
      responseType: "blob",
      observe: "response",
    });
  }

  /** Report template CRUD APIs - START */
  createReportTemplate(reportTemplateIn: any) {
    const endPoint = this.apiUrl + AppConstants.REPORT_TEMPLATE;
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.post<any>(endPoint, reportTemplateIn);
  }

  getReportTemplate(id: any) {
    let endPoint = this.apiUrl + AppConstants.REPORT_TEMPLATE + "/" + id;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "reportTemplate";
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  getReportTemplateList(page: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint =
      this.apiUrl + AppConstants.REPORT_TEMPLATE + "/list?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "reportTemplateList";
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  updateReportTemplate(reportTemplateIn: any) {
    const endPoint =
      this.apiUrl + AppConstants.REPORT_TEMPLATE + "/" + reportTemplateIn.id;
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, reportTemplateIn);
  }

  deleteReportTemplate(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.REPORT_TEMPLATE + "/" + id + "/delete";
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.put<any>(endPoint, null);
  }
  /** Report template CRUD APIs - END */

  getReportInstanceList(page: any, id: any) {
    let params = ``;
    if (page) {
      params += `search=${page.search}&pageNo=${page.pageNumber}&pageSize=${page.size}&sortBy=${page.sortBy}&orderBy=${page.orderBy}`;
    }
    let endPoint =
      this.apiUrl + AppConstants.REPORT_INSTANCE + "/list/" + id + "?" + params;
    if (this.isLocal) {
      endPoint = this.apiUrlLocal + "reportInstanceList";
    }
    this.logger.log("ReportService Calling endpoint " + endPoint);
    return this.http.get<any>(endPoint);
  }

  downloadReport(id: any) {
    const endPoint =
      this.apiUrl + AppConstants.REPORT_INSTANCE + "/downloadAsxls/" + id;
    this.logger.log("ReportService Calling endpoint " + endPoint);
    //return this.http.get<any>(endPoint);
    return this.http.get<any>(endPoint, {
      responseType: "blob",
      observe: "response",
    });
  }
}
