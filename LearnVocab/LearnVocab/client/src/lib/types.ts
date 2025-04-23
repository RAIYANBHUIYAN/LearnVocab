// This file contains shared types used across the frontend
import { Word, WordFormValues } from "@shared/schema";

// Additional frontend-specific types can be added here

export type TagOption = {
  value: string;
  label: string;
};

export type SearchParams = {
  search?: string;
  tag?: string;
  page?: number;
};

export type SortOption = "newest" | "oldest" | "alphabetical";
