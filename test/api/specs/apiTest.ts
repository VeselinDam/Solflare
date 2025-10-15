import { expect } from "chai";
import { v4 as uuidv4 } from 'uuid';
import { api } from "../client";

describe("Solana API tests", () => {
    const authUuid = uuidv4();
    const bearerToken = `Bearer ${authUuid}`;
    
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
        const response = await api.get("/v3/portfolio/tokens/HuiTegTpNAU7EJXvn95HKEWBdFMtWZYko4yoFVQyCKUS?network=devnet",
            {
                headers: { Authorization: bearerToken }
            });

        expect(response.status).to.eq(200);

        const tokens = response.data.tokens as TokenAccount[];
        const tokensNames: string[] = tokens.map((token: TokenAccount) => token.name);
        const tokensMints: string[] = tokens.map((tokenMint: TokenAccount) => tokenMint.mint);
        const tokensTotalUiAmounts: number[] = tokens.map((tokenAmount: TokenAccount) => tokenAmount.totalUiAmount);
        const tokensPrices: number[] = tokens.filter((token: TokenAccount) => token.price).map((t: TokenAccount) => t.price!.price);
        const tokensCoingeckoIds: (string | null)[] = tokens.map((tokenCoingeckoId: TokenAccount) => tokenCoingeckoId.coingeckoId);

        expect(tokensNames).to.include("Solana");
        expect(tokensNames.length).to.be.greaterThan(1);
        expect(tokensMints.length).to.be.greaterThan(0);
        expect(tokensMints.every((mint => typeof mint === "string" && mint.trim() !== ""))).to.be.true;
        expect(tokensTotalUiAmounts.every(totalUiAmount => typeof totalUiAmount === "number" && !isNaN(totalUiAmount))).to.be.true;
        expect(tokensTotalUiAmounts.every(totalUiAmount => totalUiAmount >= 0)).to.be.true;
        expect(tokensCoingeckoIds.every(coingeckoId => coingeckoId === null || typeof coingeckoId === "string")).to.be.true;
        expect(tokensPrices.length).to.be.greaterThan(0);
        expect(tokensPrices.every(price => typeof price === "number" && !isNaN(price) && price >= 0)).to.be.true;
    });
});
