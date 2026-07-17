export type BlogPost = {
  id: number;
  title: string;
  body: string;
  author: string;
  date: string;
};

const initialPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    body: "Learn the fundamentals of the App Router and Server Components to build modern web experiences.",
    author: "Aria Chen",
    date: "July 10, 2026",
  },
  {
    id: 2,
    title: "Why Server Components Matter",
    body: "A deep dive into rendering strategies and performance for modern React apps.",
    author: "Marcus Lee",
    date: "July 5, 2026",
  },
  {
    id: 3,
    title: "Building Forms with Server Actions",
    body: "Ditch the boilerplate and mutate data directly from the server with modern patterns.",
    author: "Priya Nair",
    date: "June 28, 2026",
  },
];

let posts: BlogPost[] = [...initialPosts];

export function getBlogPosts() {
  return posts;
}

export function getBlogPost(id: number) {
  return posts.find((post) => post.id === id);
}

export function createBlogPost(post: Omit<BlogPost, "id">) {
  const newPost: BlogPost = {
    id: Date.now(),
    ...post,
  };

  posts = [newPost, ...posts];
  return newPost;
}
