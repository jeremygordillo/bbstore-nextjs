import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="w-full fixed flex h-14 px-6 items-center bg-sky-500 shadow-lg z-10">
        <p className="font-bold text-2xl text-white flex-grow">
          <Link href="/">
            <a>BB Store</a>
          </Link>
        </p>
      </div>
      <div className="h-14" />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
