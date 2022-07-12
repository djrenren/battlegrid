export type ResourceMessage =
  | {
      type: "found";
      id: string;
    }
  | {
      type: "notfound";
      id: string;
      error: any;
    };

export type ResourceRequest = {
  id: string;
};

export type ResourceId = string & { __braing: "resourceid" };
