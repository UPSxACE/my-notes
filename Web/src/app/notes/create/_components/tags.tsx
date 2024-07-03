import { useCallback, useState } from "react";
import { ReactTags, TagSuggestion } from "react-tag-autocomplete";
import "./tags.css";

const suggestions: TagSuggestion[] = [
  { label: "nextjs", value: "Nextjs" },
  { label: "React", value: "react" },
  { label: "Remix", value: "remix" },
  { label: "Vite", value: "vite" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Angular", value: "angular" },
  { label: "Ember", value: "ember" },
  { label: "Gatsby", value: "gatsby" },
  { label: "Astro", value: "astro" },
];

export default function Tags() {
  const [selected, setSelected] = useState<TagSuggestion[]>([]);

  const onAdd = useCallback(
    (newTag: TagSuggestion) => {
      setSelected([...selected, newTag]);
    },
    [selected]
  );

  const onDelete = useCallback(
    (tagIndex: number) => {
      setSelected(selected.filter((_, i) => i !== tagIndex));
    },
    [selected]
  );

  return (
    <section className="py-3 px-6">
      <div className="flex items-center mb-2">
        <span className="font-bold text-base">Tags</span>
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
