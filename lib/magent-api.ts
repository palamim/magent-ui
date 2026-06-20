// The Magent Express server. Later: move to an env var (NEXT_PUBLIC_MAGENT_API_URL).
const API_BASE = "http://localhost:4000/api";

export interface Plan {
  description: string;
  type: string;
  slug: string;
  targetFiles: string[];
  contextFiles: string[];
  instructions: string;
}

interface ProposalResponse {
  plan: Plan;
}

export const fetchProposal = async (dir: string): Promise<Plan> => {
  const res = await fetch(`${API_BASE}/proposal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dir }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error ?? `Server error (${res.status})`);
  }

  const data: ProposalResponse = await res.json();
  return data.plan;
};
