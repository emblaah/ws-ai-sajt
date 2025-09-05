"use client";
import React from "react";

import { useState } from "react";
import { Recipe } from "@/types/recipeTypes";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setRecipes([]);

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.parsedOutPut.length > 0) {
        setRecipes(data.parsedOutPut);
        console.log(data.parsedOutPut);
        setPrompt("");
      } else if (data.parsedOutPut.length === 0) {
        alert("Please provide a valid ingredient");
        setRecipes([]);
      } else {
        alert("Didnt go trough the ai");
        setRecipes([]);
      }
    } catch (err) {
      console.error(err);
      setPrompt("");
      alert("Error occurred while generating.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">🍲 Recipe Recommender</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your preferences..."
        className="border rounded px-3 py-2 w-80 mb-3"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Get Recommendations"}
      </button>

      <div className="flex flex-col m-4 p-6">
        {recipes.map((recipe, i) => (
          <div className="flex flex-col" key={i}>
            <li>{recipe.title}</li>
            <div>
              {recipe.instructions.map((item, key) => (
                <li key={key}> {item} </li>
              ))}
            </div>
            <div>
              {" "}
              {recipe.ingredients.map((item, key) => (
                <li key={key}> {item} </li>
              ))}{" "}
            </div>
            <li> {recipe.difficulty} </li>
            <li> {recipe.time}min </li>
          </div>
        ))}
      </div>
    </div>
  );
}
