/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAssistantDatasource } from '../models/CreateAssistantDatasource';
import type { CreateAssistantDatasourceResponse } from '../models/CreateAssistantDatasourceResponse';
import type { ListAssistantDatasourcesResponse } from '../models/ListAssistantDatasourcesResponse';
import type { Response } from '../models/Response';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AssistantDatasourcesService {

    /**
     * List Assistant Datasources
     * List all assistant datasources
     * @param assistantId
     * @returns ListAssistantDatasourcesResponse Successful Response
     * @throws ApiError
     */
    public static listAssistantDatasources(
        assistantId: string,
    ): CancelablePromise<ListAssistantDatasourcesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/assistant-datasources/{assistantId}',
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
     * Create Assistant Datasource
     * Create assistant datasource
     * @param requestBody
     * @returns CreateAssistantDatasourceResponse Successful Response
     * @throws ApiError
     */
    public static createAssistantDatasource(
        requestBody: CreateAssistantDatasource,
    ): CancelablePromise<CreateAssistantDatasourceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/assistant-datasources/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Assistant Datasource
     * Delete assistant datasource
     * @param assistantDatasourceId
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static deleteAssistantDatasource(
        assistantDatasourceId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/assistant-datasources/{assistantDatasourceId}',
            path: {
                'assistantDatasourceId': assistantDatasourceId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
