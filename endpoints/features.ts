import { Context } from "hono";
import { getListOfFeatures } from "../caniuse/browsercompat.ts";

export function listAllFeatures(context: Context) {
    const allVersions = getListOfFeatures();
    return context.json(allVersions, 200, { "Content-Type": "application/json" });
}
