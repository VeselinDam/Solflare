import { get, setToken } from "../client/apiClient";
import { expect } from 'expect';
import { saveResponse } from "../../utils/fileUtils";

describe("Solana API tests", () => {

    const BASE_PATH = "/v3/portfolio/tokens/HuiTegTpNAU7EJXvn95HKEWBdFMtWZYko4yoFVQyCKUS";

    before(() => {
        setToken();
    });

    it("should test Devnet Token Validation", async () => {
        type TokenAccount = {
            name: string;
            mint: string;
            totalUiAmount: number;
            price: {
                price: number;
            };
            coingeckoId: string | null;
        }

        const response = await get(BASE_PATH,
            {
                params: { network: "devnet" }
            }
        );

        expect(response.status).toBe(200);

        const tokens = response.body.tokens as TokenAccount[];
        const tokensNames: string[] = tokens.map((token: TokenAccount) => token.name);
        const tokensMints: string[] = tokens.map((tokenMint: TokenAccount) => tokenMint.mint);
        const tokensTotalUiAmounts: number[] = tokens.map((tokenAmount: TokenAccount) => tokenAmount.totalUiAmount);
        const tokensPrices: number[] = tokens.filter((token: TokenAccount) => token.price).map((t: TokenAccount) => t.price!.price);
        const tokensCoingeckoIds: (string | null)[] = tokens.map((tokenCoingeckoId: TokenAccount) => tokenCoingeckoId.coingeckoId);

        expect(tokensNames).toContain("Solana");
        expect(tokensNames.length).toBeGreaterThan(1);
        expect(tokensMints.length).toBeGreaterThan(0);
        expect(tokensMints.every((mint => typeof mint === "string" && mint.trim() !== ""))).toBe(true);
        expect(tokensTotalUiAmounts.every(totalUiAmount => typeof totalUiAmount === "number" && !isNaN(totalUiAmount))).toBe(true);
        expect(tokensTotalUiAmounts.every(totalUiAmount => totalUiAmount >= 0)).toBe(true);
        expect(tokensCoingeckoIds.every(coingeckoId => coingeckoId === null || typeof coingeckoId === "string")).toBe(true);
        expect(tokensPrices.length).toBeGreaterThan(0);
        expect(tokensPrices.every(price => typeof price === "number" && !isNaN(price) && price >= 0)).toBe(true);
    });

    it("should test SOL Token Validation when the network parameter is not provided", async () => {
        const response = await get(BASE_PATH);
        const body = response.body.tokens;

        expect(response.status).toBe(200);

        const tokenSol = body.find((item: { symbol: string; }) => item.symbol === "SOL");

        expect(tokenSol.name).toBe("Solana");
        expect(tokenSol.symbol).toBe("SOL");
        expect(tokenSol.mint).toBe("11111111111111111111111111111111");
        expect(tokenSol.totalUiAmount).toBeGreaterThanOrEqual(0);
        expect(tokenSol.price).toBeDefined();
        expect(Object.keys(tokenSol.price)).toEqual(["price", "change", "usdPrice", "usdChange", "liquidity", "volume24h", "volumeChange24h", "mc", "currency"]);
    });

    it("should break API", async () => {
        const response = await get(BASE_PATH,
            { params: { network: "green" } }
        );
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('\"network\" must be one of [mainnet, devnet, testnet]');
    });

    it("should verify that switching from mainnet to devnet and back to mainnet restores the original response.", async () => {
        type Token = {
            name?: string;
        };

        const mainnetResponse1 = await get(BASE_PATH, { params: { network: "mainnet" } });
        expect(mainnetResponse1.status).toBe(200);
        const devnetResponse = await get(BASE_PATH, { params: { network: "devnet" } });
        expect(devnetResponse.status).toBe(200);

        await saveResponse("mainnet-response-1", mainnetResponse1.body);

        const keyOf = (type: Token) =>
            (type.name ?? "").toLowerCase().trim();

        const mainKeys = new Set<string>(mainnetResponse1.body.tokens.map(keyOf).filter(Boolean));
        const devKeys = new Set<string>(devnetResponse.body.tokens.map(keyOf).filter(Boolean));

        const extrasOnDevnet: string[] = [];
        for (const key of devKeys) {
            if (!mainKeys.has(key)) extrasOnDevnet.push(key);
        }

        expect(extrasOnDevnet.length).toBeGreaterThan(0);

        const mainnetResponse2 = await get(BASE_PATH, { params: { network: "mainnet" } });
        expect(mainnetResponse2.status).toBe(200);

        await saveResponse("mainnet-response-2", mainnetResponse2.body);

        expect(mainnetResponse2.body).toEqual(mainnetResponse1.body);
    });
});
