export enum OrderBy {
  LatestFirst = "latest_first",
  OldestFirst = "oldest_first",
  TitleAZ = "title_az",
  TitleZA = "title_za",
  HighestPriority = "highest_prio",
  LowestPriority = "lowest_prio",
  MostViews = "most_views",
  LeastViews = "least_views",
}

type OrderByOptions = {
  direction?: "asc" | "desc";
  orderBy?: "createdat" | "priority" | "views" | "title";
};

export function enumToOptions(orderBy?: OrderBy): OrderByOptions {
  switch (orderBy) {
    case OrderBy.TitleAZ:
      return {
        orderBy: "title",
        direction: "asc",
      };
    case OrderBy.TitleZA:
      return {
        orderBy: "title",
        direction: "desc",
      };
    case OrderBy.HighestPriority:
      return {
        orderBy: "priority",
        direction: "desc",
      };
    case OrderBy.LowestPriority:
      return {
        orderBy: "priority",
        direction: "asc",
      };
    case OrderBy.MostViews:
      return {
        orderBy: "views",
        direction: "desc",
      };
    case OrderBy.LeastViews:
      return {
        orderBy: "views",
        direction: "asc",
      };
    case OrderBy.OldestFirst:
      return {
        orderBy: "createdat",
        direction: "asc",
      };
    default:
      return {
        orderBy: "createdat",
        direction: "desc",
      };
  }
}
