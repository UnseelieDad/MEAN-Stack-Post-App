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
  
  private postsSub: Subscription;
  posts: Post[] = [];
  isLoading = false;

  constructor(private postsService: PostsService) {}

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnInit() {
    // Start loading spinner
    this.isLoading = true;
    // Get the current list of posts
    this.postsService.getPosts();
    // get new posts from the service wheneer one is added
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        // stop loading spinner
        this.isLoading = false;
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    // Remove subscription  on teardown to prevent memory leaks
    this.postsSub.unsubscribe();
  }
}
