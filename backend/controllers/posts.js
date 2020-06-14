const fs = require("fs");

const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
      },
    });
  });
};

exports.getPosts = (req, res, next) => {
  const pageSize = Number.parseInt(req.query.pagesSize);
  const currentPage = Number.parseInt(req.query.page);
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Post fetched succesfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
};

exports.updadePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
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
    { _id: req.params.id, creator: req.userData.userId },
    post
  ).then((result) => {
    if (result.n > 0) {
      res.status(200).json({ message: "Post Atualizado" });
    } else {
      res
        .status(401)
        .json({ message: "Sem permisão para atualizar este post" });
    }
  });
};

exports.deletePost = (req, res, next) => {
  Post.findOneAndDelete({
    _id: req.params.id,
    creator: req.userData.userId,
  }).then((result) => {
    if (result) {
      res.status(200).json({ message: "Post deletado" });
      fs.unlink(returnImagePath(result.imagePath), (error) => {
        if (error) throw error;
      });
    } else {
      res.status(401).json({ message: "Sem permisão para deletar este post" });
    }
  });
};

function returnImagePath(imagePath) {
  return String(imagePath).replace("http://localhost:3000", "backend");
}
