import { Admin } from "../admins/admin.validations";

export async function serializeAdmin(admin: Admin) {
      return {
            id: admin.id,
            email: admin.email,
            isActive: admin.isActive,
      };
}
