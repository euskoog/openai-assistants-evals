/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_analytics_get_topic_messages } from '../models/Body_analytics_get_topic_messages';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AnalyticsService {

    /**
     * Get Conversation
     * Get conversation with assistant data
     * @param conversationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getConversation(
        conversationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/conversation',
            query: {
                'conversation_id': conversationId,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Categories
     * Get all categories for a list of assistant IDs
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCategories(
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/analytics/categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Topics Count
     * Get total topics for all assistants
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTopicsCount(
        requestBody?: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/analytics/topics/count',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Topic Messages
     * Get messages for a topic
     * @param topicId
     * @param categoryId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTopicMessages(
        topicId: string,
        categoryId: string,
        requestBody: Body_analytics_get_topic_messages,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/analytics/topic/messages',
            query: {
                'topic_id': topicId,
                'category_id': categoryId,
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
