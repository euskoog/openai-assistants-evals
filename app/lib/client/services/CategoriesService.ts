/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CategoriesService {

    /**
     * Get All Categories
     * Gets all categories
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllCategories(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories/',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Create Category
     * Creates a new category
     * @param name
     * @param description
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createCategory(
        name: string,
        description: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories/',
            query: {
                'name': name,
                'description': description,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Default Categories
     * Gets all default categories
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getDefaultCategories(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories/defaults',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Update Category
     * Updates a category
     * @param categoryId
     * @param name
     * @param description
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateCategory(
        categoryId: string,
        name: string,
        description: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            query: {
                'name': name,
                'description': description,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Category
     * Deletes a category
     * @param categoryId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteCategory(
        categoryId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
