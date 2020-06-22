import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, subscribeOn } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  // Get the current list of posts from the server
  getPosts(postsPerPage: number, currentPage: number) {
    // query parameters for pagination
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      // Use pipe to execute the map operator on the observable from the backend
      // so that _id is formated as id
      .pipe(
        map((postData) => {
          // for each post in postData, return a properly formated post and the new number of posts
          return {
            posts: postData.posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((formatedPostData) => {
        this.posts = formatedPostData.posts;
        // update subject with new posts and the new number of posts
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: formatedPostData.maxPosts,
        });
      });
  }

  // Get a post by its id
  getPostById(id: string) {
    // Can only return the observable here,
    // the rest is handled in post-create component
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  // return the postsUpdated subject for subscribing
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // Add a post to the list of posts
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    // Use the submitted image and the title as its name
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  // Update a post after editing
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      // image is a File, update using a form
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', title);
      postData.append('image', image, title);
    } else {
      // image is a string, update it as an object
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null,
      };
    }

    this.http
      .patch('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        // Don't need to update here or in post because the user is
        // navigated back to the main page which fires off a get request on init
        this.router.navigate(['/']);
      });
  }

  // Delete a post
  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
