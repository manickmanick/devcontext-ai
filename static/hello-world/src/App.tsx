import { useEffect, useState } from "react";
import { makeInvoke } from "@forge/bridge";
import "./App.css";
import { RESOLVER_NAMES } from "./constants/resolver-names";
import type { ApiResponse } from "./types/api-response";

type IssueDetails = {
  key: string;
  summary: string;
  description: string;
};

type ResolverDefinitions = {
  fetchLabels: () => ApiResponse<string[]>;
  getIssueDetails: () => ApiResponse<IssueDetails>;
};

const invoke = makeInvoke<ResolverDefinitions>();

function App() {
  const [issue, setIssue] = useState<IssueDetails | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIssueData = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([
          invoke(RESOLVER_NAMES.GET_ISSUE_DETAILS),
          invoke(RESOLVER_NAMES.FETCH_LABELS),
        ]);

        const [issueResult, labelsResult] = results;

        // Issue Details result
        if (issueResult.status === "fulfilled") {
          const response = issueResult.value;

          if (response.success) {
            setIssue(response.data);
          } else {
            console.error("GET_ISSUE_DETAILS failed:", response.error);
            setError(response.error?.message ?? "Failed to load issue details");
          }
        } else {
          console.error("GET_ISSUE_DETAILS rejected:", issueResult.reason);
          setError("Unable to load Jira issue details.");
        }

        // Labels result
        if (labelsResult.status === "fulfilled") {
          const response = labelsResult.value;

          if (response.success) {
            setLabels(response.data || []);
          } else {
            console.error("FETCH_LABELS failed:", response.error);
          }
        } else {
          console.error("FETCH_LABELS rejected:", labelsResult.reason);
        }
      } catch (err) {
        console.error("Unexpected frontend error:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadIssueData();
  }, []);

  if (loading) {
    return (
      <main className="app-container">
        <div className="state-card">
          <div className="loader" />
          <p>Loading issue details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-container">
        <div className="state-card error-card">
          <span className="state-icon">!</span>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!issue) {
    return (
      <main className="app-container">
        <div className="state-card">
          <h2>Issue not found</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="app-container">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">D</div>
          <div>
            <h1>DevContext AI</h1>
            <p>Engineering context for confident development</p>
          </div>
        </div>

        <span className="status-label">
          <span className="status-dot" />
          Connected
        </span>
      </header>

      <section className="issue-card">
        <div className="issue-meta">
          <span className="issue-key">{issue.key}</span>
          <span className="issue-type">Jira Issue</span>
        </div>

        <h2 className="issue-title">{issue.summary}</h2>

        <div className="section-divider" />

        <section className="content-section">
          <div className="section-heading">
            <span className="section-icon">≡</span>
            <h3>Description</h3>
          </div>

          <div className="description-content">
            {issue.description || "No description provided."}
          </div>
        </section>

        <div className="section-divider" />

        <section className="content-section">
          <div className="section-heading">
            <span className="section-icon">#</span>
            <h3>Issue Labels</h3>
            <span className="count-badge">{labels.length}</span>
          </div>

          {labels.length > 0 ? (
            <div className="labels-container">
              {labels.map((label) => (
                <span className="label-chip" key={label}>
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-text">No labels added to this issue.</p>
          )}
        </section>
      </section>

      <footer className="app-footer">
        <span>DevContext AI</span>
        <span>
          Understand the work. Understand the code. Ship with confidence.
        </span>
      </footer>
    </main>
  );
}

export default App;
