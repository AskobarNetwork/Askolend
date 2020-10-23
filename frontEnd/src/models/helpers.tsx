import { Token } from "./tokens";

export interface SupplyToken {
    key: string;
    title: string;
    token: Token;
    apy: string;
    wallet: string;
    balance: string;
    lowRisk: boolean;
}
