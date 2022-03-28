import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Avatar, Button, Card, Stack, TextStyle } from "@shopify/polaris";
import Link from "next/link";
import { useState } from "react";

export function Home() {
  const app = useAppBridge();
  const authFetch = authenticatedFetch(app);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await authFetch("/api/product/all");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  return (
    <main className="w-full max-w-4xl py-2 mx-auto">
      <Card sectioned>
        <Stack alignment="center" distribution="equalSpacing">
          <p>Fetch all products from internal api</p>
          <Button outline loading={loading} onClick={fetchData}>
            Get products
          </Button>
        </Stack>
      </Card>
      {products.length > 0 && (
        <div className="mt-2 space-y-2">
          <h2 className="text-xl font-semibold">Shop Products</h2>
          {products.map(({ id, title }) => (
            <div
              key={id}
              className="flex items-center p-4 space-x-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
            >
              <Avatar customer size="medium" name={title} />
              <h3>
                <TextStyle variation="strong">{title}</TextStyle>
              </h3>
            </div>
          ))}
        </div>
      )}
      <Link passHref href="/about">
        <div className="mt-6 text-center text-blue-500 cursor-pointer hover:underline">About</div>
      </Link>
    </main>
  );
}
