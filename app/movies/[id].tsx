import { View, Text, ScrollView, Image, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { icons } from "@/constants/icons";
import { toggleBookmark, checkIfBookmarked } from "@/services/appwrite";

interface MovieInfoProps {
  label: string;
  value: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="items-start flex-col justify-center mt-5">
    <Text className="text-gray-200 font-normal text-sm">{label}</Text>

    <Text className="text-light-100 text-sm font-bold mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const bookmarked = await checkIfBookmarked(id as string);
      setIsBookmarked(bookmarked);
    };
    fetchBookmarkStatus();
  }, [id]);

  const handleBookmarkToggle = async () => {
    if (movie) {
      await toggleBookmark(movie, isBookmarked);
      const newStatus = !isBookmarked;

      setIsBookmarked(newStatus);
      const statusMessage = newStatus
        ? "Added to Bookmarks"
        : "Removed from Bookmarks";

      setMessage(statusMessage);

      ToastAndroid.show(statusMessage, ToastAndroid.SHORT);
      
      setTimeout(() => setMessage(null), 2000);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 20 }}
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`,
            }}
            className="w-full h-[500px]"
            resizeMode="stretch"
          />

          <TouchableOpacity
          className="absolute top-5 right-5 z-50"
          onPress={handleBookmarkToggle}
        >
          <Image
            source={icons.save}
            className="size-10"
            tintColor={isBookmarked ? "red" : "white"}
          />
        </TouchableOpacity>

        </View>
        <View className="flex-col justify-center items-start mt-5 px-5">
          <Text className="text-white text-xl font-bold">{movie?.title}</Text>

          <View className="flex-row items-center mt-2 gap-x-1">
            <Text className="text-light-200 text-sm">
              {movie?.release_date.split("-")[0]}
            </Text>

            <Text className="text-light-200 text-sm">{movie?.runtime}min</Text>
          </View>
          <View
            className="flex-row items-center bg-dark-100
            rounded-md px-2 py-1 gap-x-1 mt-2"
          >
            <Image source={icons.star} className="size-4" />
            <Text className="text-white text-sm font-bold">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-sm text-light-200">
              ({movie?.vote_count} votes)
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview} />

          <MovieInfo
            label="Genres"
            value={movie?.genres.map((g) => g.name).join(" - ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${movie?.budget / 1000000} mill`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(movie?.revenue / 1000000)} mill`}
            />
          </View>
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies.map((c) => c.name).join(" - ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>
      
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0
       bg-accent mx-5 rounded-lg py-3.5 flex flex-row justify-center items-center z-50"
       onPress={router.back}
      >
        <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor='#fff'/>
        <Text className="text-white text-base font-semibold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
