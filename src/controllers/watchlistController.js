import { prisma } from "../config/db.js"; //This is how I will connect to prisma client and do a check of our db

const addToWatchlist = async (req, res) => {
  //What do we need to add a movie to the watchlist?
  const { movieId, status, rating, notes, userId } = req.body;

  //Check if the movie is in the db
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  //Checking if the movie is in the user's watchlist already - With this there is also some changes in the prisma schema. @@unique() - This is defines that the watchlistItems can't have a similar movieId and userIf
  const existingInWatchlist = await prisma.watchListItem.findUnique(
    //What defines a watchlist item? - movieId and userId
    {
      where: {
        movieId_userId: {
          //This is brought about by the unique schema change we made.
          userId: userId, //We will include middlewares to map this.
          movieId: movieId,
        },
      },
    },
  );

  if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie is already in the watchlist" });
  }

  // Now we add something to the watchlist
  const watchlistItem = await prisma.watchListItem.create({
    data: {
      userId,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
      //When creating we can pass items straight from the body or handle alternatives as it is in status.
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      watchlistItem,
    },
  });
};

export { addToWatchlist };
