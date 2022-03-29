import { useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";

export function Index() {
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    // NOTE: fetching some data from backend for testing purposes
    const fetchData = async () => {
      const res = await authenticatedFetch("/api/product/all");
      const data = await res.json();
      console.log(data);
    };

    fetchData();
  }, [authenticatedFetch]);

  return (
    <main className="w-full max-w-4xl py-2 mx-auto">
      <h1 className="text-4xl font-bold text-center">Bevy Giveaways App</h1>
    </main>
  );
}
