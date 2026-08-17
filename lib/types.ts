export type AzkarType = "morning" | "evening";

export type Dhikr = {
  id: string;
  type: AzkarType;
  order: number;
  text: string;
  repetitions: number;
  source: string;
};

export type ProgressState = Record<string, number>;
