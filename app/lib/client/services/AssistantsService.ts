/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssistantBase } from '../models/AssistantBase';
import type { AssistantChatRequest } from '../models/AssistantChatRequest';
import type { CreateAssistantResponse } from '../models/CreateAssistantResponse';
import type { ListAssistantsResponse } from '../models/ListAssistantsResponse';
import type { ReadAssisantResponse } from '../models/ReadAssisantResponse';
import type { Response } from '../models/Response';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AssistantsService {

    /**
     * List Assistants
     * List all assistants
     * @returns ListAssistantsResponse Successful Response
     * @throws ApiError
     */
    public static listAssistants(): CancelablePromise<ListAssistantsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/assistants/',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Create Assistant
     * Create a new assistant
     * @param requestBody
     * @returns CreateAssistantResponse Successful Response
     * @throws ApiError
     */
    public static createAssistant(
        requestBody: AssistantBase,
    ): CancelablePromise<CreateAssistantResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/assistants/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Assistant
     * Update assistant
     * @param assistantId
     * @param requestBody
     * @returns ReadAssisantResponse Successful Response
     * @throws ApiError
     */
    public static updateAssistant(
        assistantId: string,
        requestBody: AssistantBase,
    ): CancelablePromise<ReadAssisantResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/assistants/{assistantId}',
            path: {
                'assistantId': assistantId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Assistant
     * Delete assistant
     * @param assistantId
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static deleteAssistant(
        assistantId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/assistants/{assistantId}',
            path: {
                'assistantId': assistantId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Chat With An Assistant
     * Chat with an assistant
     * @param assistantId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static chatWithAnAssistant(
        assistantId: string,
        requestBody: AssistantChatRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/assistants/{assistantId}/chat',
            query: {
                'assistant_id': assistantId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
