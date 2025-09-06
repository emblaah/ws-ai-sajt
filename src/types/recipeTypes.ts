export type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
  time: string;
  difficulty: Difficulty;
};

export type Difficulty = "easy" | "medium" | "hard";


export  type UiState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; recipes: Recipe[] }
    | { status: "error"; message: string };