export type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string[];
  time: string;
  difficulty: Difficulty;
};

export type Difficulty = "easy" | "medium" | "hard";
