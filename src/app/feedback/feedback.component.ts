import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from '@app/_models/Feedback';
import { Projet } from '@app/_models/projet';
import { FeedbackService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({ templateUrl: './Feedback.component.html' })
export class FeedbackComponent implements OnInit {
  loading = false;
  feedbacks: Feedback[];
  projet: Projet;
  projetId: number;
  constructor(private feedbackService: FeedbackService, private avRoute: ActivatedRoute) {
    const idParam = 'id';

    if (this.avRoute.snapshot.params[idParam]) {
      this.projetId = this.avRoute.snapshot.params[idParam];
    }
    console.log(`this is the projet id passed${this.projetId}`);
  }

  ngOnInit() {
    this.loading = true;
    this.feedbackService.getFeedbacksByProjetId(this.projetId).pipe(first()).subscribe(feed => {
      console.log(`this is the projet id passed${this.projetId}`);
      this.loading = false;
      this.feedbacks = feed;
      console.table(feed);
      console.table(this.feedbacks);
    });

  }






}
