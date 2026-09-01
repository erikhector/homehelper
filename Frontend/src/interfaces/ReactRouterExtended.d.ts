import { useLocation } from "react-router";

import type { Location } from "react-router";

/**
 * Adds generic parameter to useLocation for state object.
 * This was possible with type definitions for react-router v5 but was removed in v6.
 */
declare module "react-router" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export declare function useLocation<T = any>(): Location<null | T>;
}
