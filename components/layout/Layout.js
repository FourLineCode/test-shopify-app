import { ResourcePicker } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import { useState } from "react";

export function Layout() {
  const [resoursePickerOpen, setResoursePickerOpen] = useState(false);

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
    </Page>
  );
}
