import type { Issue } from "../../interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSwr from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function IssuePage() {
  const { query, push } = useRouter();
  const { data, error, isLoading, mutate } = useSwr<Issue>(
    query.id ? `/api/issue/${query.id}` : null,
    fetcher
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (data) {
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
    }
  }, [data]);

  if (error) return <div>Failed to load issue</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  const editIssue = () => {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }
    fetch(`/api/issue/${data._id}`, {
      method: "PUT",
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
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // window.location.reload();
        mutate();
      });
  };

  const deleteIssue = () => {
    fetch(`/api/issue/${data._id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTitle("");
        setDescription("");
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // window.location.reload();
        push("/");
      });
  }

  return (
    <>
      {
        isEditing ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.5rem"
          }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem"
            }}>
            <button onClick={editIssue}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h1>{data.title ?? `Issue ${data._id}`}</h1>
            <p>{data.description}</p>
            <div style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "0.5rem"
            }}>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={deleteIssue}>Delete</button>
            <button onClick={() => push("/")}>Back</button>
            </div>
          </>
        )
      }
    </>
  );
}
