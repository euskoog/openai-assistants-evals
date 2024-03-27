/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListAssistantsResponse } from '../models/ListAssistantsResponse';

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

}
