import { randomUUID } from "node:crypto";
import { guideRepository } from "../repositories/guideRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { generateGuidePdf } from "./guidePdf.js";
import type {
  Guide,
  GuideInput,
  GuideRecipient,
  GuideParcel,
  CourierType,
} from "../models/types.js";
import { COURIER_TYPES } from "../models/types.js";

const GUIDE_COST = 30;

const COURIER_PREFIX: Record<CourierType, string> = {
  cargo_expreso: "CE",
  forza: "FZ",
  guatex: "GX",
  mock: "MOCK",
};

function buildTrackingNumber(courier: CourierType): string {
  const prefix = COURIER_PREFIX[courier] ?? "MOCK";
  const year = new Date().getFullYear();
  const random = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

export function createGuide(userId: string, input: GuideInput): Guide {
  const recipient: GuideRecipient = { ...input.recipient };
  const parcel: GuideParcel = { ...input.parcel };

  const guide: Guide = {
    id: randomUUID(),
    userId,
    trackingNumber: buildTrackingNumber(input.courier),
    courier: input.courier,
    recipient,
    parcel,
    status: "created",
    cost: GUIDE_COST,
    pdf: Buffer.alloc(0),
    createdAt: new Date().toISOString(),
    isCancelled: false,
  };

  const pdf = generateGuidePdf(guide);
  guide.pdf = pdf;

  userRepository.updateBalance(userId, -GUIDE_COST);
  return guideRepository.create(guide);
}

export function getGuide(id: string): Guide | undefined {
  return guideRepository.findById(id);
}

export function listGuides(userId: string): Guide[] {
  return guideRepository.findByUser(userId);
}

export function cancelGuide(id: string, userId: string): Guide | undefined {
  const guide = guideRepository.findById(id);
  if (!guide || guide.userId !== userId) return undefined;
  if (guide.isCancelled) return guide;
  guide.isCancelled = true;
  guideRepository.update(guide);
  return guide;
}

export function isValidCourier(courier: string): courier is CourierType {
  return COURIER_TYPES.includes(courier as CourierType);
}