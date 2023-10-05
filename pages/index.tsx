import type { Issue } from "../interfaces";
import useSwr from "swr";
import Link from "next/link";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Index() {
  // make it so that we can create pagination
  const [page, setPage] = useState(1);
  const { data, error, isLoading, mutate } = useSwr<Issue[]>(
    `/api/issues?page=${page}`,
    fetcher
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createIssue = () => {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }

    fetch("/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
      .then(() => {
        setTitle("");
        setDescription("");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // window.location.reload();
        mutate();
      });
  };

  if (error) return <div>Failed to load issues</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <>
      <ul>
        {data.map((issue) => (
          <li key={issue._id.toString()}>
            <Link href="/issue/[id]" as={`/issue/${issue._id}`}>
              {issue.title ?? `Issue ${issue._id}`}
            </Link>
          </li>
        ))}
      </ul>
      {/* // create a new issue */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <form>
          <h2>Create a new issue</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "0.5rem",
            }}
          >
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                createIssue();
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
