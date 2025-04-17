"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error fetching from backend "));
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Frontend (Next.js)</h1>
      <p>Message from Spring Boot backend:</p>
      <pre>{message}</pre>
    </main>
  );
}
