import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import {
  Avatar,
  Button,
  Card,
  Modal,
  Page,
  Stack,
  TextContainer,
  TextStyle,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useState } from "react";

export function Layout() {
  const router = useRouter();
  const app = useAppBridge();
  const authFetch = authenticatedFetch(app);
  const [resoursePickerOpen, setResoursePickerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const res = await authFetch("/api/v1/products");
    const data = await res.json();
    setApiData(data);
    setLoading(false);
    setModalOpen(true);
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
      secondaryActions={[
        { content: "About", onAction: () => router.push("/about") },
      ]}
    >
      <ResourcePicker
        open={resoursePickerOpen}
        resourceType="Product"
        onCancel={() => setResoursePickerOpen(false)}
        onSelection={(items) => {
          setSelectedItems(items.selection);
          setResoursePickerOpen(false);
        }}
      />
      <Card sectioned>
        <Stack alignment="center" distribution="equalSpacing">
          <p>This will fetch data from internal api</p>
          <Button outline loading={loading} onClick={fetchData}>
            Fetch Data
          </Button>
        </Stack>
        <Modal
          large
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Response from internal API"
          secondaryActions={[
            {
              content: "Close",
              onAction: () => setModalOpen(false),
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <pre>{JSON.stringify(apiData, null, 4)}</pre>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Card>
      <div className="mt-2 space-y-2">
        <h2 className="text-xl font-semibold">Selected Products</h2>
        {selectedItems.map(({ id, title }) => (
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
    </Page>
  );
}
