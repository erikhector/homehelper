// @ts-nocheck
/* eslint-disable */
/* eslint-disable prettier/prettier */
/******************************************\
* DO NOT EDIT, THIS CODE IS TOOL GENERATED *
* AND ANY CHANGES WILL BE OVERWRITTEN      *
\******************************************/

import * as Enums from "./Enums";
export interface AuthenticatedUserResponse {
    displayName: string;
    email: string;
    userId: number;
}
export interface Child {
    childId: number;
    firstName: string;
    items: Item[];
    lastName: string | null;
    parentLinks: ParentChildLink[];
}
export interface CreateChildRequest {
    firstName: string;
    lastName: string | null;
}
export interface CreateItemRequest {
    category: string;
    name: string;
}
export interface CreateItemTemplateRequest {
    name: string;
}
export interface Item {
    category: string;
    child: Child;
    childId: number;
    homeQuantity: number;
    itemId: number;
    kindergartenQuantity: number;
    name: string;
}
export interface ItemTemplate {
    createdByUser: (User | null);
    createdByUserId: number | null;
    entries: ItemTemplateEntry[];
    itemTemplateId: number;
    name: string;
}
export interface ItemTemplateEntry {
    category: string;
    itemTemplate: ItemTemplate;
    itemTemplateEntryId: number;
    itemTemplateId: number;
    name: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface ParentChildLink {
    child: Child;
    childId: number;
    createdAt: string;
    parentChildLinkId: number;
    role: Enums.ParentChildRole;
    user: User;
    userId: number;
}
export interface Placeholder {
    name: string;
    placeholderId: number;
}
export interface PlaceholderCreate {
    name: string;
}
export interface RegisterRequest {
    displayName: string;
    email: string;
    password: string;
}
export interface ShareChildRequest {
    email: string;
}
export interface UpdateDisplayNameRequest {
    displayName: string;
}
export interface UpdateItemQuantitiesRequest {
    homeQuantity: number;
    kindergartenQuantity: number;
}
export interface User {
    childLinks: ParentChildLink[];
    createdAt: string;
    displayName: string;
    email: string;
    itemTemplates: ItemTemplate[];
    lastLoginAt: string | null;
    normalizedEmail: string;
    passwordHash: string;
    userId: number;
}
