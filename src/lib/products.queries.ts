import { queryOptions, useQuery } from "@tanstack/react-query";
import { listProducts, checkIsAdmin } from "./products.functions";
import { rowToProduct, type Product, type ProductRow } from "./products";

export const productRowsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const isAdminQueryOptions = queryOptions({
  queryKey: ["is-admin"],
  queryFn: () => checkIsAdmin(),
  retry: false,
});

export function useProductRows() {
  const { data, isLoading } = useQuery(productRowsQueryOptions);
  return { rows: (data ?? []) as unknown as ProductRow[], isLoading };
}

export function useProducts(): { products: Product[]; isLoading: boolean } {
  const { rows, isLoading } = useProductRows();
  return { products: rows.map(rowToProduct), isLoading };
}
