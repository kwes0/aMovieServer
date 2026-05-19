//IMPORTS first
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

//The function to check for auth and authorization

//We read the token from the request and check if the token is valid.
const authMiddleware = async (req, res, next) => {
  // console.log("RADA, unaniamsha.")

  //Declare a token to be assigned from the req.header
  let token;
  // Assign the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    //Alternative by grabbing from the cookie
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401).json({ error: "Cheza na login kwanza. Hii ni mali mze" });
  }

  try {
    //Verify the token and get the userId from the token
    const grabToken = jwt.verify(token, process.env.JWT_SECRET); //Using jwt, we can verify and decode the token.
    //Get the user using the grabbed token from prisma
    const user = prisma.user.findUnique({
      where: {
        id: grabToken.id,
      },
    });

    if(!user){
      res.status(401).json({error: "Wacha kunipima mze"})
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token verification failed" });
  }
};

export { authMiddleware };
