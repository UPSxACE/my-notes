export enum NoteOrderBy {
  LatestFirst = "latest_first",
  OldestFirst = "oldest_first",
  TitleAZ = "title_az",
  TitleZA = "title_za",
  HighestPriority = "highest_prio",
  LowestPriority = "lowest_prio",
  MostViews = "most_views",
  LeastViews = "least_views",
}

type NoteOrderByOptions = {
  direction?: "asc" | "desc";
  orderBy?: "createdat" | "priority" | "views" | "title";
};

export function enumToOptions(orderBy?: NoteOrderBy): NoteOrderByOptions {
  switch (orderBy) {
    case NoteOrderBy.TitleAZ:
      return {
        orderBy: "title",
        direction: "asc",
      };
    case NoteOrderBy.TitleZA:
      return {
        orderBy: "title",
        direction: "desc",
      };
    case NoteOrderBy.HighestPriority:
      return {
        orderBy: "priority",
        direction: "desc",
      };
    case NoteOrderBy.LowestPriority:
      return {
        orderBy: "priority",
        direction: "asc",
      };
    case NoteOrderBy.MostViews:
      return {
        orderBy: "views",
        direction: "desc",
      };
    case NoteOrderBy.LeastViews:
      return {
        orderBy: "views",
        direction: "asc",
      };
    case NoteOrderBy.OldestFirst:
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
