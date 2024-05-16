// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type MovieLiked = {
  user: string;
  datetime: string;
  movie: number;
};
export type MovieSeen = {
  user: string;
  datetime: string;
  movie: number;
};
export type Logs = {
  id: string;
  user: string;
  datetime: string;
  action: string;
};