import { TableRow, TableRowTypeMap } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "classnames";
import React from "react";

import Link from "../Link";

type MaterialTableRowPropsType = TableRowTypeMap["props"];

export interface TableRowLinkProps
  extends Omit<MaterialTableRowPropsType, "onClick"> {
  href?: string;
  className?: string;
  linkClassName?: string;
}

const useStyles = makeStyles(
  {
    link: {
      all: "inherit",
      display: "contents"
    }
  },
  { name: "TableRowLink" }
);

export const TableRowLink: React.FC<TableRowLinkProps> = ({
  href,
  children,
  linkClassName,
  ...props
}) => {
  const classes = useStyles();

  if (!href) {
    return <TableRow {...props}>{children}</TableRow>;
  }

  return (
    <TableRow {...props}>
      <Link className={clsx(classes.link, linkClassName)} href={href}>
        {children}
      </Link>
    </TableRow>
  );
};
