###### Schema

The structure of a request or response body MAY be further specified by the *schema* property under the appropriate media type.

The *schema* key CANNOT be specified if a body's media type is *application/x-www-form-urlencoded* or *multipart/form-data*.

All parsers of RAML MUST be able to interpret JSON Schema [JSON_SCHEMA] and XML Schema [XML_SCHEMA].

Schema MAY be declared inline or in an external file. However, if the schema is sufficiently large so as to make it difficult for a person to read the API definition, or the schema is reused across multiple APIs or across multiple miles in the same API, the !include user-defined data type SHOULD be used instead of including the content inline.

This example shows an inline schema declaration.

```yaml
/jobs:
  displayName: Jobs
  post:
    description: Create a Job
    body:
      text/xml:
        schema: |
          <xs:schema attributeFormDefault="unqualified"
                     elementFormDefault="qualified"
                     xmlns:xs="http://www.w3.org/2001/XMLSchema">
            <xs:element name="api-request">
              <xs:complexType>
                <xs:sequence>
                  <xs:element type="xs:string" name="input"/>
                </xs:sequence>
              </xs:complexType>
            </xs:element>
          </xs:schema>
      application/json:
        schema: |
          {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "properties": {
                "input": {
                    "type": "string"
                }
            },
            "type": "object"
          }
```

Alternatively, the value of the *schema* field MAY be the name of a schema specified in the root-level *schemas* property (see [Named Parameters](#named-parameters), or it MAY be declared in an external file and included by using the by using the RAML !include user-defined data type.

This example repeats the /jobs resource definition, but with the schemas defined in the external files job.xsd and job.schema.json.

```yaml
/jobs:
  displayName: Jobs
  post:
    description: Create a Job
    body:
      text/xml:
        schema: !include job.xsd
      application/json:
        schema: !include job.schema.json
```

###### Example

Documentation generators MUST use *body* properties' *example* attributes to generate example invocations.

This example shows example attributes for two *body* property media types.

```yaml
/jobs:
  displayName: Jobs
  post:
    description: Create a Job
    body:
      text/xml:
        schema: !include job.xsd
        example: |
          <api-request>
            <input>s3://zencodertesting/test.mov</input>
          </api-request>
      application/json:
        schema: !include job.schema.json
        example: |
          {
            "input": "s3://zencodertesting/test.mov"
          }
```

##### Responses

Resource methods MAY have one or more responses. Responses MAY be described using the *description* property, and MAY include *example* attributes or *schema* properties.

This example shows a definition for a GET response of 200.

```yaml
/media/popular:
  displayName: Most Popular Media
  get:
    description: |
      Get a list of what media is most popular at the moment.
    responses:
      200:
        body:
          application/json:
            example: !include examples/instagram-v1-media-popular-example.json
```

Responses MUST be a map of one or more HTTP status codes, where each status code itself is a map that describes that status code.

Each response MAY contain a *body* property, which conforms to the same structure as request *body* properties (see [Body](#body)). Responses that can return more than one response code MAY therefore have multiple bodies defined.

For APIs without *a priori* knowledge of the response types for their responses, "\*/\*" MAY be used to indicate that responses that do not matching other defined data types MUST be accepted. Processing applications MUST match the most descriptive media type first if "\*/\*" is used.

```yaml
/media/{mediaid}/content:
  displayName: Content
  get:
    description: |
      Get a media file.
    responses:
      200:
        body:
          "*/*":
            description: |
                Returns the media file.
```

Responses MAY contain a *description* property that further clarifies why the response was emitted. Response descriptions are particularly useful for describing error conditions.

This example shows an error declaration.

```yaml
/media/popular:
  displayName: Most Popular Media
  get:
    description: |
      Get a list of what media is most popular at the moment.
    responses:
      503:
        description: |
          The service is currently unavailable or you exceeded the maximum requests
          per hour allowed to your application.
```

This example shows a resource GET method that responds with separate codes and bodies for success and error conditions. The error condition body includes a description attribute that describes the problem.

```yaml
/media/popular:
  displayName: Most Popular Media
  get:
    description: |
      Get a list of what media is most popular at the moment.
    responses:
      200:
        body:
          application/json:
            schema: !include instagram-v1-media-popular.schema.json
      503:
        description: |
          The service is currently unavailable or you exceeded the maximum requests
          per hour allowed to your application.
        body:
          application/json:
            schema: !include instagram-v1-meta-error.schema.json
```

###### Headers

An API's methods may support custom header values in responses. The custom, non-standard HTTP headers MUST be specified by the *headers* property.

The *headers* property is a map in which the key is the name of the header, and the value is itself a map specifying the header attributes, according to the [Named Parameters section](#name-parameters).

This example shows a 503 error response that includes a custom header.

```yaml
/media/popular:
  displayName: Most Popular Media
  get:
    description: |
      Get a list of what media is most popular at the moment.
    responses:
      503:
        description: |
          The service is currently unavailable or you exceeded the maximum requests
          per hour allowed to your application.
        headers:
          X-waiting-period:
            description: |
              The number of seconds to wait before you can attempt to make a request again.
            type: integer
            required: yes
            minimum: 1
            maximum: 3600
            example: 34 
```

Documentation generators MUST include content specified as example information for headers. This information is included in the API definition by using the *example* property.

API's may include the the placeholder token {?} in a header name to indicate that any number of headers that conform to the specified format can be sent in responses. This is particularly useful for APIs that allow HTTP headers that conform to some naming convention to send arbitrary, custom data.

In the following example, the header x-metadata-{?} is used to send metadata that has been saved with the media.

```yaml
/media/popular:
  displayName: Most Popular Media
  get:
    description: |
      Get a list of what media is most popular at the moment.
    responses:
      200:
        description: |
          The list of popular media.
        headers:
          x-meta-{?}:
            description: |
              Field names prefixed with x-meta- contain user-specified metadata.
```

