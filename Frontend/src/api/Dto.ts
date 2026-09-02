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
    activeItemTemplate: (ItemTemplate | null);
    activeItemTemplateId: number | null;
    childId: number;
    firstName: string;
    items: Item[];
    itemTemplates: ItemTemplate[];
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
export interface Item {
    category: string;
    child: Child;
    childId: number;
    homeQuantity: number;
    itemId: number;
    itemTemplateEntry: (ItemTemplateEntry | null);
    itemTemplateEntryId: number | null;
    kindergartenQuantity: number;
    name: string;
}
export interface ItemTemplate {
    child: Child;
    childId: number;
    entries: ItemTemplateEntry[];
    itemTemplateId: number;
    name: string;
}
export interface ItemTemplateEntry {
    category: string;
    items: Item[];
    itemTemplate: ItemTemplate;
    itemTemplateEntryId: number;
    itemTemplateId: number;
    name: string;
    quantity: number;
}
export interface ItemTemplateEntryRequest {
    category: string;
    name: string;
    quantity: number;
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
export interface SaveItemTemplateRequest {
    entries: ItemTemplateEntryRequest[];
    name: string;
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
    lastLoginAt: string | null;
    normalizedEmail: string;
    passwordHash: string;
    userId: number;
}
