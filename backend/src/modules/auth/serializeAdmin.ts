import { Admin } from "../admins/admin.validations";

export async function serializeAdmin(admin: Admin) {
      return {
            id: admin.id,
            clerkId: admin.clerkId,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            profileImageUrl: admin.profileImgUrl,
            isActive: admin.isActive,
      };
}
