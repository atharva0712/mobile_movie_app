// track the searches made by the user

import { Client, Databases, Query, ID } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_METRICS_ID!;
const COLLECTION_BOOKMARKED_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_BOOKMARKED_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);
export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal("searchTerm", query),
          ]);
        
          if (result.documents.length > 0) {
            const existingMovies = result.documents[0];
        
            await database.updateDocument(
              DATABASE_ID,
              COLLECTION_ID,
              existingMovies.$id,
              {
                count: existingMovies.count + 1,
              }
            );
          } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
              searchTerm: query,
              count: 1,
              title: movie.title,
              movie_id: movie.id,
              poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
          }

    }catch (error) {
        console.log(error);
        throw error;
    }
  
  // check if a record of that seach is already in the database
  // if the document exists, update the count (increment)
  // if the document doesn't exist, create a new one in appwrite
};

export const getTrendingMovies = async () : Promise <TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
          ]);

          return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const toggleBookmark = async (movie: Movie, isBookmarked: boolean) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_BOOKMARKED_ID, [
      Query.equal("movie_id", movie.id),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_BOOKMARKED_ID,
        existingMovie.$id,
        { isBookmarked: !isBookmarked }
      );
      console.log(`${movie.title} is ${!isBookmarked ? "bookmarked" : "removed from bookmarks"}`);
    } else {
      await database.createDocument(DATABASE_ID,COLLECTION_BOOKMARKED_ID, ID.unique(), {
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        isBookmarked: true,
      });
      console.log(`${movie.title} is bookmarked`);
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
};

export const fetchBookmarkedMovies = async (): Promise<BookmarkedMovie[]> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_BOOKMARKED_ID, [
      Query.equal("isBookmarked", true), 
    ]);
    return result.documents as unknown as BookmarkedMovie[];
  } catch (error) {
    console.error("Error fetching bookmarked movies:", error);
    throw error;
  }
};

export const checkIfBookmarked = async (movieId: string): Promise<boolean> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_BOOKMARKED_ID, [
      Query.equal("movie_id", parseInt(movieId, 10)), 
    ]);
    return result.documents.length > 0 && result.documents[0].isBookmarked;
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false; 
  }
};
