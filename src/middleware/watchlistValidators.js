const validateWatchlistItem = (schema) => {
  return (req, res, next) => {
    //parse the body to the schema for checks
    const results = schema.safeParse(req.body);
    //Check if there is no success parse and handle the errors
    if (!results.success) {
      //We handle the errors by flattening and mapping them one after the other.
      const errorFormatted = results.error.format();

      const flatErrors = Object.values(errorFormatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return res.status(400).json({ message: flatErrors.join(", ") });
    }
    next();
  };
};

export { validateWatchlistItem };
