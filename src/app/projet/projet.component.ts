import { Component, OnInit } from '@angular/core';
import { Projet } from '@app/_models/projet';
import { ProjetService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({ templateUrl: './projet.component.html' })
export class ProjetComponent implements OnInit {
  loading = false;
  projets: Projet[];

  constructor(private projetService: ProjetService) { }

  ngOnInit() {
    this.loading = true;
    this.projetService.getAll().pipe(first()).subscribe(projets => {
      this.loading = false;
      this.projets = projets;
    });
  }

  onDelete(id) {
    const ans = confirm('Do you want to delete blog post with id: ' + id);
    // if (ans) {
    //   this.blogPostService.deleteBlogPost(postId).subscribe((data) => {
    //     this.loadBlogPosts();
    //   });
    // }
    //}
  }




}
