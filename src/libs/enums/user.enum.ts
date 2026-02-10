import { registerEnumType } from "@nestjs/graphql";
import { register } from "module";

export enum UserRole {
  USER = 'USER',       // Oddiy foydalanuvchi
  AUTHOR = 'AUTHOR',   // Kitob qo'shadigan muallif
  ADMIN = 'ADMIN',     // Administrator
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BLOCK = "BLOCK",
    DELETED = "DELETED",
} 
registerEnumType(UserStatus, {
    name: "UserStatus",
});

export enum UserAuthType {
    PHONE = "PhONE",
    EMAIL = "EMAIL"
}
registerEnumType(UserAuthType, {
    name: "UserAuthType",
});