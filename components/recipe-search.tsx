"use client"; 

import React, { useState, FormEvent } from "react"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Card, CardContent } from "@/components/ui/card"; 
import Link from "next/link"; 
import { SearchIcon } from "lucide-react"; 
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image"; 

interface Recipe {
  uri: string;
  label: string;
  image: string;
  ingredientLines: string[];
  ingredients: { text: string }[];
  url: string;
}

const examples = [
  "Biryani",
  "Chicken Karahi",
  "Nihari",
  "Haleem",
  "Chapli Kabab",
];

export default function RecipeSearch() {
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSearched(true);
    setRecipes([]);
    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`
      );
      const data = await response.json();
      setRecipes(data.hits.map((hit: { recipe: Recipe }) => hit.recipe));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-gray-900 p-6`}>
      {/* Main content box */}
      <div className="w-full max-w-2xl p-8 rounded-lg shadow-2xl bg-gray-800 border border-gray-700 transition-all hover:border-green-500 hover:shadow-green-500/50">
        <header className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-bold p-0 m-0 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">Recipe Search</h1>
          <p className="text-lg text-gray-600 mb-4">
            Find delicious recipes by ingredients you have at home.
          </p>
          <div className="mb-4">
            <p className="text-gray-500">Try searching for:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {examples.map((example) => (
                <span
                  key={example}
                  className="px-3 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 transition-all duration-200"
                  onClick={() => setQuery(example)}
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
          <form className="relative w-full max-w-md mb-6" onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search by ingredient..."
              className="pr-10 border-gray-300 focus:border-green-500 focus:ring-green-600"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 from-green-500 to-blue-600 hover:text-green-600"
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
          </form>
        </header>
        {loading ? (
          <div className="flex flex-col justify-center items-center w-full h-full">
            <ClipLoader className="w-10 h-10 mb-4" />
            <p className="text-gray-600">Loading recipes, please wait...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searched && recipes.length === 0 && (
              <p className="text-center text-gray-600">No recipes found. Try searching with different ingredients.</p>
            )}
            {recipes.map((recipe) => (
              <Card className="group relative hover:shadow-lg transition-shadow duration-200" key={recipe.uri}>
                <Image
                  src={recipe.image}
                  alt={recipe.label}
                  width={400}
                  height={300}
                  className="rounded-t-lg object-cover w-full h-48 group-hover:opacity-90 transition-opacity"
                />
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{recipe.label}</h2>
                  <p className="text-gray-600 line-clamp-2">
                    {recipe.ingredientLines.join(", ")}
                  </p>
                </CardContent>
                <Link
                  href={recipe.url}
                  className="absolute inset-0 z-10"
                  prefetch={false}
                >
                  <span className="sr-only">View recipe</span>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Footer section */}
      <footer className="mt-4 text-sm text-muted-foreground">
        Created By Ismail Ahmed Shah
      </footer>
    </div>
  );
}
