export interface LoginUserBody {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterUserBody {
  user: {
    username: string;
    email: string;
    password: string;
  };
}
export interface UpdateUser {
  user: {
    username?: string;
    email?: string;
    password?: string;
    bio?: string;
    image?: string;
  };
}

export interface CreateArticle {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}
export interface UpdateArticle {
  article: {
    title?: string;
    description?: string;
    body?: string;
  };
}

export interface AddComment {
  comment: {
    body: string;
  };
}


