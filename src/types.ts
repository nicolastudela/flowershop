export enum ITEMS_NAMES {
  ROSES = "ROSES",
  LILIES = "LILIES",
  TULIPS = "TULIPS",
}

export interface Bundle {
  units: number;
  cost: number; 
}

export interface Item {
  name: ITEMS_NAMES;
  code: string;
  unitCost: number;
  bundlesOptions: Bundle[]
}

export interface OrderItem {
  code: string;
  count: number;
}

export interface Order {
  code: string,
  items: OrderItem[];
}


export type ResultBundle = Bundle & { count: number };
export interface BilledItem {
  code: string;
  resultBundles: ResultBundle[] | null;
  cost: number;
}

export interface Bill {
  totalAmount: number;
  billedItems: BilledItem[];
}
