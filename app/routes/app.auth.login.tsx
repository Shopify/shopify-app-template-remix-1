import React, { useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { json, type ActionArgs } from "@remix-run/node";

import {
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { Form, useActionData } from "@remix-run/react";

import { loginErrorMessages, shopify } from "../shopify.server";
import { useTranslation } from "react-i18next";

export async function loader({ request }: LoaderArgs) {
  const shop = new URL(request.url).searchParams.get("shop");
  if (shop) {
    const errors = await shopify.login(request);

    return json({ errors: loginErrorMessages(errors) });
  }

  return null;
}

export async function action({ request }: ActionArgs) {
  const errors = await shopify.login(request);

  return json({ errors: loginErrorMessages(errors) });
}

export default function Auth() {
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState("");
  const { t } = useTranslation();

  return (
    <Page>
      <Card>
        <Form method="post">
          <FormLayout>
            <Text variant="headingMd" as="h2">
              {t("App.Login.title")}
            </Text>
            <TextField
              type="text"
              name="shop"
              label={t("App.Login.label")}
              placeholder={t("App.Login.placeholder")}
              helpText={t("App.Login.help")}
              value={shop}
              onChange={setShop}
              autoComplete="on"
              error={actionData ? t(actionData.errors.shop) : undefined}
            />
            <Button submit primary>
              {t("App.Login.submit")}
            </Button>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}