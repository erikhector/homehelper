// @ts-nocheck
/* eslint-disable */
/* eslint-disable prettier/prettier */
/******************************************\
* DO NOT EDIT, THIS CODE IS TOOL GENERATED *
* AND ANY CHANGES WILL BE OVERWRITTEN      *
\******************************************/

import _client from "./HttpClient";
import * as DTO from "./Dto";

export const applyItemTemplate = async (childId: number, itemTemplateId: number): Promise<DTO.Item[]> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/item-templates/${itemTemplateId}/apply`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(itemTemplateId !== null && itemTemplateId !== undefined) {
        _queryParameters.push(`itemTemplateId=${encodeURIComponent(itemTemplateId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<DTO.Item[]>('POST', path.join(""));
};

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

export const createItemTemplate = async (childId: number, request: DTO.CreateItemTemplateRequest): Promise<DTO.ItemTemplate> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/item-templates`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<DTO.ItemTemplate>('POST', path.join(""), request);
};

export const deleteItem = async (childId: number, itemId: number): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/items/${itemId}`)];
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
    return _client.httpFetch<any>('DELETE', path.join(""));
};

export const deleteItemTemplate = async (itemTemplateId: number): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/item-templates/${itemTemplateId}`)];
    const _queryParameters: string[] = [];
    if(itemTemplateId !== null && itemTemplateId !== undefined) {
        _queryParameters.push(`itemTemplateId=${encodeURIComponent(itemTemplateId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<any>('DELETE', path.join(""));
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

export const getItemTemplates = async (): Promise<DTO.ItemTemplate[]> => {
    return _client.httpFetch<DTO.ItemTemplate[]>('GET', _client.resolveUrl(`/api/children/item-templates`));
};

export const shareChild = async (childId: number, request: DTO.ShareChildRequest): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/parents`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<any>('POST', path.join(""), request);
};

export const updateItemQuantities = async (childId: number, itemId: number, request: DTO.UpdateItemQuantitiesRequest): Promise<DTO.Item> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/items/${itemId}/quantities`)];
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
