import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Button, Card, Page } from "@shopify/polaris";
import { useState } from "react";

export function Layout() {
  const app = useAppBridge();
  const authFetch = authenticatedFetch(app);
  const [resoursePickerOpen, setResoursePickerOpen] = useState(false);

  const fetchData = async () => {
    const res = await authFetch("/api/v1/hello");
    const data = await res.json();
    console.log(data);
  };

  return (
    <Page
      title="Basic Shop"
      subtitle="Just a hello world app"
      compactTitle={true}
      primaryAction={{
        content: "Choose Items",
        onAction: () => setResoursePickerOpen(true),
      }}
    >
      <ResourcePicker
        open={resoursePickerOpen}
        resourceType="Product"
        onCancel={() => setResoursePickerOpen(false)}
        onSelection={(items) => console.log(items.selection)}
      />
      <Card>
        <Button onClick={fetchData}>Fetch Data</Button>
      </Card>
    </Page>
  );
}
