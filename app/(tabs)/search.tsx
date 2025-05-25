import MovieCard from "@/components/MovieCard";
import { images } from "@/constants/images";
import React, { Component, useEffect, useState } from "react";
import { Text, View, Image, FlatList, ActivityIndicator } from "react-native";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { updateSearchCount } from "@/services/appwrite";
const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies(); // Fetch movies if the search query is not empty

      } else {
        reset(); // Clear the movies if the search query is empty
      }
    }, 500);
  
    return () => clearTimeout(timeoutId); // Clear the timeout on unmount or query change
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.[0] && movies?.length > 0) {
      updateSearchCount(searchQuery, movies[0]);
    }
  },[movies]);

  return (
    <View className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute 
        w-full z-0 flex-1"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        className="px-5"
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className="flex-row justify-center w-full mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search..."
                value={searchQuery}
                onChangeText={(text : string) => {
                  setSearchQuery(text);
                }}
                onPress={() => {}}
              />
            </View>
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3" />
            )}
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}
            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-white font-bold text-xl">
                Search Results for {''}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? 'No movies found' : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
