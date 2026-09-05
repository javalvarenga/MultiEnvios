import type { Guide } from "../models/types.js";

const guides: Guide[] = [];

export const guideRepository = {
  create(guide: Guide): Guide {
    guides.push(guide);
    return guide;
  },
  findById(id: string): Guide | undefined {
    return guides.find((g) => g.id === id);
  },
  findByUser(userId: string): Guide[] {
    return guides.filter((g) => g.userId === userId);
  },
};