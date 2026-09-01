// @ts-nocheck
/* eslint-disable */
/* eslint-disable prettier/prettier */
/******************************************\
* DO NOT EDIT, THIS CODE IS TOOL GENERATED *
* AND ANY CHANGES WILL BE OVERWRITTEN      *
\******************************************/

import _client from "./HttpClient";
import * as DTO from "./Dto";

export const createChild = async (request: DTO.CreateChildRequest): Promise<DTO.Child> => {
    return _client.httpFetch<DTO.Child>('POST', _client.resolveUrl(`/api/children`), request);
};

export const createItem = async (childId: number, request: DTO.CreateItemRequest): Promise<DTO.Item> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/items`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<DTO.Item>('POST', path.join(""), request);
};

export const getChildren = async (): Promise<DTO.Child[]> => {
    return _client.httpFetch<DTO.Child[]>('GET', _client.resolveUrl(`/api/children`));
};

export const getItems = async (childId: number): Promise<DTO.Item[]> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/items`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<DTO.Item[]>('GET', path.join(""));
};

export const getItemStatuses = async (): Promise<Enums.ItemStatus[]> => {
    return _client.httpFetch<Enums.ItemStatus[]>('GET', _client.resolveUrl(`/api/children/item-statuses`));
};

export const updateItemStatus = async (childId: number, itemId: number, request: DTO.UpdateItemStatusRequest): Promise<DTO.Item> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/items/${itemId}/status`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(itemId !== null && itemId !== undefined) {
        _queryParameters.push(`itemId=${encodeURIComponent(itemId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<DTO.Item>('PUT', path.join(""), request);
};
