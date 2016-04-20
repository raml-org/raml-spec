RAML&trade; Version 0.8: RESTful API Modeling Language
===================================

A [newer version of RAML (1.0)](http://raml.org/spec.html) is available.

Abstract
--------

RAML&trade; is a YAML-based language that describes RESTful APIs. Together with the [YAML specification](http://yaml.org/spec/1.2/spec.html), this specification provides all the information necessary to describe RESTful APIs; to create API client-code and API server-code generators; and to create API user documentation from RAML API definitions.


Introduction
------------

This specification describes RAML. RAML is a human-readable and machine process-able description of a RESTful API interface. API documentation generators, API client-code generators, and API servers consume a RAML document to create user documentation, client code, and server code stubs, respectively.

Conventions
-----------

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 [RFC2119](https://www.ietf.org/rfc/rfc2119.txt).

Overview
--------

RAML defines the media type "application/raml+yaml" for describing and documenting a RESTful API's resources, such as the resources' methods and schema. RAML is YAML-based, and RAML documents support all YAML 1.2 features. The recommended filename extension for RAML files is ".raml".

RAML also provides facilities for extensively documenting a RESTful API, enabling documentation generator tools to extract the user documentation and translate it to visual formats such as PDF, HTML, and so on.

RAML also introduces the innovative concept of resource types and traits for characterizing resources and methods, thereby minimizing the amount of repetition required to specify a RESTful API's design.

This RAML Specification is organized as follows:

* **Basic Information.** Explains how to describe core aspects of a RESTful API, such as its name, title, and location.
* **User Documentation.** Describes how to include supporting documentation for the RESTful API.
* **Resource Types and Traits.** Describes the optional mechanism for using RAML resource types and traits to characterize resources so as to avoid unnecessary repetition in the RESTful API's definition.
* **Resources.** Describes how to specify a RESTful API's resources, resources' methods and schema, and the interactions between resources.

### Terminology

For this specification, *API definition* will be used to denote the description of an API using this specification and *RAML Specification* refers to the current document.

### REST

*REST* is used in the context of an API implemented using the principles of REST. The REST acronym stands for Representational State Transfer and was first introduced and defined in 2000 by Roy Fielding in his doctoral dissertation [REST].

### Resource

A *resource* is the conceptual mapping to an entity or set of entities.

Markup Language
---------------

This specification uses YAML 1.2 [YAML] as its core format. YAML is a human-readable data format that aligns well with the design goals of this specification.

RAML API definitions are YAML-compliant documents that begin with a REQUIRED YAML-comment line that indicates the RAML version, as follows:

```yaml
#%RAML 0.8
```

The RAML version MUST be the first line of the RAML document. RAML parsers MUST interpret all other YAML-commented lines as comments.

In RAML, the YAML data structures are enhanced to include data types that are not natively supported. All RAML document parsers MUST support these extensions.

In RAML, all values MUST be interpreted in a case-sensitive manner.

### Includes

The YAML specification does not require that YAML parsers use any particular mechanism for splitting a YAML file into smaller manageable pieces. However, RAML documents MUST be able to be split among multiple files. To support this function, all RAML parsers MUST support the *include* tag, which enables including RAML and YAML and regular text files.

In this example, the content of myTextFile.txt is included as the value of the external property.

```yaml
#%RAML 0.8
external: !include myTextFile.txt
```

When RAML or YAML files are included, RAML parsers MUST not only read the content, but parse it and add the content to the declaring structure as if the content were declared inline.

To simplify API definition, and because the included file's parsing context is not shared between the included file and its parent, an included file SHALL NOT use a YAML reference to an anchor in a separate file. Likewise, a reference made from a parent file SHALL NOT reference a structure anchor defined in an included file.

In this example, the *properties.raml* file defines two properties. The *big.raml* file includes the properties.raml file.

```yaml
#%RAML 0.8
#properties.raml

propertyA: valueA
propertyB: valueB
```

```yaml
#%RAML 0.8
#big.raml

external: !include properties.raml
```

The resulting structure is equivalent to the following inline declaration:

```yaml
#%RAML 0.8
external:
  propertyA: valueA
  propertyB: valueB
```

If a relative path is used for the included file, the path is interpreted relative to the location of the original (including) file. If the original file is fetched as an HTTP resource, the included file SHOULD be fetched over HTTP.

In the following example, because the original (including) file is located at *http://example-domain.org/api/example.raml*, the *properties.raml* file should be fetched from *http://example-domain.org/api/properties.raml*.

```yaml
#%RAML 0.8
#http://example-domain.org/api/example.raml

external: !include properties.raml
```

If the included file has one of the following media types:

* application/raml+yaml
* text/yaml
* text/x-yaml
* application/yaml
* application/x-yaml

or a *.raml* or *.yml* or *.yaml* extension, RAML parsers MUST parse the content the file as RAML content and append the parsed structures to the RAML document's node.

The location of the file to be included, that is, the right-hand side of !include, must be static, that is, it cannot contain any resource type or trait parameters. This will be reconsidered for future versions of RAML.
Named Parameters
----------------

This RAML Specification describes collections of named parameters for the following properties: URI parameters, query string parameters, form parameters, request bodies (depending on the media type), and request and response headers. All the collections specify the named parameters' attributes as described in this section.

Some named parameters are optional and others are required. See the description of each named parameter.

Unless otherwise noted, named parameter values must be formatted as plain text. All valid YAML file characters MAY be used in named parameter values.


### displayName
(Optional)
The *displayName* attribute specifies the parameter's display name. It is a friendly name used only for display or documentation purposes. If *displayName* is not specified, it defaults to the property's key (the name of the property itself).

### description
(Optional)
The *description* attribute describes the intended use or meaning of the parameter. This value MAY be formatted using Markdown [MARKDOWN].

### type
(Optional)
The *type* attribute specifies the primitive type of the parameter's resolved value. API clients MUST return/throw an error if the parameter's resolved value does not match the specified type. If *type* is not specified, it defaults to string. Valid types are:

| Type    | Description |
|:--------|:------------|
| string  | Value MUST be a string.
| number  | Value MUST be a number. Indicate floating point numbers as defined by YAML.
| integer | Value MUST be an integer. Floating point numbers are not allowed. The integer type is a subset of the number type.
| date    | Value MUST be a string representation of a date as defined in RFC2616 Section 3.3 [RFC2616]. See [Date Representations](#date-representations).
| boolean | Value MUST be either the string "true" or "false" (without the quotes).
| file    | (Applicable only to Form properties)<br><br>Value is a file. Client generators SHOULD use this type to handle file uploads correctly.

##### Date Representations
As defined in [RFC2616], all date/time stamps are represented in Greenwich Mean Time (GMT), which for the purposes of HTTP is equal to UTC (Coordinated Universal Time). This is indicated by including "GMT" as the three-letter abbreviation for the timezone. Example: ```Sun, 06 Nov 1994 08:49:37 GMT```.


### enum
(Optional, applicable only for parameters of type string)
The *enum* attribute provides an enumeration of the parameter's valid values. This MUST be an array. If the *enum* attribute is defined, API clients and servers MUST verify that a parameter's value matches a value in the *enum* array. If there is no matching value, the clients and servers MUST treat this as an error.

### pattern
(Optional, applicable only for parameters of type string)
The *pattern* attribute is a regular expression that a parameter of type string MUST match. Regular expressions MUST follow the regular expression specification from ECMA 262/Perl 5. The pattern MAY be enclosed in double quotes for readability and clarity.

### minLength
(Optional, applicable only for parameters of type string)
The *minLength* attribute specifies the parameter value's minimum number of characters.

### maxLength
(Optional, applicable only for parameters of type string)
The *maxLength* attribute specifies the parameter value's maximum number of characters.

### minimum
(Optional, applicable only for parameters of type number or integer)
The *minimum* attribute specifies the parameter's minimum value.

### maximum
(Optional, applicable only for parameters of type number or integer)
The *maximum* attribute specifies the parameter's maximum value.

### example
(Optional)
The *example* attribute shows an example value for the property. This can be used, e.g., by documentation generators to generate sample values for the property.

### repeat
(Optional)
The *repeat* attribute specifies that the parameter can be repeated. If the parameter can be used multiple times, the *repeat* parameter value MUST be set to 'true'. Otherwise, the default value is 'false' and the parameter may not be repeated.

### required
(Optional except as otherwise noted)
The *required* attribute specifies whether the parameter and its value MUST be present in the API definition. It must be either 'true' if the value MUST be present or 'false' otherwise.

In general, parameters are optional unless the *required* attribute is included and its value set to 'true'.

For a URI parameter, the *required* attribute MAY be omitted, but its default value is 'true'.

### default
(Optional)
The *default* attribute specifies the default value to use for the property if the property is omitted or its value is not specified. This SHOULD NOT be interpreted as a requirement for the client to send the *default* attribute's value if there is no other value to send. Instead, the *default* attribute's value is the value the server uses if the client does not send a value.

## Named Parameters With Multiple Types
To denote that a named parameter can have multiple types, the value of the named parameter property MAY be an array of mappings, each of which has the attributes described in this document. This mechanism for defining a parameter with multiple types is particularly useful when an API uses the same named parameter for more than one data type.

In the following example, the named parameter *file* can be used for sending a file or string text data to an API:

```yaml
#%RAML 0.8
title: Amazon simple storage API
version: 1
baseUri: https://{destinationBucket}.s3.amazonaws.com
/:
  post:
    description: The POST operation adds an object to a specified bucket using HTML forms.
    body:
      application/x-www-form-urlencoded:
        formParameters:
          AWSAccessKeyId:
            description: The AWS Access Key ID of the owner of the bucket who grants an Anonymous user access for a request that satisfies the set of constraints in the Policy.
            type: string
          acl:
            description: Specifies an Amazon S3 access control list. If an invalid access control list is specified, an error is generated.
            type: string
          file:
            - type: string
              description: Text content. The text content must be the last field in the form.
            - type: file
              description: File to upload. The file must be the last field in the form.
```
Basic Information
-----------------

This section describes the components of a RAML API definition.

### Root Section

The root section of the format describes the basic information of an API, such as its title and base URI, and describes how to define common schema references.

RAML-documented API definition properties MAY appear in any order.

This example shows a snippet of the RAML API definition for the GitHub v3 public API.

```yaml
#%RAML 0.8
title: GitHub API
version: v3
baseUri: https://api.github.com
mediaType:  application/json
schemas:
  - User:  schema/user.json
    Users: schema/users.json
    Org:   schema/org.json
    Orgs:  schema/orgs.json
```

### API Title
(Required)
The *title* property is a short plain text description of the RESTful API. The *title* property's value SHOULD be suitable for use as a title for the contained user documentation.

### API Version
(Optional)
If the RAML API definition is targeted to a specific API version, the API definition MUST contain a *version* property. The *version* property is OPTIONAL and should not be used if:

* The API itself is not versioned.
* The API definition does not change between versions. The API architect can decide whether a change to user documentation elements, but no change to the API's resources, constitutes a version change.

The API architect MAY use any versioning scheme so long as version numbers retain the same format. For example, "v3", "v3.0", and "V3" are all allowed, but are not considered to be equal.

### Base URI and baseUriParameters
(Optional during development; Required after implementation)
A RESTful API's resources are defined relative to the API's base URI. The use of the *baseUri* field is OPTIONAL to allow describing APIs that have not yet been implemented. After the API is implemented (even a mock implementation) and can be accessed at a service endpoint, the API definition MUST contain a *baseUri* property. The *baseUri* property's value MUST conform to the URI specification [RFC2396] or a Level 1 Template URI as defined in RFC 6570 [RFC6570].

The *baseUri* property SHOULD only be used as a reference value. API client generators MAY make the *baseUri* configurable by the API client's users.

If the *baseUri* value is a Level 1 Template URI, the following reserved base URI parameters are available for replacement:

| URI Parameter | Value                            |
|:--------------|:---------------------------------|
| version       | The content of the version field.|

Any other URI template variables appearing in the *baseUri* MAY be described explicitly within a *baseUriParameters* property at the root
of the API definition. The properties of the *baseUriParameters* property are described in the
Named Parameters section of this specification.

If a URI template variable in the base URI is not explicitly described in a *baseUriParameters* property,
and is not specified in a resource-level *baseUriParameters* property,
it MUST still be treated as a base URI parameter with defaults as specified in the Named Parameters
section of this specification. Its type is "string", it is required, and its displayName is its name
(i.e. without the surrounding curly brackets [{] and [}]).

The following example RAML API definition uses a Level 1 Template URI as the *baseUri*.

```yaml
#%RAML 0.8
title: Salesforce Chatter REST API
version: v28.0
baseUri: https://na1.salesforce.com/services/data/{version}/chatter
```

The following example declares an explicit base URI parameter.

```yaml
#%RAML 0.8
title: Amazon S3 REST API
version: 1
baseUri: https://{bucketName}.s3.amazonaws.com
baseUriParameters:
  bucketName:
    description: The name of the bucket
```

### Protocols
(Optional)
A RESTful API can be reached via HTTP, HTTPS, or both. The *protocols* property MAY be used to specify the protocols that an API supports. If the *protocols* property is not specified, the protocol specified at the *baseUri* property is used. The *protocols* property MUST be an array of strings, of values __"HTTP"__ and/or __"HTTPS"__.

```yaml
#%RAML 0.8
title: Salesforce Chatter REST API
version: v28.0
protocols: [ HTTP, HTTPS ]
baseUri: https://na1.salesforce.com/services/data/{version}/chatter
```

### Default Media Type
(Optional)
The media types returned by API responses, and expected from API requests that accept a body, MAY be defaulted by specifying the *mediaType* property. This property is specified at the root level of the API definition. The property's value MAY be a single string with a valid media type:
* One of the following YAML media types:
 * text/yaml
 * text/x-yaml
 * application/yaml
 * application/x-yaml*
* Any type from the list of IANA MIME Media Types, http://www.iana.org/assignments/media-types
* A custom type that conforms to the regular expression, "application\/[A-Za-z\.-0-1]*\+?(json|xml)"

For any combination of resource and operation in the API, if a media type is specified as a key of the body property for that resource and operation, or if a media type is specified in the *mediaType* property, the body MUST be in the specified media types. Moreover, if the client specifies an Accepts header containing multiple media types that are allowed by the specification for the requested resource and operation, the server SHOULD return a body using the media type in the Accepts header's mediaType list.

This example shows an API that accepts and returns only JSON bodies.

```yaml
#%RAML 0.8
title: Stormpath REST API
version: v1
baseUri: https://api.stormpath.com/{version}
mediaType: application/json
```

### Schemas
(Optional)
To better achieve consistency and simplicity, the API definition SHOULD include an OPTIONAL *schemas* property in the root section. The *schemas* property specifies collections of schemas that could be used anywhere in the API definition. The value of the *schemas* property is an array of maps; in each map, the keys are the schema name, and the values are schema definitions. The schema definitions MAY be included inline or by using the RAML !include user-defined data type.

```yaml
#%RAML 0.8
baseUri: https://api.example.com
title: Filesystem API
version: 0.1
schemas:
  - !include path-to-canonical-schemas/canonicalSchemas.raml
  - File:       !include path-to-schemas/filesystem/file.xsd
    FileUpdate: !include path-to-schemas/filesystem/fileupdate.xsd
    Files:      !include path-to-schemas/filesystem/files.xsd
    Dir:        !include path-to-schemas/filesystem/dir.xsd
    Dirs:       !include path-to-schemas/filesystem/dirs.xsd
/files:
  get:
    responses:
      200:
        body:
          application/xml:
            schema: Files

```

### URI Parameters
(Optional)
In addition to the reserved URI parameters described in the *baseUri* property section, a Level 1 Template URI can feature custom URI parameters, which are useful in a variety of scenarios.  For example, let's look at the following API provider that parameterizes the base URI with customer information such as the company name.

```yaml
#%RAML 0.8
title: FreshBooks API
version: 2.1
baseUri: https://{companyName}.freshbooks.com/api/{version}/xml-in
```

URI parameters can be further defined by using the *uriParameters* property. The use of *uriParameters* is OPTIONAL. The *uriParameters* property MUST be a map in which each key MUST be the name of the URI parameter as defined in the *baseUri* property. The *uriParameters* CANNOT contain a key named *version* because it is a reserved URI parameter name. The value of the *uriParameters* property is itself a map that specifies the property's attributes, according to the [Named Parameters section](#named-parameters).

```yaml
#%RAML 0.8
title: Salesforce Chatter Communities REST API
version: v28.0
baseUri: https://{communityDomain}.force.com/{communityPath}
uriParameters:
 communityDomain:
   displayName: Community Domain
   type: string
 communityPath:
   displayName: Community Path
   type: string
   pattern: ^[a-zA-Z0-9][-a-zA-Z0-9]*$
   minLength: 1
```

### User Documentation
(Optional)
The API definition can include a variety of documents that serve as a user guides and reference documentation for the API. Such documents can clarify how the API works or provide business context.

Documentation-generators MUST include all the sections in an API definition's *documentation* property in the documentation output, and they MUST preserve the order in which the documentation is declared.

To add user documentation to the API, include the *documentation* property at the root of the API definition. The *documentation* property MUST be an array of documents. Each document MUST contain *title* and *content* attributes, both of which are REQUIRED. If the *documentation* property is specified, it MUST include at least one document.

Documentation-generators MUST process the content field as if it was defined using Markdown [MARKDOWN].

This example shows an API definition with a single user document.

```yaml
#%RAML 0.8
title: ZEncoder API
baseUri: https://app.zencoder.com/api
documentation:
 - title: Home
   content: |
     Welcome to the _Zencoder API_ Documentation. The _Zencoder API_
     allows you to connect your application to our encoding service
     and encode videos without going through the web  interface. You
     may also benefit from one of our
     [integration libraries](https://app.zencoder.com/docs/faq/basics/libraries)
     for different languages.
```

The *documentation* property MAY be included inline, as described above, or by using the RAML !include user-defined data type to reference external content.

This example shows the same API definition (ZEncoder API), but the *documentation* property's *content* attribute is referenced as external content.

```yaml
#%RAML 0.8
title: ZEncoder API
baseUri: https://app.zencoder.com/api
documentation:
 - title: Home
   content: !include zencoder-home.md
```

There is no limit to the number of documentation pages that can be included in a RAML API definition. However, if the *documentation* property's *content* attribute is sufficiently large so as to make it difficult for a person to read the API definition, the !include user-defined data type SHOULD be used instead of including the content inline.

This example shows an RAML API definition with multiple documentation pages:

```yaml
#%RAML 0.8
title: GitHub API
version: v3
baseUri: https://api.github.com
documentation:
 - title: Getting Started
   content: !include github-3-getting-started.md
 - title: Basics of Authentication
   content: !include github-3-basics-of-authentication.md
 - title: Rendering Data as Graphs
   content: !include github-3-rendering-data-as-graphs.md
```
### Resources and Nested Resources

Resources are identified by their relative URI, which MUST begin with a slash (/).

A resource defined as a root-level property is called a *top-level resource*. Its property's key is the resource's URI relative to the baseUri. A resource defined as a child property of another resource is called a *nested resource*, and its property's key is its URI relative to its parent resource's URI.

This example shows an API definition with one top-level resource, /gists, and one nested resource, /public.

```yaml
#%RAML 0.8
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
#%RAML 0.8
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
#%RAML 0.8
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
#%RAML 0.8
title: Flat Filesystem API
version: v1
/files:
  description: A collection of all files
  /folder_{folderId}-file_{fileId}:
    description: An item in the collection of all files
```

A special uriParameter, *mediaTypeExtension*, is a reserved parameter. It may be specified explicitly in a uriParameters property or not specified explicitly, but its meaning is reserved: it is used by a client to specify that the body of the request or response be of the associated media type. By convention, a value of .json is equivalent to an Accept header of application/json and .xml is equivalent to an Accept header of text/xml. If this parameter is used, clients may specify the media type of a request/response via the URI rather than via the Accept HTTP header. For example, in the following example, the /users resource could be represented as application/json or text/xml:

```yaml
#%RAML 0.8
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
#%RAML 0.8
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

In a resource structure of resources and nested resources with their methods, the most specific baseUriParameter fully overrides any baseUriParameter definition made before. In the following example the resource `/user/{userId}/image` overrides the definition made in `/users`.

```
#%RAML 0.8
title: Users API
version: 1
baseUri: https://{apiDomain}.someapi.com
/users:
  displayName: retrieve all users
  baseUriParameters:
    apiDomain:
      enum: [ "api" ]
  /{userId}/image:
    displayName: access users pictures
    baseUriParameters:
      apiDomain:
        enum: [ "static" ]
```

In the following example, the `PUT` method overrides the definition made in `/user/{userId}/image`.

```
#%RAML 0.8
title: Users API
version: 1
baseUri: https://{apiDomain}.someapi.com
/users:
  displayName: retrieve all users
  baseUriParameters:
    apiDomain:
      enum: [ "api" ]
  /{userId}/image:
    displayName: access users pictures
    baseUriParameters:
      apiDomain:
        enum: [ "static" ]
    get:
      displayName: retrieve a user's picture
    put:
      displayName: update a user's picture
      baseUriParameters:
        apiDomain:
          enum: [ "content-update" ]

```

The special baseUriParameter *version* is reserved; processing applications MUST replace occurrences of {version} in any baseUri property values with the value of the root-level *version* property. The {version} parameter, if used in a baseUri, is required: if it is used in a baseUri, the *version* root-level property MUST be provided and MUST be a valid non-empty URI fragment.

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
#%RAML 0.8
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
#%RAML 0.8
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
#%RAML 0.8
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
#%RAML 0.8
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

If the header name contains the placeholder token {\*}, processing applications MUST allow requests to send any number of headers that conform to the format specified, with {\*} replaced by 0 or more valid header characters, and offer a way for implementations to add an arbitrary number of such headers. This is particularly useful for APIs that allow HTTP headers that conform to custom naming conventions to send arbitrary, custom data.

In the following example, the header x-metadata-{\*} is used to send metadata that will be saved with the job.

```yaml
#%RAML 0.8
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
#%RAML 0.8
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
#%RAML 0.8
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
#%RAML 0.8
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
#%RAML 0.8
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
#%RAML 0.8
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
            "$schema": "http://json-schema.org/draft-03/schema",
            "properties": {
                "input": {
                    "required": false,
                    "type": "string"
                }
            },
            "required": false,
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

For APIs without *a priori* knowledge of the response types for their responses, "\*/\*" MAY be used to indicate that responses that do not match other defined data types MUST be accepted. Processing applications MUST match the most descriptive media type first if "\*/\*" is used.

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

### Resource Types and Traits

Resource and method declarations are frequently repetitive. For example, if an API requires OAuth authentication, the API definition must include the *access_token* query string parameter (which is defined by the *queryParameters* property) in all the API's resource method declarations.

Moreover, there are many advantages to reusing patterns across multiple resources and methods. For example, after defining a collection-type resource's characteristics, that definition can be applied to multiple resources. This use of patterns encourages consistency and reduces complexity for both servers and clients.

A *resource type* is a partial resource definition that, like a resource, can specify a description and methods and their properties. Resources that use a resource type inherit its properties, such as its methods.

A *trait* is a partial method definition that, like a method, can provide method-level properties such as description, headers, query string parameters, and responses. Methods that use one or more traits inherit those traits' properties.

Resources may specify the resource type from which they inherit using the *type* property. The resource type may be defined inline as the value of the *type* property (directly or via an !include), or the value of the *type* property may be the name of a resource type defined within the root-level *resourceTypes* property.

Similarly, methods may specify one or more traits from which they inherit using the *is* property. A resource may also use the *is* property to apply the list of traits to all its methods. The value of the *is* property is an array of traits. Each trait element in that array may be defined inline (directly or via an !include), or it may be the name of a trait defined within the root-level *traits* property.

Resource type definitions MUST NOT incorporate nested resources; they cannot be used to generate nested resources when they are applied to a resource, and they do not apply to its existing nested resources.

#### Declaration

The *resourceTypes* and *traits* properties are declared at the API definition's root level with the *resourceTypes* and *traits* property keys, respectively. The value of each of these properties is an array of maps; in each map, the keys are resourceType or trait names, and the values are resourceType or trait definitions, respectively.

```yaml
#%RAML 0.8
title: Example API
version: v1
resourceTypes:
  - collection:
      usage: This resourceType should be used for any collection of items
      description: The collection of <<resourcePathName>>
      get:
        description: Get all <<resourcePathName>>, optionally filtered
      post:
        description: Create a new <<resourcePathName | !singularize>>
traits:
  - secured:
      usage: Apply this to any method that needs to be secured
      description: Some requests require authentication.
      queryParameters:
        access_token:
          description: Access Token
          type: string
          example: ACCESS_TOKEN
          required: true
```

The following example builds on the previous one, but the the resource types and traits are defined in external files that are included by using the RAML !include data type.

```yaml
#%RAML 0.8
title: Example API
version: v1
resourceTypes:
   - collection: !include resourceTypes/collection.yaml
   - member: !include resourceTypes/member.yaml
traits:
   - secured: !include traits/secured.yaml
   - rateLimited: !include traits/rate-limited.yaml
```

This example can be further shortened to:

```yaml
#%RAML 0.8
---
title: Example API

version: v1
resourceTypes: !include allResourceTypes.yaml # where allResourceTypes.yaml is an array of maps of resource type definitions
traits: !include allTraits.yaml  # where allTraits.yaml is an array of maps of trait definitions
```

Collections of resourceTypes may also be combined, as can collections of traits. Some possibilities are shown in the following example:

```yaml
#%RAML 0.8
title: Example API
version: v1
resourceTypes:
  - !include standardResourceTypes.yaml  # where standardResourceTypes.yaml is a map of standard resource type definitions
  - !include resourceTypes/specialCollection.yaml # where specialCollection.yaml defines one resource type
traits:
  - !include standardTraits.yaml  # where standardTraits.yaml is a map of standard trait definitions
  - paged:
      queryParameters:
        start:
          type: number
    searchable:
      queryParameters:
        query:
          type: string
```

##### Usage

The *usage* property of a resource type or trait is used to describe how the resource type or trait should be used. Documentation generators MUST convey this property as characteristics of the resource and method, respectively. However, the resources and methods MUST NOT inherit the *usage* property: neither resources nor methods allow a property named *usage*.

##### Parameters

The definitions of resource types and traits MAY contain parameters, whose values MUST be specified when applying the resource type or trait, UNLESS the parameter corresponds to a reserved parameter name, in which case its value is provided by the processing application (whatever is consuming the API definition).

Parameters MUST be indicated in resource type and trait definitions by double angle brackets (double chevrons) enclosing the parameter name; for example, "\<\<tokenName>>".

Parameters MUST be of type string.

In resource type definitions, there are two reserved parameter names: *resourcePath* and *resourcePathName*. The processing application MUST set the values of these reserved parameters to the inheriting resource's path (for example, "/users") and the part of the path following the rightmost "/" (for example, "users"), respectively. Processing applications MUST also omit the value of any *mediaTypeExtension* found in the resource's URI when setting *resourcePath* and *resourcePathName*.

In trait definitions, there is one reserved parameter name, *methodName*, in addition to the *resourcePath* and *resourcePathName*. The processing application MUST set the value of the *methodName* parameter to the inheriting method's name. The processing application MUST set the values of the *resourcePath* and *resourcePathName* parameters the same as in resource type definitions.

Parameter values MAY further be transformed by applying one of the following functions:
* The *!singularize* function MUST act on the value of the parameter by a locale-specific singularization of its original value. The only locale supported by this version of RAML is United States English.
* The *!pluralize* function MUST act on the value of the parameter by a locale-specific pluralization of its original value. The only locale supported by this version of RAML is United States English.

To apply functions, append them to the parameter name within the double angle brackets, separated from the parameter name with a | (pipe) character and optional whitespace padding. Here is an example that uses both as well as reserved parameters:

```yaml
#%RAML 0.8
title: Example API
version: v1
mediaType: application/json
schemas:
  users: !include schemas/users.json
  user: !include schemas/user.json
resourceTypes:
  - collection:
      get:
        responses:
          200:
            body:
              schema: <<resourcePathName>> # e.g. users
      post:
        responses:
          200:
            body:
              schema: <<resourcePathName | !singularize>>  # e.g. user
  - member:
      get:
        responses:
          200:
            body:
              schema: <<resourcePathName>> # e.g. user
traits:
  - secured:
      description: Some requests require authentication
      queryParameters:
        <<methodName>>: # e.g. get:
          description: A <<methodName>> name-value pair must be provided for this request to succeed.  # e.g. A get name-value...
          example: <<methodName>>=h8duh3uhhu38   # e.g. get=h8duh3uhhu38
```

Parameters may not be used within !include tags, that is, within the location of the file to be included. This will be reconsidered for future versions of RAML.

##### Optional Properties

When defining resource types and traits, it can be useful to capture patterns that manifest several levels below the inheriting resource or method, without requiring the creation of the intermediate levels. For example, a resource type definition may describe a body parameter that will be used *if* the API defines a post method for that resource, but the processing application should not create the post method itself.

To accommodate this need, a resource type or trait definition MAY append a question mark ("?") suffix to the name of any non-scalar property that should not be applied if it doesn't already exist in the resource or method at the corresponding level. This optional structure key indicates that the value of the property should be applied if the property name itself (without the question mark) is already defined (whether explicitly or implicitly) at the corresponding level in that resource or method.

The following example shows an optional *post?* property that defines a body parameter called createAuthority. If the inheriting resource defines a *post* method, it will include the createAuthority property in its body. Likewise, if the inheriting resource defines a *delete* method, it will include the deleteAuthority property in its body.

```yaml
#%RAML 0.8
title: Example of Optional Properties
resourceTypes:
  - auditableResource
      post?:
        body:
          createAuthority:
            description: |
              If the resource has a post method defined, expect a createAuthority
              property in its body
      delete?:
        body:
          deleteAuthority:
            description: |
              If the resource has a delete method defined, expect a deleteAuthority
              property in its body
```

It is important to note that this feature applies only to non-scalar properties, thus, using the optional marker ("?") in a scalar property such as _usage_ or _displayName_ MUST be rejected from RAML parsers.


#### Applying Resource Types and Traits

To apply a resource type definition to a resource, so that the resource inherits the resource type's characteristics, the resource MUST be defined using the *type* attribute. The value of the *type* attribute MUST be either a) one and only one of the resource type keys (names) included in the *resourceTypes* declaration, or b) one and only one resource type definition map.

To apply a trait definition to a method, so that the method inherits the trait's characteristics, the method MUST be defined by using the *is* attribute. The value of the *is* attribute MUST be an array of any number of elements, each of which MUST be a) one or more trait keys (names) included in the *traits* declaration, or b) one or more trait definition maps.

A trait may also be applied to a resource by using the *is* key, which is equivalent to applying the trait to all methods for that resource, whether declared explicitly in the resource definition or inherited from a resource type.

```yaml
#%RAML 0.8
title: Example API
version: v1
resourceTypes:
  - collection: !include resourceTypes/collection.yaml
    member: !include resourceTypes/member.yaml
traits:
  - secured: !include traits/secured.yaml
    paged: !include traits/paged.yaml
    rateLimited: !include traits/rate-limited.yaml
/users:
  type: collection
  is: [ secured ] # if collection defines a post method, that method is also secured
  get:
    is: [ paged, rateLimited ]
```

To pass parameter values to resource types and traits, use a map when declaring the resource type or trait to be used.

```yaml
#%RAML 0.8
title: Example API
version: v1
resourceTypes:
  - searchableCollection:
      get:
        queryParameters:
          <<queryParamName>>:
            description: Return <<resourcePathName>> that have their <<queryParamName>> matching the given value
          <<fallbackParamName>>:
            description: If no values match the value given for <<queryParamName>>, use <<fallbackParamName>> instead
traits:
  - secured:
      queryParameters:
        <<tokenName>>:
          description: A valid <<tokenName>> is required
    paged:
      queryParameters:
        numPages:
          description: The number of pages to return, not to exceed <<maxPages>>
/books:
  type: { searchableCollection: { queryParamName: title, fallbackParamName: digest_all_fields } }
  get:
    is: [ secured: { tokenName: access_token }, paged: { maxPages: 10 } ]
```
Security
--------
Most REST APIs have one or more mechanisms to secure data access, identify requests, and determine access level and data visibility.

This section describes how an API designer MAY include security scheme definitions in RAML API definitions. This section also outlines the support Documentation that Client and Server implementation generators SHOULD include.

### Declaration

The *securitySchemes* property is declared at the API's root level.

The *securitySchemes* property MUST be used to specify an API's security mechanisms, including the required settings and the authentication methods that the API supports.
one authentication method is allowed if the API supports them.

In this example, the Dropbox API supports authentication via OAuth 2.0 and OAuth 1.0.

```yaml
#%RAML 0.8
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securitySchemes:
    - oauth_2_0:
        description: |
            Dropbox supports OAuth 2.0 for authenticating all API requests.
        type: OAuth 2.0
        describedBy:
            headers:
                Authorization:
                    description: |
                       Used to send a valid OAuth 2 access token. Do not use
                       with the "access_token" query string parameter.
                    type: string
            queryParameters:
                access_token:
                    description: |
                       Used to send a valid OAuth 2 access token. Do not use together with
                       the "Authorization" header
                    type: string
            responses:
                401:
                    description: |
                        Bad or expired token. This can happen if the user or Dropbox
                        revoked or expired an access token. To fix, you should re-
                        authenticate the user.
                403:
                    description: |
                        Bad OAuth request (wrong consumer key, bad nonce, expired
                        timestamp...). Unfortunately, re-authenticating the user won't help here.
        settings:
          authorizationUri: https://www.dropbox.com/1/oauth2/authorize
          accessTokenUri: https://api.dropbox.com/1/oauth2/token
          authorizationGrants: [ code, token ]
    - oauth_1_0:
        description:|
            OAuth 1.0 continues to be supported for all API requests, but OAuth 2.0 is now preferred.
        type: OAuth 1.0
        settings:
          requestTokenUri: https://api.dropbox.com/1/oauth/request_token
          authorizationUri: https://www.dropbox.com/1/oauth/authorize
          tokenCredentialsUri: https://api.dropbox.com/1/oauth/access_token
    - customHeader:
        description:|
            A custom
```

##### Description

The *description* attribute MAY be used to describe a *securitySchemes* property.

##### Type

The *type* attribute MAY be used to convey information about authentication flows and mechanisms to processing applications such as Documentation Generators and Client generators. Processing applications SHOULD provide handling for the following schemes:

|Type       |Description|
|:----------|:----------|
|OAuth 1.0  | The API's authentication requires using OAuth 1.0 as described in RFC5849 [RFC5849]
|OAuth 2.0  | The API's authentication requires using OAuth 2.0 as described in RFC6749 [RFC6749]
|Basic Authentication| The API's authentication relies on using Basic Access Authentication as described in RFC2617 [RFC2617]
|Digest Authentication| The API's authentication relies on using Digest Access Authentication as described in RFC2617 [RFC2617]
|x-{other}| The API's authentication relies in another authentication method.

A processing application's developers MAY provide support for these mechanisms. If a mechanism is supported, it MUST conform to specified standard.

##### describedBy
The *describedBy* attribute MAY be used to apply a trait-like structure to a security scheme mechanism so as to extend the mechanism, such as specifying response codes, HTTP headers or custom documentation.

This extension allows API designers to describe security schemes. As a best practice, even for standard security schemes, API designers SHOULD describe the security schemes' required artifacts, such as headers, URI parameters, and so on. Including the security schemes' description completes an API's documentation.

##### Settings

The *settings* attribute MAY be used to provide security schema-specific information. Depending on the value of the *type* parameter, its attributes can vary.

The following lists describe the minimum set of properties which any processing application MUST provide and validate if it chooses to implement the Security Scheme type. Processing applications MAY choose to recognize other properties for things such as token lifetime, preferred cryptographic algorithms, an so on.

###### OAuth 1.0
|Property |Description |
|:--------|------------|
|requestTokenUri| The URI of the *Temporary Credential Request endpoint* as defined in RFC5849 Section 2.1
|authorizationUri| The URI of the *Resource Owner Authorization endpoint* as defined in RFC5849 Section 2.2
|tokenCredentialsUri| The URI of the *Token Request endpoint* as defined in RFC5849 Section 2.3

###### OAuth 2.0
|Property |Description |
|:--------|------------|
|authorizationUri| The URI of the *Authorization Endpoint* as defined in RFC6749 [RFC6748] Section 3.1
|accessTokenUri| The URI of the *Token Endpoint* as defined in RFC6749 [RFC6748] Section 3.2
|authorizationGrants| A list of the Authorization grants supported by the API As defined in RFC6749 [RFC6749] Sections 4.1, 4.2, 4.3 and 4.4, can be any of: code, token, owner or credentials.
|scopes| A list of scopes supported by the API as defined in RFC6749 [RFC6749] Section 3.3

###### Other
If the scheme's type is *x-other*, API designers can use the properties in this mapping to provide extra information to clients that understand the *x-other* type.

### Usage: Applying a Security Scheme to an API
To apply a *securityScheme* definition to every method in an API, the API MAY be defined using the *securedBy* attribute. This specifies that all methods in the API are protected using that security scheme.

Applying a *securityScheme* definition to a method overrides whichever *securityScheme* has been defined at the root level. To indicate that the method is protected using a specific security scheme, the method MUST be defined by using the *securedBy* attribute. The value of the *securedBy* attribute MUST be a list of any of the security schemes defined in the *securitySchemes* declaration.

```yaml
#%RAML 0.8
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securedBy: [oauth_2_0]
securitySchemes:
    - oauth_2_0: !include oauth_2_0.yml
    - oauth_1_0: !include oauth_1_0.yml
/users:
    get:
        securedBy: [oauth_2_0, oauth_1_0]
```

A securityScheme may also be applied to a resource by using the *securedBy* key, which is equivalent to applying the securityScheme to all methods that may be declared, explicitly or implicitly, by defining the *resourceTypes* or *traits* property for that resource.

To indicate that the method may be called without applying any *securityScheme*, the method may be annotated with the *null* *securityScheme*.

```yaml
#%RAML 0.8
title: GitHub API
version: v3
baseUri: https://api.github.com
securitySchemes:
    - oauth_2_0: !include oauth_2_0.yml
/users/{userid}/gists:
    get:
        securedBy: [null, oauth_2_0]
        description: |
            List the authenticated user’s gists or if called anonymously, this will return all public gists.
```

If the processing application supports custom properties, custom parameters can be provided to the security scheme at the moment of inclusion in a method. In the following example, the parameter *scopes* is being assigned.

RAML does not specify which parameters MUST be provided or supported by each *securityScheme* implementation.

```yaml
#%RAML 0.8
title: GitHub API
version: v3
baseUri: https://api.github.com
securitySchemes:
    - oauth_2_0: !include oauth_2_0.yml
/users/{userid}/gists:
    get:
        securedBy: [null, oauth_2_0: { scopes: [ ADMINISTRATOR ] } ]
        description: |
            List the authenticated user’s gists or if called anonymously, this will return all public gists.
```


References
----------

### Normative References

[RFC1738]  Berners-Lee, T., Masinter, L., and M. McCahill, "Uniform
          Resource Locators (URL)", RFC 1738, December 1994.

[RFC2119]  Bradner, S., "Key words for use in RFCs to Indicate
          Requirement Levels", BCP 14, RFC 2119, March 1997.

[RFC2396]  Berners-Lee, T., Fielding, R., and L. Masinter, "Uniform
          Resource Identifiers (URI): Generic Syntax", RFC 2396,
          August 1998.

[RFC2616]  Fielding, R., Gettys, J., Mogul, J., Frystyk, H.,
          Masinter, L., Leach, P., and T. Berners-Lee, "Hypertext
          Transfer Protocol -- HTTP/1.1", RFC 2616, June 1999.

[RFC4627]  Crockford, D., "The application/json Media Type for
          JavaScript Object Notation (JSON)", RFC 4627, July 2006.

[RFC5789]  Dusseault, L. and J. Snell, "PATCH Method for HTTP", RFC
          5789, March 2010.

[RFC6570]  Gregorio, J., Fielding, R., Hadley, M., Nottingham, M.,
          and D. Orchard, "URI Template", RFC 6570, March 2012.

[YAML]     Ben Kiki, O., Evans, C., and I. Net, "YAML Aint Markup
          Language", 2009, <http://www.yaml.org/spec/1.2/spec.html>.

### Informative References

[JSON_SCHEMA]
          Galiegue, F., Zyp, K., and G. Court, "JSON Schema: core
          definitions and terminology", 2013,
          <http://tools.ietf.org/html/draft-zyp-json-schema-04>.

[MARKDOWN]
          Gruber, J., "Markdown Syntax Documentation", 2004,
          <http://daringfireball.net/projects/markdown/syntax>.

[REST]     Fielding, R., "Representational State Transfer (REST)",
          2000, <http://www.ics.uci.edu/~fielding/pubs/dissertation/
          rest_arch_style.htm>.

[RFC2629]  Rose, M., "Writing I-Ds and RFCs using XML", RFC 2629,
          June 1999.

[RFC3552]  Rescorla, E. and B. Korver, "Guidelines for Writing RFC
          Text on Security Considerations", BCP 72, RFC 3552, July
          2003.

[XML_SCHEMA]
          Gao, S., Sperberg-McQueen, C., and H. Thompson, "W3C XML
          Schema Definition Language (XSD) 1.1", 2012,
          <http://www.w3.org/XML/Schema>.
