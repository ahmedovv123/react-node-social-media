import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey :D", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const q =
      "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUE (?)";

    const values = [userInfo.id, req.body.followedUserId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("User followed");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey :D", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token!");

    const q =
      "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

    db.query(q, [userInfo.id, req.query.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json("User unfollowed");
    });
  });
};
