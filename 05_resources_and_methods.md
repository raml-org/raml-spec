### Resources and Nested Resources

Resources are identified by their relative URI, which MUST begin with a slash (/).

A resource defined as a root-level property is called a *top-level resource*. Its property's key is the resource's URI relative to the baseUri. A resource defined as a child property of another resource is called a *nested resource*, and its property's key is its URI relative to its parent resource's URI.

This example shows an API definition with one top-level resource, /gists, and one nested resource, /public.

```yaml
#%RAML 0.2
---
title: GitHub API
version: v3
baseUri: https://api.github.com
/gists:
  displayName: Gists
  /public:
    displayName: Public Gists
```

Every property whose key begins with a slash (/), and is either at the root of the API definition or is the child property of a resource property, is a resource property. The key of a resource, i.e. its relative URI, MAY consist of multiple URI path fragments separated by slashes; e.g. "/bom/items" may indicate the collection of items in a bill of materials as a single resource. However, if the individual URI path fragments are themselves resources, the API definition SHOULD use nested resources to describe this structure; e.g. if "/bom" is itself a resource then "/items" should be a nested resource of "/bom", while "/bom/items" should not be used.

#### Display Name

The *displayName* attribute provides a friendly name to the resource and can be used by documentation generation tools. The *displayName* key is OPTIONAL.

If the *displayName* attribute is not defined for a resource, documentation tools SHOULD refer to the resource by its property key (i.e. its relative URI, e.g., "/jobs"), which acts as the resource's name.

#### Description

Each resource, whether top-level or nested, MAY contain a *description* property that briefly describes the resource. It is RECOMMENDED that all the API definition's resources includes the *description* property.

#### Template URIs and URI Parameters

Template URIs containing URI parameters can be used to define a resource's relative URI when it contains variable elements. 
The following example shows a top-level resource with a key */jobs* and a nested resource with a key */{jobId}*:

```yaml
#%RAML 0.2
---
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs: # its fully-resolved URI is https://app.zencoder.com/api/{version}/jobs
  displayName: Jobs
  description: A collection of jobs
  /{jobId}: # its fully-resolved URI is https://app.zencoder.com/api/{version}/jobs/{jobId}
    description: A specific job, a member of the jobs collection
```

The values matched by URI parameters cannot contain slash (/) characters, in order to avoid ambiguous matching. In the example above, a URI (relative to the baseUri) of "/jobs/123" matches the "/{jobId}" resource nested within the "/jobs" resource, but a URI of "/jobs/123/x" does not match any of those resources.

A resource MAY contain a *uriParameters* property specifying the uriParameters in that resource's relative URI, as described in the Named Parameters section of this specification. The example below shows two top-level resources (/user and /users) and a nested resource specified by its template URI, "/{userId}". The URI parameter "userId" is explicitly declared, and given a displayName "User ID" and an integer type.

```yaml
#%RAML 0.2
---
title: GitHub API
version: v3
baseUri: https://api.github.com
/user:
  displayName: Authenticated User
/users:
  displayName: Users
  /{userId}:
   displayName: User
   uriParameters:
     userId:
       displayName: User ID
       type: integer
```

If a URI parameter in a resource's relative URI is not explicitly described in a uriParameters property for that resource, it MUST still be treated as a URI parameter with defaults as specified in the Named Parameters section of this specification. Its type is "string", it is required, and its displayName is its name (i.e. without the surrounding curly brackets [{] and [}]). In the example below, the top-level resource has two URI parameters, "folderId" and "fileId".

```yaml
#%RAML 0.2
---
title: Flat Filesystem API
version: v1
/files:
  description: A collection of all files
  /folder_{folderId}-file_{fileId}:
    description: An item in the collection of all files
```

A special uriParameter, *mediaTypeExtension*, is a reserved parameter. It may be specified explicitly in a uriParameters property or not specified explicitly, but its meaning is reserved: it is used by a client to specify that the body of the request or response be of the associated media type. By convention, a value of .json is equivalent to an Accept header of application/json and .xml is equivalent to an Accept header of text/xml. If this parameter is used, clients may specify the media type of a request/response via the URI rather than via the Accept HTTP header. For example, in the following example, the /users resource could be represented as application/json or text/xml:

```yaml
#%RAML 0.2
---
title: API Using media type in the URL
version: v1
/users{mediaTypeExtension}:
  uriParameters:
    mediaTypeExtension:
      enum: [ .json, .xml ]
      description: Use .json to specify application/json or .xml to specify text/xml
```

Although URI parameters can be explicitly specified to be optional, they SHOULD be required when they are surrounded directly by slashes (/), that is, when they constitute complete URI path fragments, e.g. ".../{objectId}/...". It usually makes little sense to allow a URI to contain adjacent slashes with no characters between them, e.g. "...//...". Hence, a URI parameter should only be specified as optional when it appears adjacent to other text; e.g., "/people/~{fieldSelectors}" indicates that the "{fieldSelectors}"" URI parameter can be blank, and therefore optional, indicating that "/people/~" is a valid relative URI.

#### Base URI parameters

A resource or a method can override a base URI template's values. This is useful to restrict or change the default or parameter selection in the base URI. The *baseUriParameters* property MAY be used to override any or all parameters defined at the root level *baseUriParameters* property, as well as base URI parameters not specified at the root level.

In the following example, calls to the /files resource must be made to "https://api-content.dropbox.com/{version}". All other calls in the API are made to "https://api.dropbox.com/{version}".

```yaml
#%RAML 0.2
---
title: Dropbox API
version: 1
baseUri: https://{apiDomain}.dropbox.com/{version}
baseUriParameters:
  apiDomain:
    description: |
      The sub-domain at which the API is accessible. Most API calls are sent to https://api.dropbox.com
    enum: [ "api" ]
/account/info:
  displayName: Account Information
/files:
  displayName: Download files
  baseUriParameters:
    apiDomain:
      enum: [ "api-content" ]
```

The special baseUriParameter *version* is reserved; processing applications MUST replace occurrences of {version} in any baseUri property values with the value of the root-level *version* property. The {version} parameter, if used in a baseUri, is required: if it is ued in a baseUri, the *version* root-level property MUST be provided and MUST be a valid non-empty URI fragment. 

#### Absolute URI

Absolute URIs are not explicitly specified. They are computed by starting with the baseUri and appending the relative URI of the top-level resource, and then successively appending the relative URI values for each nested resource until the target resource is reached.

Taking the previous example, the absolute URI of the public gists resource is formed as follows:

```
   "https://api.github.com"               <--- baseUri
               +
             "/gists"                     <--- gists resource relative URI
               +
             "/public"                    <--- public gists resource relative URI
               =
"https://api.github.com/gists/public"     <--- public gists absolute URI
```

A nested resource can itself have a child (nested) resource, creating a multiply-nested resource.

In this example, /user is a top-level resource that has no children; /users is a top-level resource that has a nested resource, /{userId}; and the nested resource, /{userId}, has three nested resources, /followers, /following, and /keys.

```yaml
#%RAML 0.2
---
title: GitHub API
version: v3
baseUri: https://api.github.com
/user:
/users:
  /{userId}:
    uriParameters:
      userId:
        type: integer
    /followers:
    /following:
    /keys:
      /{keyId}:
        uriParameters:
          keyId:
            type: integer
```

The computed absolute URIs for the resources, in the same order as their resource declarations, are:

```
https://api.github.com/user
https://api.github.com/users
https://api.github.com/users/{userId}
https://api.github.com/users/{userId}/followers
https://api.github.com/users/{userId}/following
https://api.github.com/users/{userId}/keys
https://api.github.com/users/{userId}/keys/{keyId}
```

#### Methods

In a RESTful API, *methods* are operations that are performed on a resource. A method MUST be one of the HTTP methods defined in the HTTP version 1.1 specification [RFC2616] and its extension, RFC5789 [RFC5789].

##### Description

Each declared method MAY contain a *description* attribute that briefly describes what the method does to the resource. It is RECOMMENDED that all API definition methods include the *description* property.

This example shows a resource, /jobs, with POST and GET methods (verbs) declared:

```yaml
#%RAML 0.2
---
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs:
  post:
    description: Create a Job
  get:
    description: List Jobs
```

The value of the *description* property MAY be formatted using Markdown [MARKDOWN].

```yaml
#%RAML 0.2
---
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs:
  post:
    description: |
      The post body must include the _URL_ of the video to process. It may
      also include output settings for the job, including an output
      destination, notification settings, and transcoding settings.

      We currently support downloading files using HTTP/HTTPS, S3,
      Cloud Files, FTP/FTPS, SFTP, and Aspera.
      When you create a new encoding job through the API, our server
      will immediately respond with details about the job and output
      files being created. You should store the job and outputs IDs
      to track them through the encoding process.
```

##### Headers

An API's methods MAY support or require non-standard HTTP headers. In the API definition, specify the non-standard HTTP headers by using the *headers* property.

The *headers* property is a map in which the key is the name of the header, and the value is itself a map specifying the header attributes, according to the [Named Parameters section](#name-parameters).

This example shows a POST method with an HTTP header.

```yaml
#%RAML 0.2
---
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs:
  post:
    description: Create a Job
    headers:
      Zencoder-Api-Key:
        displayName: ZEncoder API Key
```

If the header name contains the placeholder token {*}, processing applications MUST allow requests to send any number of headers that conform to the format specified, with {*} replaced by 0 or more valid header characters, and offer a way for implementations to add an arbitrary number of such headers. This is particularly useful for APIs that allow HTTP headers that conform to custom naming conventions to send arbitrary, custom data.

In the following example, the header x-metadata-{*} is used to send metadata that will be saved with the job.

```yaml
#%RAML 0.2
---
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs:
  post:
    description: Create a Job
    headers:
      Zencoder-Api-Key:
        displayName: ZEncoder API Key
      x-Zencoder-job-metadata-{*}
        displayName: Job Metadata
        description: |
           Field names prefixed with x-Zencoder-job-metadata- contain user-specified metadata. 
           The API does not validate or use this data. All metadata headers will be stored 
           with the job and returned to the client when this resource is queried.
```

###### Example

Documentation generators MUST include content specified as example information for headers. This information is included in the API definition by using the *example* property.

```yaml
#%RAML 0.2
---
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs:
  post:
    description: Create a Job
    headers:
      Zencoder-Api-Key:
        description: |
          The API key for your Zencoder account. You can find your API key at
          https://app.zencoder.com/api. You can also regenerate your API key on
          that page.
        type: string
        required: true
        minLength: 30
        maxLength: 30
        example: abcdefghijabcdefghijabcdefghij
```

##### Protocols

A method can override an API's *protocols* value for that single method by setting a different value for the fields. 

In the following example, the GET method is accessible through both HTTP and HTTPS, while the rest of the API only through HTTPS.

```yaml
#%RAML 0.2
---
title: Twitter API
version: 1.1
baseUri: https://api.twitter.com/{version}
/search/tweets.json:
  displayName: Tweet Search
  get:
    description: Returns a collection of relevant Tweets matching a specified query
    protocols: [HTTP, HTTPS]
```

##### Query Strings

An API's resources MAY be filtered (to return a subset of results) or altered (such as transforming a response body from JSON to XML format) by the use of query strings. If the resource or its method supports a query string, the query string MUST be defined by the *queryParameters* property. 

The *queryParameters* property is a map in which the key is the query parameter's name, and the value is itself a map specifying the query parameter's attributes, according to the [Named Parameters section](#named-parameters).

```yaml
#%RAML 0.2
---
title: GitHub API
version: v3
baseUri: https://api.github.com
/users:
  get:
    description: Get a list of users
    queryParameters:
      page:
        type: integer
      per_page:
        type: integer
```

###### Example

Query string *queryParameters* properties MAY include an *example* attribute. Documentation generators MUST use *example* attributes to generate example invocations.

```yaml
#%RAML 0.2
---
title: GitHub API
version: v3
baseUri: https://api.github.com/{version}
/users:
  get:
    description: Get a list of users
    queryParameters:
      page:
        description: Specify the page that you want to retrieve
        type: integer
        required: true
        example: 1
      per_page:
        description: Specify the amount of items that will be retrieved per page
        type: integer
        minimum: 10
        maximum: 200
        default: 30
        example: 50
```

##### Body

Some method verbs expect the resource to be sent as a request body. For example, to create a resource, the request must include the details of the resource to create.

Resources CAN have alternate representations. For example, an API might support both JSON and XML representations.

A method's body is defined in the *body* property as a hashmap, in which the key MUST be a valid media type.

This example shows a snippet of the Zencoder API's Jobs resource, which accepts input as either JSON or XML:

```yaml
/jobs:
  post:
    description: Create a Job
    body:
      text/xml: !!null
      application/json: !!null
```

###### Web Forms

Web forms REQUIRE special encoding and custom declaration.

If the API's media type is either *application/x-www-form-urlencoded* or *multipart/form-data*, the *formParameters* property MUST specify the name-value pairs that the API is expecting.

The *formParameters* property is a map in which the key is the name of the web form parameter, and the value is itself a map the specifies the web form parameter's attributes, according to the [Named Parameters section](#named-parameters).

###### Example

Documentation generators MUST use *form* properties' *example* attributes to generate example invocations.

```yaml
#%RAML 0.2
---
title: Twilio API
version: 2010-04-01
baseUri: https://api.twilio.com/{version}
/Accounts:
   /{AccountSid}:
     uriParameters:
       AccountSid:
         description: |
           An Account instance resource represents a single Twilio account.
         type: string
     /Calls:
       post:
         description: |
           Using the Twilio REST API, you can make outgoing calls to phones,
           SIP-enabled endpoints and Twilio Client connections.

           Note that calls initiated via the REST API are rate-limited to one per
           second. You can queue up as many calls as you like as fast as you like,
           but each call is popped off the queue at a rate of one per second.
         body:
           application/x-www-form-urlencoded:
             formParameters:
               From:
                 description: |
                   The phone number or client identifier to use as the caller id. If
                   using a phone number, it must be a Twilio number or a Verified
                   outgoing caller id for your account.
                 type: string
                 required: true
                 pattern: (\+1|1)?([2-9]\d\d[2-9]\d{6}) # E.164 standard
                 example: +14158675309
```

