"use client";
import React from "react";
import { ChefHat, Clock, Star, Utensils, Sparkles, Search } from "lucide-react";

import { useState } from "react";
import { Recipe } from "@/types/recipeTypes";
import { UiState } from "@/types/recipeTypes";

export default function Home() {
  const [uiState, setUiState] = useState<UiState>({ status: "idle" });
  const [prompt, setPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setUiState({
        status: "error",
        message: "Please enter at least one ingredient.",
      });
      return;
    }
    setUiState({ status: "loading" });

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data: { parsedOutPut: Recipe } = await res.json();
      console.log("data", data);

      if (
        data.parsedOutPut &&
        typeof data.parsedOutPut === "object" &&
        !Array.isArray(data.parsedOutPut)
      ) {
        setUiState({ status: "success", recipes: [data.parsedOutPut] }); // wrap in array if your UI expects an array
        setPrompt("");
      } else {
        setUiState({
          status: "error",
          message: "Please provide a valid ingredient",
        });
      }
    } catch (err) {
      console.error(err);
      setUiState({
        status: "error",
        message: "Error occurred while generating.",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-emerald-600 bg-emerald-100";
      case "medium":
        return "text-amber-600 bg-amber-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-orange-50 to-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-violet-400 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-orange-400 to-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-rose-400 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <ChefHat className="w-12 h-12 text-violet-600" />
              <Sparkles className="w-4 h-4 text-orange-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-violet-600 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-4">
            RecipeAI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Transform your ingredients into culinary masterpieces with
            AI-powered recipe recommendations
          </p>
        </div>

        <div className="w-full max-w-2xl mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="flex flex-col sm:flex-row items-stretch gap-4 space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your ingredients"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all duration-300 text-lg"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      uiState.status !== "loading" &&
                      handleGenerate()
                    }
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={uiState.status === "loading"}
                  className="bg-gradient-to-r from-violet-600 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl disabled:hover:scale-100 flex items-center space-x-2 justify-center sm:justify-start"
                >
                  {uiState.status === "loading" ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Recipes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {uiState.status === "loading" && (
          <div className="flex items-center space-x-4 text-gray-600 mb-8">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce animation-delay-400"></div>
            </div>
            <span className="text-lg font-medium">
              AI is crafting your perfect recipes...
            </span>
          </div>
        )}

        {uiState.status === "success" && (
          <div className="w-full max-w-6xl">
            <div
              className={`grid grid-cols-1 ${
                uiState.recipes.length === 1
                  ? "md:grid-cols-1"
                  : "md:grid-cols-2"
              } gap-8`}
            >
              {uiState.recipes.map((recipe, i) => (
                <div
                  key={i}
                  className="group relative"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${i * 0.2}s both`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-orange-500/20 rounded-3xl blur group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 font-medium">
                              {recipe.time} min
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
                              recipe.difficulty
                            )}`}
                          >
                            {recipe.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-gray-600 font-medium">
                          {recipe.rating}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Utensils className="w-5 h-5 text-violet-600" />
                        <h4 className="font-bold text-gray-800">Ingredients</h4>
                      </div>
                      <div className="bg-gray-50/80 rounded-2xl p-4">
                        <div className="grid grid-cols-2 gap-2">
                          {recipe.ingredients.map((ingredient, key) => (
                            <div
                              key={key}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-orange-500 rounded-full"></div>
                              <span className="text-gray-700 text-sm">
                                {ingredient}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <ChefHat className="w-5 h-5 text-orange-600" />
                        <h4 className="font-bold text-gray-800">
                          Instructions
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {recipe.instructions.map((instruction, key) => (
                          <div key={key} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-violet-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {key + 1}
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uiState.status === "idle" && (
          <div className="text-center text-gray-500 max-w-md">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">
              Enter your ingredients above and let AI create amazing recipes for
              you!
            </p>
          </div>
        )}

        {uiState.status === "error" && (
          <div className="text-center text-red-500 max-w-md">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-red-300" />
            <p className="text-lg font-semibold">{uiState.message}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
