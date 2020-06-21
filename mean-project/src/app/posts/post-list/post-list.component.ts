import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  private postsSub: Subscription;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  constructor(private postsService: PostsService) {}

  // Delete a post
  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  // Change pages in the paginator
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnInit() {
    // Start loading spinner
    this.isLoading = true;
    // Get the current list of posts
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
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
