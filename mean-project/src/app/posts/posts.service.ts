import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, subscribeOn } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  // Get the current list of posts from the server
  getPosts(postsPerPage: number, currentPage: number) {
    // query parameters for pagination
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts' + queryParams)
    // Use pipe to execute the map operator on the observable from the backend
    // so that _id is formated as id
    .pipe(map(postData => {
      // for each post in postData, return a properly formated post
      return postData.posts.map(post => {
        return {
          id: post._id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((formatedPosts) => {
        this.posts = formatedPosts;
        // update subject with new posts
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Get a post by its id
  getPostById(id: string) {
    // Can only return the observable here,
    // the rest is handled in post-create component
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
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
      .post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title,
          content,
          imagePath: responseData.post.imagePath
        };
        // Only update posts locally if successfully added to the server
        this.posts.push(post);
        this.updateAndReturn();
      });
  }

  // Update a post after editing
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
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
        imagePath: image
      };
    }

    this.http.patch('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        // If updaing on the backend is successful, update the post by its index
        // in the frontend array.
        const updatedPosts = [...this.posts];
        const oldPostInex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imagePath: ''
        }
        updatedPosts[oldPostInex] = post;
        this.posts = updatedPosts;
        this.updateAndReturn();
      });
  }

  // Delete a post
  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        // Keep all posts but the one with the deleted id
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
    });
  }

  // Helper method that updates the posts on the frontend
  // and navigates user back to the posts page
  updateAndReturn() {
    // Let other components know that the posts array was updated
    this.postsUpdated.next([...this.posts]);
    // Navigate back to the main page
    this.router.navigate(['/']);
  }
}
