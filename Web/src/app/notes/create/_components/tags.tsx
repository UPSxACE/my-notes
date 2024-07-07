import { ReactState } from "@/utils/react-state-type";
import { useCallback } from "react";
import { ReactTags, TagSuggestion } from "react-tag-autocomplete";
import "./tags.css";
import useQueryTags from "./use-query-tags";

type Props = {
  state: ReactState<TagSuggestion[]>;
};

export default function Tags(props: Props) {
  const [selected, setSelected] = props.state;

  const { data } = useQueryTags();
  const suggestions: TagSuggestion[] = (data || []).map((x) => ({
    label: x.name,
    value: x.name,
  }));
  // .filter((x) => !selected.some((y) => x.value == y.value));

  const onAdd = useCallback(
    (newTag: TagSuggestion) => {
      setSelected([...selected, newTag]);
    },
    [selected, setSelected]
  );

  const onDelete = useCallback(
    (tagIndex: number) => {
      setSelected(selected.filter((_, i) => i !== tagIndex));
    },
    [selected, setSelected]
  );

  return (
    <section className="py-3 px-6">
      <div className="flex items-center mb-2">
        <span className="font-bold text-sm">Tags</span>
      </div>
      <div>
        <ReactTags
          labelText="Select tags"
          selected={selected}
          suggestions={suggestions}
          onAdd={onAdd}
          onDelete={onDelete}
          noOptionsText="No matching tags"
          allowNew
        />
      </div>
    </section>
  );
}
