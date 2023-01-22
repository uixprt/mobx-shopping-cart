import { observer } from "mobx-react";
import { filtersStore as store } from "../store";

export const Filters: React.FC = observer(() => {
  return (
    <>
      <button onClick={store.clearAllFilters}>Clear All Filters</button>
      <label>
        Search:
        <input
          type="text"
          value={store.searchTerm}
          onChange={(e) => store.setSearchTerm(e.target.value)}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={store.priceRangeUnder50}
          onChange={(e) => store.setPriceRangeUnder50(e.target.checked)}
        />
        Price range under 50
      </label>
      <label>
        <input
          type="checkbox"
          checked={store.priceRange50to100}
          onChange={(e) => store.setPriceRange50to100(e.target.checked)}
        />
        Price range 50 to 100
      </label>
      <label>
        <input
          type="checkbox"
          checked={store.priceRangeOver100}
          onChange={(e) => store.setPriceRangeOver100(e.target.checked)}
        />
        Price range over 100
      </label>
      <label>
        Min rating:
        <select
          value={store.minRating}
          onChange={(e) => store.setMinRating(parseInt(e.target.value))}
        >
          <option value={0}>No minimum</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
      <label>
        Max rating:
        <select
          value={store.maxRating}
          onChange={(e) => store.setMaxRating(parseInt(e.target.value))}
        >
          <option value={5}>No maximum</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
    </>
  );
});
