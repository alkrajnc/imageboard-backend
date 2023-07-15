import { ObjectId } from "mongodb";
import db from "../../config.js";
const posts = db.collection("posts");
const comments = db.collection("comments");
export const getAllPosts = async (sort) => {
  //console.log(sort);
  const result = posts.find();
  if (sort === "latest") {
    result.sort({ postTimestamp: -1 });
    if (result) {
      let docs = [];
      for await (const doc of result) {
        docs.push(doc);
      }
      return docs;
    }
  } else if (sort === "oldest") {
    if (result) {
      let docs = [];
      for await (const doc of result) {
        docs.push(doc);
      }
      return docs;
    }
  } else if (sort === "top") {
    result.sort({ postVotes: -1 });
  }
  if (result) {
    let docs = [];
    for await (const doc of result) {
      docs.push(doc);
    }
    return docs;
  }
};
export const createNewPost = async (postData, image) => {
  //console.log(postData);`
  const doc = {
    postTitle: postData.postTitle,
    postAuthor: postData.postAuthor,
    postVotes: Number(postData.postVotes),
    postTimestamp: postData.postTimestamp,
    postComments: [],
    postImage: `${image.destination.replace("./", "")}/${image.filename}`,
  };
  console.log(doc);
  const result = await posts.insertOne(doc);
};
export const changeVote = async (postId, operation) => {
  const filter = { _id: new ObjectId(postId) };
  if (operation === "plus") {
    const updateDoc = {
      $inc: { postVotes: 1 },
    };
    const result = await posts.updateOne(filter, updateDoc);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } else {
    const updateDoc = {
      $inc: { postVotes: -1 },
    };
    const result = await posts.updateOne(filter, updateDoc);
  }
  const result = await posts.findOne(filter);
  if (result.postVotes < -10) {
    const deleteResult = await posts.deleteOne(filter);
  }
};
export const deleteall = async () => {
  const result = await posts.deleteMany({});
};
export const addComment = async (postId, comment) => {
  comment.postId = postId;
  const result = comments.insertOne(comment);
};
export const changeCommentVote = async (postId, commentId, operation) => {
  const filter = { _id: new ObjectId(postId) };
  if (operation === "plus") {
    const updateDoc = {
      $inc: { [`postComments[${commentId}]`]: 1 },
    };
    const result = await posts.updateOne(filter, updateDoc);
    console.log(result);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } else {
    const updateDoc = {
      $inc: { postVotes: -1 },
    };
    const result = await posts.updateOne(filter, updateDoc);
  }
  const result = await posts.findOne(filter);
  if (result.postVotes < -10) {
    const deleteResult = await posts.deleteOne(filter);
  }
};
export const getCommentsOnPost = async (postId) => {
  const filter = { postId: postId };
  const results = comments.find(filter);
  let docs = [];
  for await (const doc of results) {
    docs.push(doc);
  }
  return docs;
};
export const getPost = async (postId) => {
  const result = await posts.findOne({ _id: new ObjectId(postId) });
  return result;
};
