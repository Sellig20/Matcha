import orm from "../../server";
import { UsersPicturesCreate } from "../orm/schema";

export class userPicturesModel {
  static async createPictures(newPictures: UsersPicturesCreate) {
    const res = await orm?.create<"users_pictures">(
      "users_pictures",
      newPictures
    );
    return res;
  }

  static async readPictures(key?: string, value?: string | number) {
    const res = await orm?.read<"users_pictures", string>(
      "users_pictures",
      key,
      value
    );
    return res;
  }

  static async updatePictures(
    id: number,
    updateData: Partial<UsersPicturesCreate>
  ) {
    const res = await orm?.update<"users_pictures">(
      "users_pictures",
      id,
      updateData
    );
    return res;
  }

  static async deletePictures(id: number) {
    const res = await orm?.delete<"users_pictures">("users_pictures", id);
    return res;
  }
}
