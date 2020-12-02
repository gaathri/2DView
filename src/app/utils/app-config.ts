import { HttpClientModule, HttpClient } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { of, Observable, ObservableInput } from "rxjs";
import { ConfigService } from "../config.service";

export function configinit(
  http: HttpClient,
  config: ConfigService
): () => Promise<boolean> {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
      http
        .get("assets/config.json")
        .pipe(
          map((x: ConfigService) => {
            config.apiUrl = x.apiUrl;
            resolve(true);
          }),
          catchError(
            (
              x: { status: number },
              caught: Observable<void>
            ): ObservableInput<{}> => {
              if (x.status !== 404) {
                resolve(false);
              }
              config.apiUrl = "http://localhost:8080/portal/api/";
              resolve(true);
              return of({});
            }
          )
        )
        .subscribe();
    });
  };
}
