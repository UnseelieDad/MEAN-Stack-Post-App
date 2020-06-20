import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content.'},
  //   {title: 'Second Post', content: 'This is the second post\'s content.'},
  //   {title: 'Third Post', content: 'This is the third post\'s content.'}

  // ];
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    // Get the current list of posts
    this.posts = this.postsService.getPosts();
    // get new posts from the service wheneer one is added
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    // Remove subscription  on teardown to prevent memory leaks
    this.postsSub.unsubscribe();
  }
}
