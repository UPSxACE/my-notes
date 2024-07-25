import { Folder, Note } from "@/gql/graphql.schema";
import { enumToOptions, NoteOrderBy } from "./note-order-by";

// Returns -1 if id1 is before, 1 if after, 0 if equal. (ascending)
export function compareUidsV7(id1: string, id2: string) {
  return id1.localeCompare(id2);
}
export function compareString(string1: string, string2: string) {
  return string1.localeCompare(string2);
}
export function compareTime(date1: Date, date2: Date) {
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
}
export function compareNumber(number1: number, number2: number) {
  if (number1 > number2) return 1;
  if (number1 < number2) return -1;
  return 0;
}

export function biggestDate(date1: Date, date2: Date) {
  return date1 > date2 ? date1 : date2;
}

type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any;
};

function sortByTimeUidAsc<T>(
  data: T[],
  datePropertyName: KeyOfType<T, Date>,
  uidPropertyName: KeyOfType<T, string>
): T[] {
  return data.sort((a, b) => {
    const _a: Date = a[datePropertyName] as Date;
    const _aId: string = a[uidPropertyName] as string;
    const _b: Date = b[datePropertyName] as Date;
    const _bId: string = b[uidPropertyName] as string;
    let comparison = compareTime(_a, _b);
    if (comparison === 0) comparison = compareUidsV7(_aId, _bId);

    return comparison;
  });
}

function sortByTimeUidDesc<T>(
  data: T[],
  datePropertyName: KeyOfType<T, Date>,
  uidPropertyName: KeyOfType<T, string>
): T[] {
  return data.sort((a, b) => {
    const _a: Date = a[datePropertyName] as Date;
    const _aId: string = a[uidPropertyName] as string;
    const _b: Date = b[datePropertyName] as Date;
    const _bId: string = b[uidPropertyName] as string;
    let comparison = _b.getTime() - _a.getTime();
    if (comparison === 0) comparison = compareUidsV7(_bId, _aId);

    return comparison;
  });
}

// type FolderPartial = {
//   id: Folder["id"];
//   path: Folder["path"];
// };

export function compareNoteLast(
  notes: Note[],
  noteToCompare: Note,
  order?: NoteOrderBy
) {
  const { orderBy, direction } = enumToOptions(order);
  if (!orderBy || !direction)
    throw new Error("Unexpected error comparing last note");

  const last = notes[notes.length - 1];

  switch (orderBy) {
    case "priority":
      return direction === "asc"
        ? compareNumber(noteToCompare.priority, last.priority)
        : compareNumber(last.priority, noteToCompare.priority);
    case "views":
      return direction === "asc"
        ? compareNumber(noteToCompare.views, last.views)
        : compareNumber(last.views, noteToCompare.views);
    case "title":
      return direction === "asc"
        ? compareString(noteToCompare.title || "", last.title || "")
        : compareString(last.title || "", noteToCompare.title || "");
    default:
      return direction === "asc"
        ? compareTime(noteToCompare.createdAt, last.createdAt)
        : compareTime(last.createdAt, noteToCompare.createdAt);
  }
}

export function sortNotes(notes: Note[], order?: NoteOrderBy) {
  const { orderBy, direction } = enumToOptions(order);
  if (!orderBy || !direction) throw new Error("Unexpected error sorting notes");

  switch (orderBy) {
    case "priority":
      return direction === "asc"
        ? notes.sort((a, b) => compareNumber(a.priority, b.priority))
        : notes.sort((a, b) => compareNumber(b.priority, a.priority));
    case "views":
      return direction === "asc"
        ? notes.sort((a, b) => compareNumber(a.views, b.views))
        : notes.sort((a, b) => compareNumber(b.views, a.views));
    case "title":
      return direction === "asc"
        ? notes.sort((a, b) => compareString(a.title || "", b.title || ""))
        : notes.sort((a, b) => compareString(b.title || "", a.title || ""));
    default:
      return direction === "asc"
        ? notes.sort((a, b) => compareTime(a.createdAt, b.createdAt))
        : notes.sort((a, b) => compareTime(b.createdAt, a.createdAt));
  }
}

export function sortFoldersByUidAsc(folders: Folder[]) {
  return folders.sort((f1, f2) => compareUidsV7(f1.id, f2.id));
}
