"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import path from "path";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";
const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("topic") || "";

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "topic",
          value: searchQuery,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === "/companions") {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["topic"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, router, searchParams, pathname]);
  return (
    <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 h-fit">
      <Image src="/icons/search.svg" alt="search" width={16} height={16} />
      <input
        placeholder=""
        className="outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
