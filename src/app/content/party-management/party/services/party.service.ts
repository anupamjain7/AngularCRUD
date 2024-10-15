import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  private GET_PARTY = environment.apiUrl;

  constructor(private httpService: HttpClient) {}
  private getHttpOptions() {
    const token = localStorage.getItem('greatfuture');
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return { headers };
  }
  getParty(): any {
    return this.httpService.get<any>(
      `${this.GET_PARTY}/party/`,
      this.getHttpOptions()
    );
  }

  deleteParty(id: number): any {
    return this.httpService.delete(
      `${this.GET_PARTY}/party/?id=${id}`,
      this.getHttpOptions()
    );
  }

  postParty(formData: FormData): any {
    return this.httpService.post(
      `${this.GET_PARTY}/party/`,
      formData,
      this.getHttpOptions()
    );
  }

  getPartyById(id: any): any {
    return this.httpService.get(
      `${this.GET_PARTY}/party/?id=${id}`,
      this.getHttpOptions()
    );
  }
  updateParty(id: any, formData: FormData): any {
    return this.httpService.put(
      `${this.GET_PARTY}/party/?id=${id}`,
      formData,
      this.getHttpOptions()
    );
  }
}
