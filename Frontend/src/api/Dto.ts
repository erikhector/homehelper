// @ts-nocheck
/* eslint-disable */
/* eslint-disable prettier/prettier */
/******************************************\
* DO NOT EDIT, THIS CODE IS TOOL GENERATED *
* AND ANY CHANGES WILL BE OVERWRITTEN      *
\******************************************/

import * as Enums from "./Enums";
export interface Child {
    childId: number;
    firstName: string;
    items: Item[];
    lastName: string | null;
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
    itemId: number;
    name: string;
    status: Enums.ItemStatus;
}
export interface Placeholder {
    name: string;
    placeholderId: number;
}
export interface PlaceholderCreate {
    name: string;
}
export interface UpdateItemStatusRequest {
    status: Enums.ItemStatus;
}
