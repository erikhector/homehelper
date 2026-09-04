// @ts-nocheck
/* eslint-disable */
/* eslint-disable prettier/prettier */
/******************************************\
* DO NOT EDIT, THIS CODE IS TOOL GENERATED *
* AND ANY CHANGES WILL BE OVERWRITTEN      *
\******************************************/

import _client from "./HttpClient";
import * as DTO from "./Dto";

export const acceptChildInvite = async (inviteId: number): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/invites/${inviteId}/accept`)];
    const _queryParameters: string[] = [];
    if(inviteId !== null && inviteId !== undefined) {
        _queryParameters.push(`inviteId=${encodeURIComponent(inviteId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<any>('POST', path.join(""));
};

export const activateItemTemplate = async (childId: number, itemTemplateId: number): Promise<DTO.Item[]> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/item-templates/${itemTemplateId}/activate`)];
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

export const cancelChildInvite = async (childId: number, inviteId: number): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/invites/${inviteId}`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(inviteId !== null && inviteId !== undefined) {
        _queryParameters.push(`inviteId=${encodeURIComponent(inviteId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<any>('DELETE', path.join(""));
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

export const createItemTemplate = async (childId: number, request: DTO.SaveItemTemplateRequest): Promise<DTO.ItemTemplate> => {
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

export const declineChildInvite = async (inviteId: number): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/invites/${inviteId}/decline`)];
    const _queryParameters: string[] = [];
    if(inviteId !== null && inviteId !== undefined) {
        _queryParameters.push(`inviteId=${encodeURIComponent(inviteId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<any>('POST', path.join(""));
};

export const deleteChild = async (childId: number): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/${childId}`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<any>('DELETE', path.join(""));
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

export const deleteItemTemplate = async (childId: number, itemTemplateId: number): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/item-templates/${itemTemplateId}`)];
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
    return _client.httpFetch<any>('DELETE', path.join(""));
};

export const getChildInvites = async (childId: number): Promise<DTO.ChildShareInvite[]> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/invites`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<DTO.ChildShareInvite[]>('GET', path.join(""));
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

export const getItemTemplates = async (childId: number): Promise<DTO.ItemTemplate[]> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/item-templates`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<DTO.ItemTemplate[]>('GET', path.join(""));
};

export const getReceivedInvites = async (): Promise<DTO.ChildShareInvite[]> => {
    return _client.httpFetch<DTO.ChildShareInvite[]>('GET', _client.resolveUrl(`/api/children/invites/received`));
};

export const revokeChildAccess = async (childId: number, parentUserId: number): Promise<any> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/parents/${parentUserId}`)];
    const _queryParameters: string[] = [];
    if(childId !== null && childId !== undefined) {
        _queryParameters.push(`childId=${encodeURIComponent(childId)}`);
    }
    if(parentUserId !== null && parentUserId !== undefined) {
        _queryParameters.push(`parentUserId=${encodeURIComponent(parentUserId)}`);
    }
    if(_queryParameters.length > 0) {
        path.push("?");
        path.push(_queryParameters.join("&"));
    }
    return _client.httpFetch<any>('DELETE', path.join(""));
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

export const updateItemTemplate = async (childId: number, itemTemplateId: number, request: DTO.SaveItemTemplateRequest): Promise<DTO.ItemTemplate> => {
    const path = [_client.resolveUrl(`/api/children/${childId}/item-templates/${itemTemplateId}`)];
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
    return _client.httpFetch<DTO.ItemTemplate>('PUT', path.join(""), request);
};
