import { Folder } from "@/gql/graphql.schema";

// Returns -1 if before, 1 if after, 0 if equal. (ascending)
export function compareUidsV7(id1: string, id2: string) {
  return id1.localeCompare(id2);
}

type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any;
};

function sortByTimeAsc<T>(
  data: T[],
  datePropertyName: KeyOfType<T, Date>,
  uidPropertyName: KeyOfType<T, string>
): T[] {
  return data.sort((a, b) => {
    const _a: Date = a[datePropertyName] as Date;
    const _aId: string = a[uidPropertyName] as string;
    const _b: Date = b[datePropertyName] as Date;
    const _bId: string = b[uidPropertyName] as string;
    let comparison = _a.getTime() - _b.getTime();
    if (comparison === 0) comparison = compareUidsV7(_aId, _bId);

    return comparison;
  });
}

function sortByTimeDesc<T>(
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

export function sortFoldersByUidAsc(folders: Folder[]) {
  return folders.sort((f1, f2) => compareUidsV7(f1.id, f2.id));
}
