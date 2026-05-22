import { prisma } from "../config/db.js"; //This is how I will connect to prisma client and do a check of our db

const addToWatchlist = async (req, res) => {
  //What do we need to add a movie to the watchlist?
  const { movieId, status, rating, notes } = req.body;

  //Check if the movie is in the db
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  //Checking if the movie is in the user's watchlist already - With this there is also some changes in the prisma schema. @@unique() - This is defines that the watchlistItems can't have a similar movieId and userIf
  try {
    const existingInWatchlist = await prisma.watchListItem.findUnique(
      //What defines a watchlist item? - movieId and userId
      {
        where: {
          movieId_userId: {
            //This is brought about by the unique schema change we made.
            movieId: movieId,
            userId: req.user.id, //We will include middlewares to map this.
          },
        },
      },
    );

    if (existingInWatchlist) {
      return res
        .status(400)
        .json({ error: "Movie is already in the watchlist" });
    }
  } catch (err) {
    console.error(err);
  }
  // Now we add something to the watchlist
  const watchlistItem = await prisma.watchListItem.create({
    data: {
      userId: req.user.id,
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

const deleteFromWatchlist = async (req, res) => {
  // const movie = req.params.id; //Grabbed the movie from the movie

  //Movie in the user watchlist?
  const existingInWatchlist = await prisma.watchListItem.findUnique({
    where: {
      movieId_userId: {
        movieId: req.params.id,
        userId: req.user.id,
      },
    },
  });

  if (!existingInWatchlist) {
    res.status(404).json({
      error: "Sijui rada ni wicha astapa",
    });
  }
  //If it is, now we delete it by the same compounded item.
  await prisma.watchListItem.delete({
    where: {
      movieId_userId: {
        movieId: req.params.id,
        userId: req.user.id,
      },
    },
  });

  //We respond back
  res.status(200).json({
    status: "success",
    message: "removed from watchlist",
  });
};
//Update the status
const updateStatusOnWatchlist = async (req, res) => {
  const { status, rating, notes } = req.body;
  //User watchlist has the movie
  const existingInWatchlist = await prisma.watchListItem.findUnique({
    where: {
      movieId_userId: {
        movieId: req.params.id,
        userId: req.user.id,
      },
    },
  });

  if (!existingInWatchlist) {
    res.status(404).json({ error: "riegenye??" });
  }
  //update the status
  const updatedMovie = await prisma.watchListItem.update({
    where: {
      movieId_userId: {
        movieId: req.params.id,
        userId: req.user.id,
      },
    },
    data: {
      status: status,
      rating: rating,
      notes: notes,
    },
  });
  //Respond to the request
  res.status(201).json({
    status: "success",
    message: "updated status",
    data: updatedMovie,
  });
};

export { addToWatchlist, deleteFromWatchlist, updateStatusOnWatchlist };
