import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";

import useFetch from "@/services/useFetch";
import { fetchBookmarkedMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import MovieCard from "@/components/MovieCard";

const Saved = () => {
  const router = useRouter();

  const {
    data: bookmarkedMovies,
    loading,
    error,
  } = useFetch(fetchBookmarkedMovies);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : error ? (
          <Text className="text-white text-center mt-10">
            Error: {error.message}
          </Text>
        ) : !bookmarkedMovies || bookmarkedMovies.length === 0 ? (
          <Text className="text-white text-center mt-10">
            No bookmarked movies found.
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <Text className="text-lg text-white font-bold mb-3">
              Bookmarked Movies
            </Text>

            <FlatList
              data={bookmarkedMovies}
              renderItem={({ item }) => (
                <MovieCard
                  id={item.movie_id}
                  title={item.title}
                  poster_path={item.poster_url}
                  popularity={0}
                  release_date=""
                  vote_average={0}
                  vote_count={0}
                />
              )}
              keyExtractor={(item) => item.movie_id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Saved;