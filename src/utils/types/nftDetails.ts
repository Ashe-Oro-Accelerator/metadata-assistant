export type Attribute = {
  trait_type: string;
  value: string | number | boolean;
};

type Properties = {
  external_url: string;
  url: string;
};

export type NFTDetailsType = {
  name: string;
  image: string;
  type: string;
  creator?: string;
  description?: string;
  properties?: Properties;
  attributes?: Attribute[];
};
