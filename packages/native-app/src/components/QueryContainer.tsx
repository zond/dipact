import React from "react";
import { Query } from "../types";
import Loading from "./Loading";
import { Stack } from "./Stack";

interface QueryContainerBaseProps<T> {
  query: Query<T>;
  render: (data: T) => JSX.Element;
  renderLoading: () => JSX.Element;
  renderError: () => JSX.Element;
  renderNotSuccess: () => JSX.Element;
}

const QueryContainerBase = <T,>({
  query,
  render,
  renderLoading,
  renderError,
  renderNotSuccess,
}: QueryContainerBaseProps<T>) => {
  if (query.isLoading) {
    return renderLoading();
  }
  if (query.isError) {
    return renderError();
  }
  if (!query.isSuccess) {
    return renderNotSuccess();
  }
  if (!query.data) {
    return renderNotSuccess();
  }
  return render(query.data);
};

interface QueryContainerProps<T> {
  query: Query<T>;
  render: (data: T) => JSX.Element;
  renderLoading?: () => JSX.Element;
  renderError?: () => JSX.Element;
  renderNotSuccess?: () => JSX.Element;
}

const DefaultLoading = () => (
  <Stack justify="center" fillHeight>
    <Loading size={"large"} />
  </Stack>
);

const DefaultError = () => <></>;

const DefaultNotSuccess = () => <></>;

const QueryContainer = <T,>({
  query,
  render,
  renderLoading = DefaultLoading,
  renderError = DefaultError,
  renderNotSuccess = DefaultNotSuccess,
}: QueryContainerProps<T>) => {
  return (
    <QueryContainerBase
      query={query}
      render={render}
      renderLoading={renderLoading}
      renderError={renderError}
      renderNotSuccess={renderNotSuccess}
    />
  );
};

export default QueryContainer;
