import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feedback } from '@app/_models/Feedback';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Feedback[]>(`${environment.apiUrl}/feedbacks`);
  }

  getFeedbacksByProjetId(projetId: number) {
    console.log(`${environment.apiUrl}/feedbacks/${projetId}`);

    return this.http.get<Feedback[]>(`${environment.apiUrl}/feedbacks/${projetId}`);
  }

}
