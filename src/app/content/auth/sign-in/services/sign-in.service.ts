import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignInService {
  private GET_LOGIN = environment.apiUrl;

  constructor(
    private httpService: HttpClient
  ) { }

  login(obj: object): any {
    return this.httpService.post<any>(`${this.GET_LOGIN}/login/`, obj);

  }
}
