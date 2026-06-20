"use client";

import { useState } from "react";
import { fetchProposal, type Plan } from "@/lib/magent-api";

export default function Home() {
  const [dir, setDir] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePropose = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const result = await fetchProposal(dir);
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1>Magent</h1>

      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <input
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          placeholder="/path/to/your/project"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handlePropose} disabled={loading || !dir}>
          {loading ? "Thinking…" : "Propose"}
        </button>
      </div>

      {error && <p style={{ color: "crimson", marginTop: 24 }}>{error}</p>}

      {plan && (
        <section style={{ marginTop: 32 }}>
          <p style={{ fontWeight: 600 }}>
            {plan.type}: {plan.description}
          </p>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>
            {plan.instructions}
          </pre>
          <p style={{ marginTop: 16, opacity: 0.7 }}>
            Target files: {plan.targetFiles.join(", ") || "(none)"}
          </p>
        </section>
      )}
    </main>
  );
}
