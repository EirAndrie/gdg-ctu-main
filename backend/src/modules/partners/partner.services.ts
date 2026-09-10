import { AppError } from "../../utils/http";
import { getPaginationMeta, Pagination } from "../../utils/pagination";
import { getMediaById } from "../media/models/media.queries";
import {
      countPartners,
      deletePartner,
      getActivePartners,
      getPartnerById,
      getPartnerBySlug,
      getPartners,
      insertPartner,
      updatePartner,
} from "./models/partner.queries";
import { CreatePartnerDTO, UpdatePartnerDTO } from "./partner.validations";

export const createPartnerService = async (data: CreatePartnerDTO) => {
      if (await getPartnerBySlug(data.slug)) {
            throw new AppError(409, "Partner slug already exists");
      }

      if (data.logoMediaId && !(await getMediaById(data.logoMediaId))) {
            throw new AppError(400, "logoMediaId must reference existing media");
      }

      return insertPartner({ ...data, updatedAt: new Date() });
};

export const getPartnersService = async (pagination: Pagination) => {
      const [partnerList, total] = await Promise.all([
            getPartners(pagination),
            countPartners(),
      ]);

      return {
            partners: partnerList,
            pagination: getPaginationMeta(pagination, total),
      };
};

export const getPartnerByIdService = async (id: string) => {
      const partner = await getPartnerById(id);
      if (!partner) {
            throw new AppError(404, "Partner not found");
      }
      return partner;
};

export const getPartnerBySlugService = async (slug: string) => {
      const partner = await getPartnerBySlug(slug);
      if (!partner) {
            throw new AppError(404, "Partner not found");
      }
      return partner;
};

/** Public feed: active only, tier-ordered. Safe fields (no internal IDs beyond slug). */
export const getPublicPartnersService = async () => getActivePartners();

export const updatePartnerService = async (
      id: string,
      data: UpdatePartnerDTO,
) => {
      const partner = await getPartnerById(id);
      if (!partner) {
            throw new AppError(404, "Partner not found");
      }

      if (data.slug && data.slug !== partner.slug) {
            const existing = await getPartnerBySlug(data.slug);
            if (existing) {
                  throw new AppError(409, "Partner slug already exists");
            }
      }

      if (data.logoMediaId && !(await getMediaById(data.logoMediaId))) {
            throw new AppError(400, "logoMediaId must reference existing media");
      }

      return updatePartner(id, { ...data, updatedAt: new Date() });
};

export const deletePartnerService = async (id: string) => {
      const partner = await getPartnerById(id);
      if (!partner) {
            throw new AppError(404, "Partner not found");
      }

      await deletePartner(id);
};
