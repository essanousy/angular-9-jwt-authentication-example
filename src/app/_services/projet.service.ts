import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Projet } from '@app/_models/projet';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Projet[]>(`${environment.apiUrl}/projets`);
  }

}
