import { useEffect, useState } from "react";
import { events, makeInvoke } from "@forge/bridge";

type ResolverDefinitions = {
  fetchLabels: () => string[];
};

const invoke = makeInvoke<ResolverDefinitions>();

function App() {
  const [labels, setLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    let active = true;

    const fetchLabels = async () => {
      try {
        if (active) {
          setStatus("loading");
        }

        const result = await invoke("fetchLabels");

        if (active) {
          setLabels(result);
          setStatus("success");
        }
      } catch (error) {
        console.error("Failed to fetch labels:", error);

        if (active) {
          setStatus("error");
        }
      }
    };

    fetchLabels();

    const subscriptionPromise = events.on("JIRA_ISSUE_CHANGED", () => {
      fetchLabels();
    });

    return () => {
      active = false;

      subscriptionPromise.then((subscription) => {
        subscription.unsubscribe();
      });
    };
  }, []);

  return (
    <main style={{ padding: "24px" }}>
      <h1>DevContext AI</h1>

      <p>Understand your Jira issue before coding.</p>

      <h3>Issue Labels</h3>

      {status === "loading" && <p>Loading labels...</p>}

      {status === "error" && <p>Unable to load labels. Please try again.</p>}

      {status === "success" &&
        (labels.length > 0 ? (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {labels.map((label) => (
              <span
                key={label}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  background: "#E9F2FF",
                  color: "#0747A6",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <p>No labels found for this issue.</p>
        ))}
    </main>
  );
}

export default App;
