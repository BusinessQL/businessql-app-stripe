export type Integration = {
  id: string;
  accountId: string;
  spaceId: string;
  name: string;
  type: IntegrationType;
  data: any;
};

export interface IntegrationType {
  id: string;
  nameId: string;
  name: string;
  data: {
    displayCategory?: IntegrationTypeDisplayCategory;
  };
}

export type IntegrationTypeDisplayCategory = {
  nameId: string;
  name: string;
};
