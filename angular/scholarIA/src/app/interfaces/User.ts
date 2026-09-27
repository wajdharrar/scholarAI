export default interface User {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  institution: string;
  imageUrl: string | null;
  papersCount: number;
  citationCount: number;
  createdAt: string;
  bio: string;
}