import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import ProductService from "../service/ProductService";
import ProductCard from "../components/Product/ProductCard";
import { Pager, Product, SortType } from "../types";
import SortListbox from "../components/shared/SortListbox";
import LimitListbox from "../components/shared/LimitListbox";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { getPager } from "../utils";
import Pagination from "../components/shared/Pagination";

async function getInitialProps({ query }: NextPageContext) {
  const { sort = "asc", limit = "5", page = "1", category } = query;
  const categories = await ProductService.getCategories();
  let products = [];
  const options = {
    // limit: limit as string,
    sort: sort as SortType,
  };
  if (!category) products = await ProductService.getAllProducts(options);
  else
    products = await ProductService.getCategoryProducts(
      category as string,
      options
    );
  const pager = getPager(
    products.length,
    parseInt(limit as string, 10),
    parseInt(page as string, 10)
  );

  const filtered = products.slice(pager.startIndex, pager.endIndex + 1);

  return {
    products: products.length > 0 ? filtered : [],
    categories,
    category: category as string,
    limit: limit as string,
    sort: sort as SortType,
    pager,
  };
}

type HomeProps = {
  products: Product[];
  categories: string[];
  sort: SortType;
  limit: string;
  category: string | undefined;
  pager: Pager;
};

const Home: NextPage<HomeProps> = (props) => {
  const {
    products = [],
    categories = [],
    sort,
    limit,
    category,
    pager,
  } = props;
  const router = useRouter();

  const handleParams = useCallback(
    (param: string) => (value: string) => {
      let page = pager.currentPage.toString();
      const resetPage =
        param === "limit" &&
        pager.totalPages * parseInt(value, 10) > pager.totalItems;

      if (resetPage) page = "1";

      const qs = new URLSearchParams({
        sort,
        limit,
        ...(category && { category }),
        page,
        [param]: value,
      });

      router.push(`/?${qs.toString()}`);
    },
    [
      limit,
      pager.currentPage,
      pager.totalItems,
      pager.totalPages,
      router,
      sort,
      category,
    ]
  );

  const disablePrev = useMemo(
    () => pager.currentPage === 1,
    [pager.currentPage]
  );
  const disableNext = useMemo(
    () => pager.currentPage === pager.endPage,
    [pager.currentPage, pager.endPage]
  );

  const showPagination = !(disableNext && disablePrev);

  return (
    <main>
      <div className="w-full p-8">
        <div className="flex items-center justify-end">
          <SortListbox value={sort} onChange={handleParams("sort")} />
          <LimitListbox value={limit} onChange={handleParams("limit")} />
        </div>
        <div className="flex items-center">
          <p className="m-4">Categorie:</p>
          <nav className="flex gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/?category=${encodeURIComponent(category)}`}
              >
                <a className="p-2 bg-gray-100 rounded-md hover:bg-sky-400 hover:text-white">
                  {category}
                </a>
              </Link>
            ))}
          </nav>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        {showPagination && (
          <Pagination
            onNext={() => handleParams("page")(`${pager.currentPage + 1}`)}
            onPrev={() => handleParams("page")(`${pager.currentPage - 1}`)}
            disablePrev={disablePrev}
            disableNext={disableNext}
          />
        )}
      </div>
    </main>
  );
};

Home.getInitialProps = getInitialProps;

export default Home;
