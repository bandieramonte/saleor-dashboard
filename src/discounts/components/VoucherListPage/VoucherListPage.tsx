import { Card } from "@material-ui/core";
import Container from "@saleor/components/Container";
import { getByName } from "@saleor/components/Filter/utils";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { voucherAddUrl, VoucherListUrlSortField } from "@saleor/discounts/urls";
import { VoucherFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import {
  ChannelProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import VoucherList from "../VoucherList";
import {
  createFilterStructure,
  VoucherFilterKeys,
  VoucherListFilterOpts
} from "./filters";

export interface VoucherListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<VoucherFilterKeys, VoucherListFilterOpts>,
    SortPage<VoucherListUrlSortField>,
    TabPageProps,
    ChannelProps {
  vouchers: VoucherFragment[];
}
const VoucherListPage: React.FC<VoucherListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
  onAll,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();
  const structure = createFilterStructure(intl, filterOpts);

  const filterDependency = structure.find(getByName("channel"));

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.vouchers)}>
        <Button
          href={voucherAddUrl()}
          variant="primary"
          data-test-id="create-voucher"
        >
          <FormattedMessage
            defaultMessage="Create voucher"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Vouchers",
            description: "tab name"
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Voucher"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <VoucherList filterDependency={filterDependency} {...listProps} />
      </Card>
    </Container>
  );
};
VoucherListPage.displayName = "VoucherListPage";
export default VoucherListPage;
