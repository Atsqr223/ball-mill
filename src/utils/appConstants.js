const personRoles = {
  A: "System Administrator",
  H: "Head of Planning",
  C: "Collaborator",
};

const statuses = {
  0: "Inactive",
  1: "Active",
};

const methods = {
  0: "Foliar",
  1: "Manual",
  2: "Water Drain",
};

const stationaries = {
  0: "No",
  1: "Yes",
};

const treeHealthStatuses = {
  0: "Sick",
  1: "Healthy",
};

const workPlanMethods = {
  0: {
    name: "Knapsack pump 18lt",
    actualName: "Knapsack pump",
    value: 18000,
    unit: "CC",
    totalunit: "Lts"
  },
  1: { name: "Caneca 200lt", actualName: "Caneca ", value: 200000, unit: "CC", totalunit: "Lts" },
  2: { name: "IBC 1000", actualName: "IBC", value: 1000000, unit: "CC", totalunit: "Lts" },
};

const unitMetric = {
  g: "Gram",
  cc: "CC",
  totalunit: "Lts"
};

const perPage = 15;

const filePathUrl = {
  trees: `${process.env.REACT_APP_ASSET_URL}/assets/trees`,
  illnesses: `${process.env.REACT_APP_ASSET_URL}/assets/illnesses`,
  rawMaterials: `${process.env.REACT_APP_ASSET_URL}/assets/raw-materials`,
  expertMonitor: `${process.env.REACT_APP_ASSET_URL}/assets/tree-illnesses`,
  farms: `${process.env.REACT_APP_ASSET_URL}/assets/farms`,

};

const defaultFolialDrencheId = "61c1eee3a713b1e808b2a68f";

export {
  personRoles,
  statuses,
  methods,
  stationaries,
  treeHealthStatuses,
  workPlanMethods,
  unitMetric,
  perPage,
  filePathUrl,
  defaultFolialDrencheId
};
