import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import DocumentTitle from "./DocumentTitle";

export default function RootLayout() {
  return (
    <Fragment>
      <DocumentTitle />
      <Outlet />
    </Fragment>
  );
}
