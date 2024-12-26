import { describe, expect, it } from '@jest/globals';
import { getAssistants } from "@/utils/database";

describe('getAssistants', () => {
  it('should return assistants', async () => {
    const { assistants } = await getAssistants();

    expect(assistants.length).toBeGreaterThan(0);
  });
});