export type App = {
  id: string;
  accountId: string;
  spaceId: string;
  name: string;
  type: AppType;
  data: any;
};

export interface AppType {
  id: string;
  nameId: string;
  name: string;
  data: {
    displayCategory?: AppTypeDisplayCategory;
  };
}

export type AppTypeDisplayCategory = {
  nameId: string;
  name: string;
};
