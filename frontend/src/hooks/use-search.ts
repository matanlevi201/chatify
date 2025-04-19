import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface UseSearchProps {
  callback: () => void | Promise<void>;
  debounce?: number;
}

export function useSearch({ callback, debounce = 300 }: UseSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, debounce);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!debouncedQuery) return;
    const fetchResults = async () => {
      setIsSearching(true);
      try {
        await callback();
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  return { searchQuery, debouncedQuery, isSearching, setSearchQuery };
}
