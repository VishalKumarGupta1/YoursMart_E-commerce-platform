import { useEffect } from "react";

const DEFAULT_TITLE = "YoursMart — Modern Luxury, Considered";

const setMetaContent = (name, content) => {
  let tag = document.head.querySelector(`meta[name="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

export default function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMetaContent("description", description);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description]);
}
