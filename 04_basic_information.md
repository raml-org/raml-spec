Basic Information
-----------------

This section describes the components of a RAML API definition.

### Root Section

The root section of the format describes the basic information of an API, such as its title and base URI, and describes how to define common schema references.

RAML-documented API definition properties MAY appear in any order.

This example shows a snippet of the RAML API definition for the GitHub v3 public API.

```yaml
#%RAML 0.8
---
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
A RESTful API's resources are defined relative to the API's base URI. The use of the *baseUri* field is OPTIONAL to allow describing APIs that have not yet been implemented. After the API is implemented (even a mock implementation) and can be accessed at a service endpoint, the API definition MUST contain a *baseUri* property. The *baseUri* property's value MUST conform to the URI specification [RFC2396] or a Level 1 Template URI as defined in [RFC6570].

The *baseUri* property SHOULD only be used as a reference value. API client generators MAY make the *baseUri* configurable by the API client's users.

If the *baseUri* value is a Level 1 Template URI, the following reserved base URI parameters are available for replacement:

| URI Parameter | Value                            |
|:--------------|:---------------------------------|
| version       | The content of the version field.|


The following example RAML API definition uses a Level 1 Template URI as the *baseUri* with the reserved *{version}* base URI parameter.

```yaml
#%RAML 0.8
---
title: Salesforce Chatter REST API
version: v28.0
baseUri: https://na1.salesforce.com/services/data/{version}/chatter
```



Any other URI template variables appearing in the *baseUri* MAY be described explicitly within a *baseUriParameters* property at the root
of the API definition. The properties of the *baseUriParameters* property are described in the 
[Named Parameters](#03_named_parameters.md) section of this specification.

If a URI template variable in the base URI is not explicitly described in a *baseUriParameters* property, 
and is not specified in a resource-level *baseUriParameters* property, 
it MUST still be treated as a base URI parameter with defaults as specified in the Named Parameters 
section of this specification. Its type is "string", it is required, and its displayName is its name 
(i.e. without the surrounding curly brackets [{] and [}]).

The following example declares an explicit base URI parameter.

```yaml
#%RAML 0.8
---
title: Amazon S3 REST API
version: 1
baseUri: https://{bucketName}.s3.amazonaws.com
baseUriParameters:
  bucketName:
    description: The name of the bucket
```

### Protocols
(Optional)
A RESTful API can be reached HTTP, HTTPS, or both. The *protocols* property MAY be used to specify the protocols that an API supports. If the *protocols* property is not specified, the protocol specified at the *baseUri* property is used. The *protocols* property MUST be an array of strings, of values __"HTTP"__ and/or __"HTTPS"__.

```yaml
#%RAML 0.8
---
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
---
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
---
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
---
title: FreshBooks API
version: 2.1
baseUri: https://{companyName}.freshbooks.com/api/{version}/xml-in
```

URI parameters can be further defined by using the *uriParameters* property. The use of *uriParameters* is OPTIONAL. The *uriParameters* property MUST be a map in which each key MUST be the name of the URI parameter as defined in the *baseUri* property. The *uriParameters* CANNOT contain a key named *version* because it is a reserved URI parameter name. The value of the *uriParameters* property is itself a map that specifies the property's attributes, according to the [Named Parameters section](#named-parameters).

```yaml
#%RAML 0.8
---
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
---
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
---
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
---
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
