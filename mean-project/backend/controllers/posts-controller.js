// Import post model
const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  // get main server url
  const url = req.protocol + "://" + req.get("host");
  // Create a new mongoose model for the post
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  // save post to database
  post
    .save()
    // Get teh returned post with the generated id
    // and send the id back in the response so it can be set
    // in the frontend
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  // Query parameters for pagination
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  // if query parameters present, adjust the database query
  if (pageSize && currentPage) {
    postQuery
      // skip previous pages
      .skip(pageSize * (currentPage - 1))
      // limit returned pages to page size
      .limit(pageSize);
  }
  // Return all entries in the mongo collection for the Post model
  postQuery
    .then((documents) => {
      // get teh documents then query the number of posts
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      // Return posts and their count
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((errors) => {
      res.status(500).json({
        message: "Failed to retrieve posts!",
      });
    });
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post not found!",
        });
      }
    })
    .catch((errors) => {
      res.status(500).json({
        message: "Failed to retrieve posts!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  // If request includes imge as a file set image path to this instead
  if (req.file) {
    // get main server url
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne(
    // Only update the post if the id matches
    // and it was created by the user making this request
    { _id: req.params.id, creator: req.userData.userId },
    post
  )
    .then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Post Updated!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      // If the number of items modified is greater than 0
      if (result.n > 0) {
        res.status(200).json({
          message: "Post Deleted!",
        });
      } else {
        res.status(401).json({
          message: "Not Authorized",
        });
      }
    })
    .catch((errors) => {
      res.status(500).json({
        message: "Failed to delete post!",
      });
    });
};
