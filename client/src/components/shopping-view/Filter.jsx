import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import TuneIcon from "@mui/icons-material/Tune";
import { brands, categories } from "../../Utility/Constant";

const FilterGroup = ({ title, options, selected, onToggle }) => (
  <div className="border-t border-line py-5 first:border-t-0 first:pt-0">
    <div className="flex items-baseline justify-between">
      <h3 className="text-[10px] uppercase tracking-[0.28em] text-ink">
        {title}
      </h3>
      <span className="text-[10px] text-stone">{selected.length}</span>
    </div>

    <div className="lux-scroll mt-3 max-h-64 space-y-0.5 overflow-y-auto pr-2">
      {options.map((name) => (
        <label
          key={name}
          className="group flex cursor-pointer items-center gap-3 py-2"
        >
          <input
            type="checkbox"
            checked={selected.includes(name)}
            onChange={() => onToggle(name)}
            className="peer sr-only"
          />
          <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-line bg-white text-transparent transition-colors duration-200 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne">
            <CheckIcon sx={{ fontSize: 11 }} />
          </span>
          <span className="text-sm text-stone transition-colors duration-200 peer-checked:text-ink group-hover:text-ink">
            {name}
          </span>
        </label>
      ))}
    </div>
  </div>
);

const ProductFilter = ({ filter, setFilter }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const selectedCategories = filter?.category || [];
  const selectedBrands = filter?.brand || [];
  const activeCount = selectedCategories.length + selectedBrands.length;

  useEffect(() => {
    if (filter) {
      sessionStorage.setItem("filters", JSON.stringify(filter));
    }
  }, [filter]);

  const handleToggle = (key, value) => {
    setFilter((prev) => {
      const safePrev = prev || { category: [], brand: [] };
      const current = safePrev[key] || [];
      return {
        ...safePrev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleClear = () => setFilter({ category: [], brand: [] });

  return (
    <div className="lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-expanded={mobileOpen}
        className="flex w-full items-center justify-between border border-line bg-white px-5 py-4 lg:hidden"
      >
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-ink">
          <TuneIcon sx={{ fontSize: 16 }} />
          Filters
        </span>
        <span className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[10px] text-ivory">
              {activeCount}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-[0.2em] text-stone">
            {mobileOpen ? "Hide" : "Show"}
          </span>
        </span>
      </button>

      <div
        className={`mt-4 border border-line bg-white p-6 lg:mt-0 lg:block ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl leading-none text-ink">
              Refine
            </h2>
            <p className="mt-2 text-xs text-stone">
              {activeCount > 0
                ? `${activeCount} filter${activeCount > 1 ? "s" : ""} applied`
                : "Narrow the edit"}
            </p>
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="border-b border-ink pb-0.5 text-[9px] uppercase tracking-[0.22em] text-ink transition-colors hover:text-burgundy"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-6">
          <FilterGroup
            title="Category"
            options={categories}
            selected={selectedCategories}
            onToggle={(value) => handleToggle("category", value)}
          />
          <FilterGroup
            title="Brand"
            options={brands}
            selected={selectedBrands}
            onToggle={(value) => handleToggle("brand", value)}
          />
        </div>

        <div className="border-t border-line pt-5">
          <p className="font-display text-lg text-ink">Personal styling</p>
          <p className="mt-2 text-xs leading-relaxed text-stone">
            Unsure where to begin? Our stylists can help you find the right
            piece for the occasion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
