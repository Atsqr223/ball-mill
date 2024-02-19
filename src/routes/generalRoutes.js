import React, {lazy} from "react";
import { Redirect, Route } from "react-router-dom";

import GeneralLayout from "../layout/GeneralLayout";

const NotFound = lazy(() => import("../pages/errors/notFound/NotFound"));

const routes = [
  {
    path: "/",
    component: <Redirect to="/dashboard" />,
  },
  {
    path: "",
    component: <Redirect to="/dashboard" />,
  },
  {
    path: "*",
    component: <NotFound />,
  },
];

export default routes.map((route, index) => (
  <Route
    exact
    key={index}
    path={route.path}
    render={() => <GeneralLayout>{route.component}</GeneralLayout>}
  />
));
