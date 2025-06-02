import orm from "../../server";
import { UsersSexualPreferencesCreate } from "../orm/schema";

export class userSexualPreferencesModel {
  static async createSexualPreferences(
    newSexualPreferences: UsersSexualPreferencesCreate
  ) {
    const res = await orm?.create<"users_sexual_preferences">(
      "users_sexual_preferences",
      newSexualPreferences
    );
    return res;
  }

  static async readSexualPreferences(key?: string, value?: string | number) {
    const res = await orm?.read<"users_sexual_preferences", string>(
      "users_sexual_preferences",
      key,
      value
    );
    return res;
  }

  static async updateSexualPreferences(
    id: number,
    updateData: Partial<UsersSexualPreferencesCreate>
  ) {
    const res = await orm?.update<"users_sexual_preferences">(
      "users_sexual_preferences",
      id,
      updateData
    );
    return res;
  }

  static async deleteSexualPreferences(id: number) {
    const res = await orm?.delete<"users_sexual_preferences">(
      "users_sexual_preferences",
      id
    );
    return res;
  }
}
