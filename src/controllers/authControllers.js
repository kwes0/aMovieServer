const register = (req, res) => {
  const { name, email, password } = req.body;
//We can do the validation here
//1. All inputs fields are put
//2. All inputs are valid (email format, password strength, etc.)
//3. Check if user exist in the database - email should be unique
//4. Hash the password before saving to the database
//5. Save the user to the database
//6. Return a response to the client (success or error)
};

export { register };
