import db from "../../config.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usersCollection = db.collection("users");

function hashPassword(password) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
function compareHash(hash, password) {
  //console.log(hash, password);
  return bcrypt.compareSync(password, hash);
}
export function generateAccessToken(username) {
  //console.log(process.env.TOKEN_SECRET);
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "7d" });
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(
    token.replace('"', "").replace('"', ""),
    process.env.TOKEN_SECRET,
    (err, user) => {
      //console.log(err);
      if (err) return res.sendStatus(403);

      req.user = user;

      next();
    }
  );
}

export const loginUser = async (username, password) => {
  const result = await usersCollection.findOne({ username: username });
  if (result === null) {
    return false;
  }
  const hash = await result.password;
  if (compareHash(await hash, password)) {
    return result.jwt;
  } else {
    return false;
  }
};

export const createNewUser = async (userData, file) => {
  const result = await usersCollection.insertOne({
    username: userData.username,
    password: hashPassword(userData.password),
    timestamp: new Date(),
    jwt: generateAccessToken({ username: userData.username }),
    country: userData.country,
    profilePicture: `${file.destination.replace("./", "")}/${file.filename}`,
  });
  return { msg: "User created" };
};
