export interface User {
  id?: string | number;
  username: string;
  token?: string;
  email: string;
  password?: string;
  bio?: string;
  image?: string | null;
}

export interface Profile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface Article {
  id?: string | number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt?: string;
  updatedAt?: string;
  favorited: boolean;
  favoritesCount: number;
  authorId?: string | number;
  favoritedBy?: User[];
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

export interface Articles {
  articles: Article[];
  articlesCount: number;
}

export interface Comment {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
  body: string;
  authorId?: string | number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}
export interface Comments {
  comments: Comment[];
}
