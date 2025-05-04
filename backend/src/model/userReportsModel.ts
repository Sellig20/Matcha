import orm from '../../server'
import { UsersReportsCreate } from '../orm/schema';

export class userReportsModel {
    static async createReports(newReports: UsersReportsCreate) {
        const res = await orm?.create<"users_reports">("users_reports", newReports)
        return res;
    }

    static async readReports(key?: string, value?: string | number) {
        const res = await orm?.read<"users_reports">("users_reports", key, value)
        return res;
    }

    static async updateReports(id: number, updateData: Partial<UsersReportsCreate>) {
        const res = await orm?.update<"users_reports">("users_reports", id, updateData)
        return res;
    }

    static async deleteReports(id: number) {
        const res = await orm?.delete<"users_reports">("users_reports", id)
        return res;
    }
}