import React from "react";
import { CreateButton, ExportButton, TopToolbar } from "react-admin";
import ImportButton from "./ImportButton";
import { getResourceExporter } from "./exporters";

const ListActions = ({ resource, hasFilters = false, hasCreate = true }) => (
  <TopToolbar>
    {hasCreate ? <CreateButton /> : null}
    <ExportButton exporter={getResourceExporter(resource)} />
    <ImportButton resource={resource} />
  </TopToolbar>
);

export default ListActions;
