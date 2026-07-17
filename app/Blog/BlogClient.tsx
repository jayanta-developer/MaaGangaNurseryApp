"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createBlogPost, type BlogPost } from "./data";

export default function BlogClient({
  initialPosts,
}: {
  initialPosts: BlogPost[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !body.trim() || !author.trim()) {
      return;
    }

    const newPost = createBlogPost({
      title: title.trim(),
      body: body.trim(),
      author: author.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });

    setPosts((current) => [newPost, ...current]);
    setTitle("");
    setBody("");
    setAuthor("");
  };

  return (
    <section style={{ marginBottom: "2rem" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "0.75rem",
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
          padding: "1rem",
          background: "#757474",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
          Create a new blog post
        </h2>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Post title"
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write your post content"
          rows={4}
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <input
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Author name"
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add post
        </button>
      </form>

      <div style={{ marginTop: "1rem", color: "#666" }}>
        Showing {posts.length} posts locally in the app.
      </div>

      <section style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {posts.map((post) => (
          <article
            key={post.id}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              padding: "1rem",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem" }}>{post.title}</h3>
            <p style={{ margin: "0 0 0.75rem", color: "#444" }}>{post.body}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#666",
              }}
            >
              <span>{post.author}</span>
              <Link
                href={`/Blog/${post.id}`}
                style={{ color: "#2563eb", fontWeight: 600 }}
              >
                View details →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}
