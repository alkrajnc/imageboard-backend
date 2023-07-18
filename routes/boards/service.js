import db from "../../config.js";

export async function getBoards() {
  const boards = db.collection("boards").find();
  const docs = [];
  for await (const board of boards) {
    docs.push(board);
  }
  return docs;
}
