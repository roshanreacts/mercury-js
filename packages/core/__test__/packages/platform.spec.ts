import mercury from "../../src/mercury";
import platform from "../../src/packages/platform";

describe("platform", () => {
    it("should be able to create a platform instance", () => {
        const platformApp = platform();
        platformApp(mercury);
        expect(mercury.platform).toBeDefined();
    });
});