import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const MovieCard = ({
  id,
  title,
  poster_path,
  vote_average = 0,
  release_date,
}: Movie) => {
  return (
    <View style={{ width: "30%" }}>
      <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity>
          {" "}
          {/* Remove flex-1 */}
          <Image
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://placeholder.com/600x400/1a1a1a/ffffff.png",
            }}
            style={{
              width: "100%", // Make the image take the full width of the card
              aspectRatio: 2 / 3, // Maintain a consistent 2:3 aspect ratio
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 11,
              fontWeight: "bold",
              color: "white",
              marginTop: 5,
            }}
            numberOfLines={1} 
          >
            {title}
          </Text>
          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text style={{ fontSize: 10, color: "white" }}>
              {Math.round(vote_average / 2)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-300 font-medium mt-1">
              {release_date.split("-")[0]}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default MovieCard;
