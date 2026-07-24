export const SEARCH_TRANSITION_NAVIGATION_EVENT =
  "muas:transition-navigation";
export const SEARCH_ROUTE_READY_EVENT = "muas:route-ready";

export type SearchTransitionNavigationDetail = {
  href: string;
};

export function dispatchSearchTransitionNavigation(href: string) {
  window.dispatchEvent(
    new CustomEvent<SearchTransitionNavigationDetail>(
      SEARCH_TRANSITION_NAVIGATION_EVENT,
      {
        detail: { href },
      },
    ),
  );
}

export function dispatchSearchRouteReady(pathname: string) {
  window.dispatchEvent(
    new CustomEvent<{ pathname: string }>(SEARCH_ROUTE_READY_EVENT, {
      detail: { pathname },
    }),
  );
}
