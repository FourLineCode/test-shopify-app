import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import {
  Button,
  Card,
  Modal,
  Page,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import { useState } from "react";

export function Layout() {
  const app = useAppBridge();
  const authFetch = authenticatedFetch(app);
  const [resoursePickerOpen, setResoursePickerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await authFetch("/api/v1/hello");
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
    >
      <ResourcePicker
        open={resoursePickerOpen}
        resourceType="Product"
        onCancel={() => setResoursePickerOpen(false)}
        onSelection={(items) => console.log(items.selection)}
      />
      <Card sectioned>
        <Stack alignment="center" distribution="equalSpacing">
          <p>This will fetch data from internal api</p>
          <Button outline loading={loading} onClick={fetchData}>
            Fetch Data
          </Button>
        </Stack>
        <Modal
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
    </Page>
  );
}
