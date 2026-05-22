import { z } from "zod";

const addToWatchlistSchema = z.object({
  movieId: z.string().uuid(),
  status: z
    .enum(["PLANNED", "WATCHING", "COMPLETED"], {
      error: () => ({
        message: "Input should be either: PLANNED, WATCHING or COMPLETED",
      }),
    })
    .optional(),
  rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10")
    .optional(),

  notes: z.string().optional(),
});

const updateWatchlistSchema = z.object({
  status: z
    .enum(["PLANNED", "WATCHING", "COMPLETED"], {
      error: () => ({
        message: "Input should be either: PLANNED, WATCHING or COMPLETED",
      }),
    })
    .optional(),
  rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 10")
    .max(10, "Rating must be between 1 and 10")
    .optional(),

  notes: z.string().optional(),
});

export { addToWatchlistSchema, updateWatchlistSchema };
