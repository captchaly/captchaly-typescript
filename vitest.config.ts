import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		testTimeout: 600_000,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: ["test/**"],
		},
	},
});
