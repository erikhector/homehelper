// @ts-nocheck
/* eslint-disable */
/* eslint-disable prettier/prettier */
/******************************************\
* DO NOT EDIT, THIS CODE IS TOOL GENERATED *
* AND ANY CHANGES WILL BE OVERWRITTEN      *
\******************************************/

import _client from "./HttpClient";
import * as DTO from "./Dto";

export const createPlaceholder = async (request: DTO.PlaceholderCreate): Promise<DTO.Placeholder> => {
    return _client.httpFetch<DTO.Placeholder>('POST', _client.resolveUrl(`/api/Placeholder`), request);
};

export const getHelloWorld = async (): Promise<string> => {
    return _client.httpFetch<string>('GET', _client.resolveUrl(`/api/Placeholder`));
};

export const throwNewProblemDetails = async (): Promise<string> => {
    return _client.httpFetch<string>('GET', _client.resolveUrl(`/api/Placeholder/throw-problem-details`));
};
