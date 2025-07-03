import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { warningToast } from "./toast";

interface PageProps {
  fetchError: FetchBaseQueryError | SerializedError | undefined;
  tokenName: string
}

export default function FetchErrorCheck({ fetchError, tokenName }: PageProps) {
  if (fetchError && "status" in fetchError) {
    if (fetchError.status === 401) {
      warningToast("session expired! logging out");
      localStorage.removeItem(tokenName);
      return true;
    }
  }

  return false;
}
