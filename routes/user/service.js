import db from "../../config.js";
import user from "./route.js";

const users = db.collection("users");
const posts = db.collection("posts");
const comments = db.collection("comments");
export async function getUserData(username) {
  const result = await users.findOne({ username: username }, { username: 1 });
  const userPosts = await posts.find({ postAuthor: username });
  delete result.password;
  delete result.jwt;
  let userCreatedPosts = [];

  for await (const doc of userPosts) {
    userCreatedPosts.push(doc);
  }
  const userData = {
    username: result.username,
    timestamp: result.timestamp,
    profilePicture: result.profilePicture,
    posts: userCreatedPosts,
    country: result.country,
  };

  return userData;
}
export const getUserComments = async (username) => {
  const result = comments.find({ author: username });
  let userComments = [];
  for await (const comment of result) {
    userComments.push(comment);
  }
  return userComments;
};
