import { AppError } from "../../utils/http";
import { getPaginationMeta, Pagination } from "../../utils/pagination";
import { getMediaById } from "../media/models/media.queries";
import { getMediaCollectionById } from "../media-collections/models/media-collection.queries";
import {
      insertMediaCollectionItem,
      getMediaCollectionItems,
      countMediaCollectionItems,
      getMediaCollectionItem,
      deleteMediaCollectionItem,
} from "./models/media-collection-item.queries";
import { CreateMediaCollectionItemDTO } from "./media-collection-items.validations";

export const toMediaCollectionItemResponse = (item: any) => item;

export const createMediaCollectionItemService = async (
      data: CreateMediaCollectionItemDTO,
) => {
      // verify collection exists
      if (!(await getMediaCollectionById(data.collectionId))) {
            throw new AppError(
                  400,
                  "collectionId must reference existing collection",
            );
      }
      // verify media exists
      if (!(await getMediaById(data.mediaId))) {
            throw new AppError(400, "mediaId must reference existing media");
      }
      const item = await insertMediaCollectionItem(data);
      return toMediaCollectionItemResponse(item);
};

export const listMediaCollectionItemsService = async (
      pagination: Pagination,
) => {
      const [items, total] = await Promise.all([
            getMediaCollectionItems(pagination),
            countMediaCollectionItems(),
      ]);
      return {
            items: items.map(toMediaCollectionItemResponse),
            pagination: getPaginationMeta(pagination, total),
      };
};

export const getMediaCollectionItemService = async (
      collectionId: string,
      mediaId: string,
) => {
      const item = await getMediaCollectionItem(collectionId, mediaId);
      if (!item) {
            throw new AppError(404, "Media collection item not found");
      }
      return toMediaCollectionItemResponse(item);
};

export const deleteMediaCollectionItemService = async (
      collectionId: string,
      mediaId: string,
) => {
      const existing = await getMediaCollectionItem(collectionId, mediaId);
      if (!existing) {
            throw new AppError(404, "Media collection item not found");
      }
      await deleteMediaCollectionItem(collectionId, mediaId);
};
