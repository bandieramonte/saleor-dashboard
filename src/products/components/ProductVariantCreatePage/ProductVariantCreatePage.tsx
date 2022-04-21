import {
  getAttributeValuesFromReferences,
  mergeAttributeValues
} from "@saleor/attributes/utils/data";
import AssignAttributeValueDialog from "@saleor/components/AssignAttributeValueDialog";
import Attributes, {
  AttributeInput,
  VariantAttributeScope
} from "@saleor/components/Attributes";
import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  ProductErrorWithAttributesFragment,
  ProductVariantCreateDataQuery,
  SearchAttributeValuesQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  SearchWarehousesQuery
} from "@saleor/graphql";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { FetchMoreProps, RelayToFlat, ReorderAction } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks from "../ProductStocks";
import ProductVariantCheckoutSettings from "../ProductVariantCheckoutSettings/ProductVariantCheckoutSettings";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductVariantCreateForm, {
  ProductVariantCreateData,
  ProductVariantCreateHandlers
} from "./form";

const messages = defineMessages({
  attributesHeader: {
    defaultMessage: "Variant Attributes",
    description: "attributes, section header"
  },
  attributesSelectionHeader: {
    defaultMessage: "Variant Selection Attributes",
    description: "attributes, section header"
  },
  deleteVariant: {
    defaultMessage: "Delete Variant",
    description: "button"
  },
  saveVariant: {
    defaultMessage: "Save variant",
    description: "button"
  },
  pricingCardSubtitle: {
    defaultMessage:
      "There is no channel to define prices for. You need to first add variant to channels to define prices.",
    description: "variant pricing section subtitle"
  }
});

interface ProductVariantCreatePageProps {
  disabled: boolean;
  errors: ProductErrorWithAttributesFragment[];
  header: string;
  product: ProductVariantCreateDataQuery["product"];
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
  weightUnit: string;
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
  attributeValues: RelayToFlat<
    SearchAttributeValuesQuery["attribute"]["choices"]
  >;
  onBack: () => void;
  onSubmit: (data: ProductVariantCreateData) => void;
  onVariantClick: (variantId: string) => void;
  onVariantReorder: ReorderAction;
  onWarehouseConfigure: () => void;
  assignReferencesAttributeId?: string;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchMoreAttributeValues?: FetchMoreProps;
  onCloseDialog: () => void;
  onAttributeSelectBlur: () => void;
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = ({
  disabled,
  errors,
  header,
  product,
  saveButtonBarState,
  warehouses,
  weightUnit,
  referencePages = [],
  referenceProducts = [],
  attributeValues,
  onBack,
  onSubmit,
  onVariantClick,
  onVariantReorder,
  onWarehouseConfigure,
  assignReferencesAttributeId,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchReferenceProducts,
  fetchAttributeValues,
  fetchMoreReferencePages,
  fetchMoreReferenceProducts,
  fetchMoreAttributeValues,
  onCloseDialog,
  onAttributeSelectBlur
}) => {
  const intl = useIntl();

  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

  const handleAssignReferenceAttribute = (
    attributeValues: string[],
    data: ProductVariantCreateData,
    handlers: ProductVariantCreateHandlers
  ) => {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues,
        data.attributes
      )
    );
    onCloseDialog();
  };

  return (
    <ProductVariantCreateForm
      product={product}
      onSubmit={onSubmit}
      warehouses={warehouses}
      referencePages={referencePages}
      referenceProducts={referenceProducts}
      fetchReferencePages={fetchReferencePages}
      fetchMoreReferencePages={fetchMoreReferencePages}
      fetchReferenceProducts={fetchReferenceProducts}
      fetchMoreReferenceProducts={fetchMoreReferenceProducts}
      assignReferencesAttributeId={assignReferencesAttributeId}
      disabled={disabled}
    >
      {({ change, data, formErrors, handlers, submit, isSaveDisabled }) => (
        <Container>
          <Backlink onClick={onBack}>{product?.name}</Backlink>
          <PageHeader title={header} />
          <Grid variant="inverted">
            <div>
              <ProductVariantNavigation
                fallbackThumbnail={product?.thumbnail?.url}
                variants={product?.variants}
                onRowClick={(variantId: string) => {
                  if (product && product.variants) {
                    return onVariantClick(variantId);
                  }
                }}
                onReorder={onVariantReorder}
              />
            </div>
            <div>
              <Attributes
                title={intl.formatMessage(messages.attributesHeader)}
                attributes={data.attributes.filter(
                  attribute =>
                    attribute.data.variantAttributeScope ===
                    VariantAttributeScope.NOT_VARIANT_SELECTION
                )}
                attributeValues={attributeValues}
                loading={disabled}
                disabled={disabled}
                errors={errors}
                onChange={handlers.selectAttribute}
                onMultiChange={handlers.selectAttributeMultiple}
                onFileChange={handlers.selectAttributeFile}
                onReferencesRemove={handlers.selectAttributeReference}
                onReferencesAddClick={onAssignReferencesClick}
                onReferencesReorder={handlers.reorderAttributeValue}
                fetchAttributeValues={fetchAttributeValues}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onAttributeSelectBlur={onAttributeSelectBlur}
              />
              <CardSpacer />
              <Attributes
                title={intl.formatMessage(messages.attributesSelectionHeader)}
                attributes={data.attributes.filter(
                  attribute =>
                    attribute.data.variantAttributeScope ===
                    VariantAttributeScope.VARIANT_SELECTION
                )}
                attributeValues={attributeValues}
                loading={disabled}
                disabled={disabled}
                errors={errors}
                onChange={handlers.selectAttribute}
                onMultiChange={handlers.selectAttributeMultiple}
                onFileChange={handlers.selectAttributeFile}
                onReferencesRemove={handlers.selectAttributeReference}
                onReferencesAddClick={onAssignReferencesClick}
                onReferencesReorder={handlers.reorderAttributeValue}
                fetchAttributeValues={fetchAttributeValues}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onAttributeSelectBlur={onAttributeSelectBlur}
              />
              <CardSpacer />
              <ProductVariantCheckoutSettings
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <ProductShipping
                data={data}
                disabled={disabled}
                errors={errors}
                weightUnit={weightUnit}
                onChange={change}
              />
              <CardSpacer />
              <ProductVariantPrice
                disabledMessage={messages.pricingCardSubtitle}
              />
              <CardSpacer />
              <ProductStocks
                data={data}
                disabled={disabled}
                hasVariants={true}
                onFormDataChange={change}
                formErrors={formErrors}
                errors={errors}
                stocks={data.stocks}
                warehouses={warehouses}
                onChange={handlers.changeStock}
                onChangePreorderEndDate={handlers.changePreorderEndDate}
                onWarehouseStockAdd={handlers.addStock}
                onWarehouseStockDelete={handlers.deleteStock}
                onWarehouseConfigure={onWarehouseConfigure}
              />
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
            </div>
          </Grid>
          <Savebar
            disabled={isSaveDisabled}
            labels={{
              confirm: intl.formatMessage(messages.saveVariant),
              delete: intl.formatMessage(messages.deleteVariant)
            }}
            state={saveButtonBarState}
            onCancel={onBack}
            onSubmit={submit}
          />
          {canOpenAssignReferencesAttributeDialog && (
            <AssignAttributeValueDialog
              attributeValues={getAttributeValuesFromReferences(
                assignReferencesAttributeId,
                data.attributes,
                referencePages,
                referenceProducts
              )}
              hasMore={handlers.fetchMoreReferences?.hasMore}
              open={canOpenAssignReferencesAttributeDialog}
              onFetch={handlers.fetchReferences}
              onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
              loading={handlers.fetchMoreReferences?.loading}
              onClose={onCloseDialog}
              onSubmit={attributeValues =>
                handleAssignReferenceAttribute(attributeValues, data, handlers)
              }
            />
          )}
        </Container>
      )}
    </ProductVariantCreateForm>
  );
};
ProductVariantCreatePage.displayName = "ProductVariantCreatePage";
export default ProductVariantCreatePage;
