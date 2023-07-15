import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
const uri =
  "mongodb+srv://megalodon4k:geslo-database-mongo@cluster0.bnld4xm.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
await client.connect();

const mainDb = client.db("social");
const postsCollections = mainDb.collection("posts");

export const getAllPosts = async (sort) => {
  //console.log(sort);
  const result = postsCollections.find();
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
  const result = await postsCollections.insertOne(doc);
};
export const changeVote = async (postId, operation) => {
  const filter = { _id: new ObjectId(postId) };
  if (operation === "plus") {
    const updateDoc = {
      $inc: { postVotes: 1 },
    };
    const result = await postsCollections.updateOne(filter, updateDoc);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } else {
    const updateDoc = {
      $inc: { postVotes: -1 },
    };
    const result = await postsCollections.updateOne(filter, updateDoc);
  }
  const result = await postsCollections.findOne(filter);
  if (result.postVotes < -10) {
    const deleteResult = await postsCollections.deleteOne(filter);
  }
};
export const deleteall = async () => {
  const result = await postsCollections.deleteMany({});
};
export const addComment = async (postId, comment) => {
  const filter = { _id: new ObjectId(postId) };
  comment._id = new ObjectId();
  const updateDoc = {
    $push: { postComments: comment },
  };
  const result = await postsCollections.updateOne(filter, updateDoc);
  console.log(
    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
  );
};
export const changeCommentVote = async (postId, commentId, operation) => {
  const filter = { _id: new ObjectId(postId) };
  if (operation === "plus") {
    const updateDoc = {
      $inc: { [`postComments[${commentId}]`]: 1 },
    };
    const result = await postsCollections.updateOne(filter, updateDoc);
    console.log(result);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } else {
    const updateDoc = {
      $inc: { postVotes: -1 },
    };
    const result = await postsCollections.updateOne(filter, updateDoc);
  }
  const result = await postsCollections.findOne(filter);
  if (result.postVotes < -10) {
    const deleteResult = await postsCollections.deleteOne(filter);
  }
};
