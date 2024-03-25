export const getClassification = `def get_classification(self, instructions: str, query: str, response: str):
    """Determines if the response satisfies the query, based on the
    instructions provided by the assistant"""

    try:
        classification_template = """
        ## Response Classification Task

        **Objective**: Assess and categorize the following response
        based on its accuracy, completeness, and appropriateness 
        relative to the input query. Use the options provided to 
        assign the most fitting category.

        ### Assistant Instructions
        {{ instructions }}

        ### Options and Descriptions
        - **Answered**: Use when the response accurately and 
        completely addresses the query. Applicable even for vague 
        questions if the response remains helpful.
        
        - **Not Answered**: Select this when the assistant fails 
        to provide a relevant answer, or cannot utilize its tools 
        effectively. This is also the choice for operational failures.

        - **Not Allowed**: Appropriate for responses outside the 
        assistant's scope or domain. Use this for queries about 
        real-time knowledge or events that the assistant cannot 
        address with available tools.

        ### Input Query
        Please classify the following query/response pair:
        """

        template = Template(classification_template)
        prompt = template.render(instructions=instructions)

        options = ["Answered", "Not Answered", "Not Allowed"]
        input = f"Query: {query} \\n Response: {response}"

        # classification service built from OpenAI's API and MarvinAI
        classification = Classification( 
            name="Validate response", description=prompt, options=options)
        result = classification.run(input=input)

        return result
    except Exception as e:
        print(f"Error getting classification: {e}")`;

export const categorize = `def categorize(
    self, 
    instructions: str, 
    query: str, 
    categories: List[Category], 
    previous_messages: list[Message]
):
    """Assigns a category to a query based on a list of pre-determined categories"""

    category_names = [category.name for category in categories]
    categories_described = "\\n".join(
        f"{category.name}: {category.description}" for category in categories)

    # extract previous message content, with info about the message category and topic
    previous_messages_formatted = format_prompt_messages(previous_messages)

    categorization_prompt_template = """
    ## Query Categorization Task

    **Objective**: Categorize the following input query based on the descriptions 
    provided for each category. Choose the most fitting category for the query.

    ### Instructions
    - **Read through the assistant's instructions** carefully to understand how 
    to categorize queries.
    - **Review the categories and their descriptions** to familiarize yourself 
    with the available options.
    - If the query fits into an existing category, assign it to that category.
    - Ensure the chosen category accurately reflects the query's content.
    - If previous messages exist, you may use them to build context for the query.

    ### Assistant Instructions
    {{ instructions }}

    ### Previous Messages
    {{ previous_messages }}

    ### Categories and Descriptions
    {{ categories_described }}

    ### Input Query
    Please categorize the following query:
    """

    template = Template(categorization_prompt_template)

    rendered_prompt = template.render(
        instructions=instructions,
        categories_described=categories_described,
        previous_messages=previous_messages_formatted
    )

    classification = Classification(
        name="Categorization", description=rendered_prompt, options=category_names)
    result = classification.run(input=query)`;

export const getTopic = `def get_topic(
    self, 
    query: str, 
    category: Category, 
    previous_messages: list[Message], 
    topic_service: TopicService
):
    """Assigns a topic to a query based on a list of pre-determined topics"""

    # create your own custom service to process utils for the topic assignment, 
    # I use TopicService as an example.
    category_name = category.name
    category_topics = topic_service.get_existing_topics_from_category(
        category.id)

    # extract previous message content, with info about the message category and topic
    previous_messages_formatted = format_prompt_messages(previous_messages)

    topic_assignment_prompt = """
    ## Topic Assignment

    **Objective**: Assign an appropriate topic to the following input query 
    within the specified category.

    ### Context
    Existing Topics (if applicable) for {{ category_name }}:
    {{ category_topics }}

    If the query can be matched with an existing topic within the specified 
    category, assign that topic. If not, create a new topic based on the query. 
    If you are assigning a new topic, be as general as possible. Try to limit 
    topics to one word unless absolutely necessary- the more concise the better. 
    Remember, the topic cannot be the same as the category.

    Example:
    User Query: "Who is the current president"
    Category: Other
    Assigned Topic: Politics

    User Query: "Where can I edit my profile avatar?"
    Category: Profile
    Assigned Topic: Avatar

    Remeber that under NO circumstance can the topic be the same as the category. 
    Do not add quotes or any other characters alongside the generated topic. 
    Please assign a short and concise topic to the following query:

    ### Previous Messages
    {{ previous_messages }}

    ### Data
    User Query: {{ query }}
    Category: {{ category_name }}
    Assigned Topic:
    """

    template = Template(topic_assignment_prompt)

    rendered_prompt = template.render(
        query=query, 
        category_name=category_name, 
        category_topics=category_topics, 
        previous_messages=previous_messages_formatted
    )

    completion = ChatCompletion(llm_model="gpt-4")
    result = completion.run(
        messages=[{"role": "system", "content": rendered_prompt}])`;
