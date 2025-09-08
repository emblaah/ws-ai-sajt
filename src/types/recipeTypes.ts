export type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
  time: number;
  difficulty: Difficulty;
  rating: number;
};

export type Difficulty = "Easy" | "medium" | "hard";

export type UiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; recipes: Recipe[] }
  | { status: "error"; message: string };
