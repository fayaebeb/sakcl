import { z } from "zod";

import Loader from "@/components/loader";
import { defineTool } from "@/llm/ai-helpers";
import { withTextGeneration } from "@/llm/with-text-generation";
import { updateUser } from "@/sdk/auth0/mgmt";
import { getUser } from "@/sdk/fga";

/**
 * This tool allows the user to set their first name and/or last name.
 * The changes are propagated to the Auth0's user profile.
 */
export default defineTool("set_profile_attributes", async () => {
  return {
    description: `Allows the user to set their first name and/or last name.
    `,
    parameters: z.object({
      givenName: z.string().optional().describe("The first name of the user"),
      familyName: z.string().optional().describe("The last name of the user"),
    }),
    generate: withTextGeneration(
      {},
      async function* ({ givenName, familyName }: { givenName?: string; familyName?: string }) {
        yield <Loader />;

        const user = await getUser();
        await updateUser(user.sub, { givenName, familyName });

        return `
        Your profile has been updated successfully.
        ${givenName ? `Your first name is now ${givenName}.` : ""}
        ${familyName ? `Your last name is now ${familyName}.` : ""}
  `;
      }
    ),
  };
});
