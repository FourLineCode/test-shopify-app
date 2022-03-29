import { useEffect } from "react";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    authenticatedFetch("/api/dashboard")
      .then((res) => res.json())
      .then(console.log);
  }, [authenticatedFetch]);

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Bevy Giveaway Dashboard</h1>
    </main>
  );
}
