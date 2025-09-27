// as const = readonly, 값 고정

const BUTTON_LABELS = {
  save: "저장",
};

BUTTON_LABELS.save = "저장하세요";
type SaveLabel = typeof BUTTON_LABELS.save;

const BUTTON_LABELS2 = {
  save: "저장",
} as const;

// BUTTON_LABELS2.save = "저장하세요"
type SaveLabel2 = typeof BUTTON_LABELS2.save;

const LIST = ["a", "b", "c"] as const;

LIST.map((item) => {
  if (item === "b") {
    return item;
  }
});

const LIST2 = [...LIST, "d"] as const;

// satisfies
type RouteName = "home" | "orders" | "settings";
type Icon = "home" | "card" | "gear";

type RouteMap = Record<
  RouteName,
  {
    path: `/${RouteName}`;
    icon: Icon;
  }
>;

const routeMap = {
  home: {
    path: "/home",
    icon: "home",
  },
  orders: {
    path: "/orders",
    icon: "card",
  },
  settings: {
    path: "/settings",
    icon: "gear",
  },
} satisfies RouteMap;

export const EVENTS = ["view_item", "add_to_cart", "purchase"] as const;

type EventName = (typeof EVENTS)[number];

function track(event: EventName) {
  /* ... */
}

track("view_item");
// track("pay"); // (X) 존재하지 않는 이벤트

type EventMap = Record<"view_item" | "add_to_cart" | "purchase", number>;

const EVENT_WEIGHTS = {
  view_item: 1,
  add_to_cart: 2,
  purchase: 5,
} satisfies EventMap;

EVENT_WEIGHTS.purchase = 6;
EVENT_WEIGHTS.view_item = 7;

// 값을 고정하고 그대로 추론된 값을 사용하겠다 = as const
// 값은 수정가능하나, 추론된 값도 사용하겠다 = satisfies
