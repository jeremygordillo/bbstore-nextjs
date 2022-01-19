import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import ProducDetails from "../../components/Product/ProductDetails";
import ProductService from "../../service/ProductService";
import { Product } from "../../types";

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ id: string }>) {
  const product = await ProductService.getProduct(params!.id);

  if (!product) {
    throw new Error(`Product with id '${params!.id}' not found`);
  }

  return {
    props: {
      ...product,
    },
    revalidate: 200,
  };
}

export async function getStaticPaths() {
  const products: Product[] = await ProductService.getAllProducts();

  return {
    paths: products.map((product: any) => `/product/${product.id}`),
    fallback: "blocking", // da verificare
  };
}

type ProductDetailsProps = Product;

const ProductDetails = (props: ProductDetailsProps) => {
  const router = useRouter();

  return router.isFallback ? <p>Loading...</p> : <ProducDetails {...props} />;
};

export default ProductDetails;
