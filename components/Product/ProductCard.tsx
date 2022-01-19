import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../types";

type ProductCardProps = Product;

const ProductCard = ({
  id,
  image,
  description,
  price,
  title,
}: ProductCardProps) => {
  return (
    <Link href={`/product/${id}`}>
      <a className="col-span-full sm:col-span-3 lg:col-span-2 xl:col-span-1 h-full">
        <div className="mb-2 p-10 shadow-lg bg-white rounded-xl">
          <Image
            src={image}
            alt={description}
            width={655}
            height={937}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col p-4">
          <div className="h-12 overflow-hidden mb-2">
            <p>{title}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">$ {price}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard;
