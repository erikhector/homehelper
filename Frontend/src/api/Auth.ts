// @ts-nocheck
/* eslint-disable */
/* eslint-disable prettier/prettier */
/******************************************\
* DO NOT EDIT, THIS CODE IS TOOL GENERATED *
* AND ANY CHANGES WILL BE OVERWRITTEN      *
\******************************************/

import _client from "./HttpClient";
import * as DTO from "./Dto";

export const getCurrentUser = async (): Promise<DTO.AuthenticatedUserResponse> => {
    return _client.httpFetch<DTO.AuthenticatedUserResponse>('GET', _client.resolveUrl(`/api/auth/me`));
};

export const login = async (request: DTO.LoginRequest): Promise<DTO.AuthenticatedUserResponse> => {
    return _client.httpFetch<DTO.AuthenticatedUserResponse>('POST', _client.resolveUrl(`/api/auth/login`), request);
};

export const logout = async (): Promise<any> => {
    return _client.httpFetch<any>('POST', _client.resolveUrl(`/api/auth/logout`));
};

export const register = async (request: DTO.RegisterRequest): Promise<DTO.AuthenticatedUserResponse> => {
    return _client.httpFetch<DTO.AuthenticatedUserResponse>('POST', _client.resolveUrl(`/api/auth/register`), request);
};

export const updateDisplayName = async (request: DTO.UpdateDisplayNameRequest): Promise<DTO.AuthenticatedUserResponse> => {
    return _client.httpFetch<DTO.AuthenticatedUserResponse>('PUT', _client.resolveUrl(`/api/auth/me/display-name`), request);
};
