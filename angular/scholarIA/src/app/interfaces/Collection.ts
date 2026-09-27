import { ResearchPaper } from "./ResearchPaper";

export interface Collection {
  id: number;
  name: string;
  description: string;
  papers: ResearchPaper[];
  createdAt: Date;
}