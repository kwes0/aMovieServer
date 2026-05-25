import { prisma } from "../config/db.js";

const allMovies = async (req, res) => {
  const movies = await prisma.movie.findMany();
  if (movies.length < 1 || !movies) {
    return res.status(404).json({ message: "No movie found" });
  }
  res.status(200).json({
    status: "success",
    data: {
      movies,
    },
  });
};
const addMovie = async (req, res) => {
  const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

  try {
    const createMovie = await prisma.movie.create({
      data: {
        createdBy: req.user.id,
        title,
        overview,
        releaseYear,
        genres,
        runtime,
        posterUrl,
      },
    });
    res.status(201).json({
      status: "success",
      data: {
        createMovie,
      },
    });
  } catch (error) {
    console.error("Full error:", error);
    res.status(400).json({ error: "something went wrong." });
  }
};
const getAMovie = async (req, res) => {
  const aMovie = await prisma.movie.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!aMovie) {
    res.status(404).json({
      error: "Hii sijui umetoa wapi?",
    });
  }

  res.status(200).json({
    status: "success",
    data: aMovie,
  });
};

export { addMovie, allMovies, getAMovie };

// model Movie {
//   id             String          @id @default(uuid())
//   title          String
//   overview       String?
//   releaseYear    Int
//   genres         String[]        @default([])
//   runtime        Int?
//   posterUrl      String?
//   createdBy      String
//   createdAt      DateTime        @default(now())
//   creator        User            @relation("MovieCreator", fields: [createdBy], references: [id], onDelete: Cascade)
//   watchListItems WatchListItem[]
// }
