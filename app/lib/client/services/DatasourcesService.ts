/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_datasources_Create_document_datasource } from '../models/Body_datasources_Create_document_datasource';
import type { Body_datasources_Update_document_datasource } from '../models/Body_datasources_Update_document_datasource';
import type { CreateDatasourceResponse } from '../models/CreateDatasourceResponse';
import type { ListDatasourcesResponse } from '../models/ListDatasourcesResponse';
import type { Response } from '../models/Response';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DatasourcesService {

    /**
     * Create Document Datasource
     * Create a new document datasource
     * @param formData
     * @returns CreateDatasourceResponse Successful Response
     * @throws ApiError
     */
    public static createDocumentDatasource(
        formData: Body_datasources_Create_document_datasource,
    ): CancelablePromise<CreateDatasourceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/datasources/document',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Document Datasource
     * Update a document datasource
     * @param datasourceId
     * @param formData
     * @returns CreateDatasourceResponse Successful Response
     * @throws ApiError
     */
    public static updateDocumentDatasource(
        datasourceId: string,
        formData: Body_datasources_Update_document_datasource,
    ): CancelablePromise<CreateDatasourceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/datasources/document/{datasource_id}',
            path: {
                'datasource_id': datasourceId,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * List Datasources
     * List all datasources
     * @returns ListDatasourcesResponse Successful Response
     * @throws ApiError
     */
    public static listDatasources(): CancelablePromise<ListDatasourcesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/datasources/',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Get Datasource
     * Get a specific datasource
     * @param datasourceId
     * @returns CreateDatasourceResponse Successful Response
     * @throws ApiError
     */
    public static getDatasource(
        datasourceId: string,
    ): CancelablePromise<CreateDatasourceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/datasources/{datasource_id}',
            path: {
                'datasource_id': datasourceId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Datasource
     * Delete a datasource
     * @param datasourceId
     * @returns Response Successful Response
     * @throws ApiError
     */
    public static deleteDatasource(
        datasourceId: string,
    ): CancelablePromise<Response> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/datasources/{datasource_id}',
            path: {
                'datasource_id': datasourceId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
