/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AssistantCategoriesService {

    /**
     * Get All Assistant Categories
     * Gets all assistant categories
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllAssistantCategories(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/assistant-categories/',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Create Assistant Category
     * Creates a new assistant category
     * @param assistantId
     * @param categoryId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createAssistantCategory(
        assistantId: string,
        categoryId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/assistant-categories/',
            query: {
                'assistant_id': assistantId,
                'category_id': categoryId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
