import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  //We can do the validation here
  //1. All inputs fields are put
  const missingInputs = [];
  if (!username) missingInputs.push("username");
  if (!email) missingInputs.push("email");
  if (!password) missingInputs.push("password");
  if (missingInputs.length > 0) {
    return res.status(400).json({
      message: `Missing the following fields: ${missingInputs.join(", ")}`,
    });
  }
  //2. All inputs are valid (email format, password strength, etc.)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 12) {
    return res
      .status(400)
      .json({ error: "Too short a password, make it 12 or more" });
  }
  //3. Check if user exist in the database - email should be unique
  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    //4. Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10); //Generate a salt with 10 rounds
    const hashedPswd = await bcrypt.hash(password, salt);

    const token = generateToken(userExists.id);

    //5. Save the user to the database

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPswd,
      },
    });

    //6. Return a response to the client (success or error)
    res.status(201).json({
      status: "success",
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    console.log("FULL ERROR", JSON.stringify(error, null, 2)); //Log the full error object for debugging. The null, 2 params make the output more readable.
    res.status(500).json({ error: "Error creating user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  //1. Validate both are provided
  const missingInputs = [];
  if (!email) missingInputs.push("email");
  if (!password) missingInputs.push("password");
  if (missingInputs.length > 0) {
    return res.status(400).json({
      message: `Missing the following fields: ${missingInputs.join(", ")}`,
    });
  }
  //2. All inputs are valid (email format, password strength, etc.)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (password.length < 12) {
    return res.status(400).json({ error: "Too short to be the password" });
  }
  //3. Check if user in the database, if not suggest register - check against email
  //3. If user exist, compare the password with the hashed password in the database using bcrypt.compare
  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (!userExists) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    //5. If password does not match, return an error message
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    //4. If password match, generate a JWT token and return to the client
    const token = generateToken(userExists.id);
    //5. Return a response to the client

    res.status(201).json({
      status: "success",
      data: {
        userId: userExists.id,
        email: userExists.email,
      },
      token: token,
    });
  } catch (error) {
    console.log("FULL ERROR", JSON.stringify(error, null, 2)); //Log the full error object for debugging. The null, 2 params make the output more readable.
    res.status(500).json({ error: "Error creating user" });
  }
};

export { register, login };
