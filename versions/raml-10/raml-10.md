# RAML Version 1.0: RESTful API Modeling Language

## Abstract

RAML is a language for the definition of HTTP-based APIs that embody most or all of the principles of Representational State Transfer (REST). This document constitutes the RAML specification, an application of the [YAML 1.2 specification](http://yaml.org/spec/1.2/spec.html). The RAML specification provides mechanisms for defining practically-RESTful APIs, creating client/server source code, and comprehensively documenting the APIs for users.

## Status of this Document

This document reflects the RAML 1.0 specification. The contents of this document were derived from the consensus of its authors and through the feedback of RAML 0.8 users. We strongly recommend that implementers and users of the RAML 0.8 specification update their software and API definitions to this version of the RAML specification.


## Terminology and Conformance Language

Normative text is text that describes elements of the specification that are indispensable and/or contain the conformance language keywords as defined by the [IETF RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) "Key words for use in RFCs to Indicate Requirement Levels". Informative text is text that is potentially helpful to the user, but not indispensable to the specification and can be changed, added, or deleted editorially without negative implications to the implementation of the specification. Informative text does not contain any conformance keywords.

All text in this document is, by default, normative.

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in the [IETF RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) "Keywords for use in RFCs to Indicate Requirement Levels".

## Definitions and Terminology

### General

For this specification, **API definition** is used to denote the description of an API using this specification and **RAML Specification** refers to the current document.

**REST** is used in the context of an API implemented using some or all of the principles of REST. The REST acronym stands for Representational State Transfer and was first introduced and defined in 2000 by Roy Fielding in his doctoral dissertation [REST](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm).

A **resource** is the conceptual mapping to an entity or set of entities.

Optional properties are indicated with trailing question marks (e.g. **description?**).

### Template URI

A template URI refers to any URI parameters using curly brackets ({}) to mark a section inside a resource's relative URI as variable element.

RAML fully supports Level 2 as defined in [RFC6570](https://tools.ietf.org/html/rfc6570) for any template URIs.

## Introduction

This specification describes the RESTful API Modeling Language (RAML). RAML is a human- and machine-readable language for the definition of a RESTful application programming interface (API). RAML is designed to improve the specification of such interfaces by providing a format that can serve as a useful contract between the API provider and the API consumers, for example to facilitate providing user documentation and source code stubs for client and server implementations, thereby streamlining and enhancing the definition and development of interoperable applications that utilize RESTful APIs.

RAML introduces the innovative concept of resource types and traits for characterizing and reusing patterns of resources and methods on those resources, thereby minimizing the amount of repetition required to specify a RESTful API's design and promoting consistency within and across APIs.

This document is organized as follows:

* **Basic Information**. Explains how to describe core aspects of the API, such as its name, title, location (or URI), and defaults. Describes how to include supporting documentation for the API.
* **Data Types**. Describes a means to model API data via a streamlined type system, which also encompasses JSON and XML Schema.
* **Resources**. Describes how to specify an API's resources and nested resources, as well as URI parameters in any URI templates.
* **Methods**. Describes how to specify the methods on the API’s resources, and their request headers, query parameters, and request bodies.
* **Responses**. Describes the specification of API responses, including status codes, media types, response headers and response bodies.
* **Resource Types and Traits**. Describes the optional mechanism for using RAML resource types and traits to characterize resources so as to avoid unnecessary repetition in an API's definition and promote consistency and reuse.
* **Security**. Describes the mechanisms available in RAML to specify an API’s security schemes.
* **Annotations**. Describes a mechanism for extending a RAML specification by defining strongly-typed annotations and applying them throughout the specification.
* **Includes, Libraries, Overlays, and Extensions**. Describes how an API’s definition may be composed of externalized definition documents, how collections of such definitions can be packaged as libraries, how layers of metadata may be separated from and overlaid on top of a RAML document, and how an API specification can be extended with additional functionality.

## What's New and Different in RAML 1.0

* **Data types**: a unified, streamlined, and powerful way to model data wherever it appears in an API.
  * Uniformly covers bodies, URI parameters, headers, and query parameters (and no more need for a separate formParameters construct)
  * Can wrap XML Schema and JSON Schema and even refer to sub-schemas within them, but in many cases just obviates them
  * Much easier than JSON Schema or XML Schema, and all in YAML
* **Examples**: multiple examples, expressible in YAML, and annotatable (so semantics can be injected)
* **Annotations**: a tried-and-tested, strongly-typed mechanism for extensibility
* **Libraries**: more capable modularization for broad reuse of API artifacts
* **Overlays** and **Extensions**: further extensibility via separated files
* **Improved Security Schemes**:
  * More complete OAuth support
  * Support pass-through (key-based) security schemes
  * Extension points
* **Several smaller changes** for consistency and expressivity, for example:
  * Array-valued properties can be expressed as scalars when the array has only one member
  * Ambiguities have been clarified, e.g. the optionality of baseUri and the overloading rules

## Markup Language

This specification uses [YAML 1.2](http://www.yaml.org/spec/1.2/spec.html) as its underlying format. YAML is a human-readable data format that aligns well with the design goals of this specification. As in YAML, all nodes (keys, values, tags, etc) are case-sensitive.

RAML API definitions are YAML 1.2-compliant documents that begin with a REQUIRED YAML-comment line that indicates the RAML version, as follows.

```yaml
#%RAML 1.0
title: My API
```

The first line of a RAML specification compliant document MUST match the [IETF RFC5234](https://tools.ietf.org/html/rfc5234) – Augmented BNF for Syntax Specifications:

“#%RAML” SP “1.0” SP [FragmentType] CRLF

With the _FragmentType_ being NOT ALLOWED in API definitions, and is OPTIONAL for the specification of RAML fragment documents. RAML fragment documents are reusable RAML modules that are referenced or included into a larger API definition. Please refer to the [Modularization](#modularization) section for more information about RAML fragments.

The media type _application/raml+yaml_ and its associated file extension _.raml_ SHALL be used to designate files containing RAML API definitions, RAML fragments and files that contain RAML markup. RAML is also capable of including documents with other media types, e.g., “application/schema+json”, “application/yaml”.

In order to facilitate the automated processing of RAML documents, RAML imposes some restrictions and requirements in addition to the core YAML 1.2 specification. The following list enumerates some of these requirements and restrictions:

1. The first line of a RAML file consists of a YAML comment that specifies the RAML version. Therefore RAML processors cannot completely ignore all YAML comments.
2. The order of some properties at given levels within a RAML document has significance. Therefore processors are expected to preserve this ordering.
3. Property names, also known as Keys, at given levels are not repeatable. Although YAML allows such repetition duplicate-keys will overwriting previously specified values.

## The Root of the Document

The root section of the RAML document describes the basic information of an API, such as its title and version, as well as defining assets used elsewhere in the RAML document such as types and traits.

RAML-documented API definition properties MAY appear in any order. Processors MUST preserve the order of properties of the same kind within the same node of the definition tree, for example resources that appear at the same level of the resource tree, methods for a given resource, parameters for a given method, properties at the same level in a given type, etc. Processors MUST also preserve the order of items within arrays.

This example shows a small part of a RAML API definition for the GitHub v3 public API.

```yaml
#%RAML 1.0
title: GitHub API
version: v3
baseUri: https://api.github.com
mediaType:  application/json
securitySchemes:
  oauth_2_0: !include securitySchemes/oauth_2_0.raml
types:
  Gist:  !include types/gist.raml
  Gists: !include types/gists.raml
resourceTypes:
  collection: !include types/collection.raml
traits:
securedBy: [ oauth_2_0 ]
/search:
  /code:
    type: collection
    get:
```

The following table enumerates the possible properties at the root of a RAML document:

| Property  | Description |
|:----------|:----------|
| description? | A longer, human-friendly description of the API
| (&lt;annotationName&gt;)? | Annotations to be applied to this API. Annotations are any property whose key begins with "(" and ends with ")" and whose name (the part between the beginning and ending parentheses) is a declared annotation name. See section [Annotations](#annotations) for more information.
| schemas? | Alias for the equivalent "types" property, for compatibility with RAML 0.8. Deprecated - API definitions should use the "types" property, as the "schemas" alias for that property name may be removed in a future RAML version. The "types" property allows for XML and JSON schemas.
| types? | Declarations of (data) types for use within this API. See section [RAML Data Types](#raml-data-types) for more information.
| traits? | Declarations of traits for use within this API. See section [Resource Types and Traits](#resource-types-and-traits) for more information.
| resourceTypes? | Declarations of resource types for use within this API. See section [Resource Types and Traits](#resource-types-and-traits) for more information.
| annotationTypes? | Declarations of annotation types for use by annotations. See section [Annotation Types](#declaring-annotation-types) for more information.
| securitySchemes? | Declarations of security schemes for use within this API. See section [Security Schemes](#security-schemes) for more information.
| uses? | Importing external libraries that can be used within the API. See section [Libraries](#libraries) for more information.
| title | Short plain-text label for the API
| version? | The version of the API, e.g. "v1"
| baseUri? | A URI that's to be used as the base of all the resources' URIs. Often used as the base of the URL of each resource, containing the location of the API. Can be a [template URI](#template-uri). See section [Base URI and Base URI Parameters](#base-uri-and-base-uri-parameters) for more information.
| baseUriParameters? | Named parameters used in the baseUri (template). See section [Base URI and Base URI Parameters](#base-uri-and-base-uri-parameters) for more information.
| protocols? | The protocols supported by the API. The protocols property MUST contain one or more of the supported protocols: "HTTP", "HTTPS". (case-insensitive).
| mediaType? | Default media types to use for request and response bodies (payloads), e.g. "application/json"
| securedBy? | The security schemes that apply to every resource and method in the API. See section [Applying Security Schemes](#applying-security-schemes) for more information.
| /&lt;relativeUri&gt;? | The resources of the API, identified as relative URIs that begin with a slash (/). Every property whose key begins with a slash (/), and is either at the root of the API definition or is the child property of a resource property, is a resource property, e.g.: /users, /{groupId}, etc.
| documentation? | Additional overall documentation for the API. See section [User Documentation](#user-documentation) for more information.

### API Title
The **title** property is a short plain text label for the API. It MUST be specified, and its value is a string. Its value SHOULD be suitable for use as a title for the contained user documentation.

### API Version

The OPTIONAL **version** property specifies a version of the API (as a whole). Its value is a string. API owners SHOULD consider carefully their versioning approach and communicate the current version through the version property.

### API Description

The OPTIONAL **description** property describes the overall API in a human friendly, extended manner. The value of the description property is a markdown string. More structured documentation SHOULD be included throughout the structure of the API definition and in the documentation property.

### User Documentation

The OPTIONAL **documentation** property includes a variety of documents that serve as user guides and reference documentation for the API. Such documents can clarify how the API works or provide technical and business context.

The value of the documentation property is an array of one or more documents. Each document is an object that MUST contain exactly two properties, **title** and **content**, with non-empty string values. The content property's value is a markdown string.

The structure of documentation object is described by following table.

| Property  | Description |
|:----------|:----------|
| title | Title of documentation section
| content | Content of documentation section

This example shows an API definition with two user documents.

```yaml
#%RAML 1.0
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
 - title: Legal
   content: !include docs/legal.markdown
```

### Base URI and Base URI Parameters

The OPTIONAL **baseUri** property specifies a URI as an identifier for the API as a whole, and MAY be used the specify the URL at which the API is served (its service endpoint), and which forms the base of the URLs of each of its resources. The baseUri property's value is a string that MUST conform to the URI specification [RFC2396](https://www.ietf.org/rfc/rfc2396.txt) or a [Template URI](#template-uri).

If the baseUri value is a [Template URI](#template-uri), the following reserved base URI parameter is available.

| URI Parameter | Value |
|:----------|:----------|
| version | The value of the root-level version property

Any other URI template variables appearing in the baseUri MAY be described explicitly within a **baseUriParameters** property at the root of the API definition. The baseUriParameters property has the same structure and semantics as the uriParameters property on a resource property, except that it specifies parameters in the base URI rather than a resource's relative URI. See the section [Template URIs and URI parameters](#template-uris-and-uri-parameters) for information about the uriParameters property.

The following example RAML API definition uses a [Template URI](#template-uri) as the base URI.

```yaml
#%RAML 1.0
title: Salesforce Chatter REST API
version: v28.0
baseUri: https://na1.salesforce.com/services/data/{version}/chatter
```

The following example declares an explicit base URI parameter.

```yaml
#%RAML 1.0
title: Amazon S3 REST API
version: 1
baseUri: https://{bucketName}.s3.amazonaws.com
baseUriParameters:
  bucketName:
    description: The name of the bucket
```

When the base URI ends in one or more slashes (`/`), those trailing slashes are to be omitted in constructing the absolute paths for the resources using that base URI.

For example, in

```yaml
baseUri: http://api.test.com/common/
/users:
  /groups:
```

the absolute paths for the two resources are `http://api.test.com/common/users` and `http://api.test.com/common/users/groups`.

In a more complicated examples with consecutive slashes in multiple places, note that only trailing slashes in the base URI are collapsed:

```yaml
baseUri: //api.test.com//common//
/:
  /users/:
    /groups//:
```
leads to the following 3 resource absolute paths: `//api.test.com//common/`, `//api.test.com//common//users/` and `//api.test.com//common//users//groups//`.

### Protocols

The OPTIONAL **protocols** property specifies the protocols that an API supports. If the protocols property is not explicitly included, the protocol(s) specified at the baseUri property is (are) used; if the protocols property is specified explicitly, it overrides any protocol specified in the baseUri property. The protocols property MUST be a non-empty array of strings, of values HTTP and/or HTTPS, and is case-insensitive.

The following is an example of an API endpoint that accepts both HTTP and HTTPS requests.

```yaml
#%RAML 1.0
title: Salesforce Chatter REST API
version: v28.0
protocols: [ HTTP, HTTPS ]
baseUri: https://na1.salesforce.com/services/data/{version}/chatter
```

### Default Media Types

The media types expected from API requests that contain a body, and returned by API responses, can be defaulted by specifying the OPTIONAL **mediaType** property, so they do not need to be specified within every body definition.

The value of the mediaType property MUST be a sequence of media type strings or a single string if there is only one default media; with the premise that all of them are described by exactly the same types and/or examples. Each value  need to conform to the media type specification in [RFC6838](https://tools.ietf.org/html/rfc6838).

This example shows a RAML snippet for an API that accepts and returns a JSON-formatted body. If the remainder of this API's specification doesn't explicitly specify another media type, this API only accepts and returns JSON-formatted bodies.

```yaml
#%RAML 1.0
title: New API
mediaType: application/json
```

Or the alternative syntax if there is more than one default media type.

```yaml
#%RAML 1.0
title: New API
mediaType: [ application/json, application/xml ]
```

Default media types can be overridden by defining a `mediaType` node explicitly to a [body](#bodies) of an API request or response. When one defines a root-level `mediaType` node and then override that in a body by defining explicitly another or the same media type node, none of the root level media types apply to that node, other than the media types explicitly defined within that node. The example below shows a RAML snippet that illustrates that behavior. The resource `/list` returns a `Person[]` body represented as either JSON or XML. On the other hand, the resource `/send` overrides the default media types with an explicit definition of an `application/json` node and therefore only accepts a JSON-formatted body.

```yaml
#%RAML 1.0
title: New API
mediaType: [ application/json, application/xml ]
types:
  Person:
  Another:
/list:
  get:
    responses:
      200:
        body: Person[]
/send:
  post:
    body:
      application/json:
        type: Another
```

### Default Security

The security schemes to be applied to every method of every resource in the API can be defaulted by specifying the OPTIONAL **securedBy** property. Its value is an array of security scheme names. If this property is specified, every method of every resource is protected by the specified security schemes. See section [Applying Security Schemes](#applying-security-schemes) for more information, including how to resolve application of multiple security schemes via inheritance.

The following example shows an API allowing access through either an OAuth 2.0 security scheme or an OAuth 1.1 security scheme.

```yaml
#%RAML 1.0
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securedBy: [ oauth_2_0, oauth_1_0 ]
securitySchemes:
  oauth_2_0: !include securitySchemes/oauth_2_0.raml
  oauth_1_0: !include securitySchemes/oauth_1_0.raml
```

## RAML Data Types

### Introduction

RAML 1.0 introduces the notion of **data types**, which provide a concise and powerful way of describing the data in your API, and add rules for validating instances of data against the type declaration, so an instance is valid when it adheres to all rules for the type. The data can be in a URI parameter (base or resource URI), a query parameter, a request or response header, or of course a request or response body. Some types are built in, while custom types may be defined by extending (inheriting from) the built-in types. In any place where the API expects data, a built-in type may be used to describe the data, or a type may be extended inline to describe that data. Custom types may also be named and then used like any built-in type.

The RAML example below defines a User type with three properties: firstname and lastname of (built-in) type string, and age of (built-in) type number. This User type is later used to describe the type (schema) for a payload.

```yaml
#%RAML 1.0
title: API with Types
types:
  User:
    type: object
    properties:
      firstname: string
      lastname:  string
      age:       number
/users/{id}:
  get:
    responses:
      200:
        body:
          application/json:
            type: User
```

A RAML type declaration looks somewhat like a JSON schema definition. In fact, RAML types can be used instead of JSON and XML schemas, or coexist with them. The RAML type syntax, however, is designed to be considerably easier and more succinct than JSON and XML schemas while retaining their flexibility and expressiveness. Below is a larger example.

```yaml
#%RAML 1.0
title: My API with Types
mediaType: application/json
types:
  Org:
    type: object
    properties:
      onCall: AlertableAdmin
      Head: Manager
  Person:
    type: object
    properties:
      firstname: string
      lastname:  string
      title?:    string
  Phone:
    type: string
    pattern: "[0-9|-]+"
  Manager:
    type: Person
    properties:
      reports: Person[]
      phone:  Phone
  Admin:
    type: Person
    properties:
      clearanceLevel:
        enum: [ low, high ]
  AlertableAdmin:
    type: Admin
    properties:
      phone: Phone
  Alertable: Manager | AlertableAdmin
/orgs/{orgId}:
  get:
    responses:
      200:
        body:
          application/json:
            schema: Org
```

The example above contains a few advanced features.

- Optional properties
- [Scalar Type Specialization](#scalar-type-specialization)
- [Inheritance](#inheritance)
- [Arrays](#array-types)
- [Enumerations](#enums)
- [Union Types](#union-types)
- [Maps](#map-types)

### Overview

The RAML type system borrows from object oriented programming languages such as Java, as well as from XSD and JSON Schemas.

RAML Types in a nutshell:

- Types are similar to Java classes
  - But borrow additional features from JSON Schema, XSD, and more expressive object oriented languages
- You can define Types that inherit from other Types
  - Multiple inheritance is allowed
- Types are split into four families: scalars, objects, externals and arrays
- Types can define two types of members: properties and facets. Both are inherited
  - Properties are regular object oriented properties
  - Facets are special "configurations" that let you specialize types based on characteristics of their values.
    For example: minLength, maxLength
- Only object types can declare properties. But all types can declare facets
- The way you specialize a scalar type is by implementing facets ( giving already defined facets a concrete value )
- The way you specialize an object type is by defining properties

![Types Hierarchy](images/typesHierarchy.png)

### Type Declarations

Types may be declared inline, wherever the API expects data, or in an OPTIONAL **types** property at the root of the API
or in an included library. Types declarations are used to extend built-in types or other custom types, as well as to
add more information to types such as specific examples or annotations. Here are the properties that all type
declarations may have; certain type declarations may have other properties.

| Property  | Description |
|:----------|:----------|
| default? | Provides a default value for a type.
| schema? | Alias for the equivalent "type" property, for compatibility with RAML 0.8. Deprecated - API definitions should use the "type" property, as the "schema" alias for that property name may be removed in a future RAML version. The "type" property allows for XML and JSON schemas.
| type? | A base type which the current type extends or just wraps. The value of a type node MUST be either a) the name of a user-defined type or b) the name of a built-in RAML data type (object, array, or one of the scalar types) or c) an inline type declaration.
| example? | An example of an instance of this type. This can be used, e.g., by documentation generators to generate sample values for an object of this type. The `example` property MUST not be available when the `examples` property is already defined.
| examples? | An object containing named examples of instances of this type. This can be used, e.g., by documentation generators to generate sample values for an object of this type. The `examples` property MUST not be available when the `example` property is already defined. See section [Examples](#defining-examples-in-raml) for more information.
| displayName? | An alternate, human-friendly name for the type
| description? | A longer, human-friendly description of the type
| (&lt;annotationName&gt;)? | Annotations to be applied to this type. Annotations are any property whose key begins with "(" and ends with ")" and whose name (the part between the beginning and ending parentheses) is a declared annotation name. See section on [Annotations](#annotations) for more information.
| xml? | The ability to configure serialization of an instance of this type into XML. See section [XML Serialization of Type Instances](#xml-serialization-of-type-instances) for more information.

The `schema` and `type` properties are mutually exclusive and synonymous: processors MUST NOT allow both to be specified (explicitly or implicitly) inside the same type declaration. Therefore, the following examples are both invalid.

```yaml
types:
  Person:
    schema: # invalid as mutually exclusive with `type`
    type: # invalid as mutually exclusive with `schema`
```

```yaml
/resource:
  get:
    responses:
      200:
        body:
          application/json: # start type declaration
            schema: # invalid as mutually exclusive with `type`
            type: # invalid as mutually exclusive with `schema`
```

It is recommended to use the `type` property instead of `schema`, as the `schema` alias is deprecated and may be removed in a future RAML version. The `type` property also allows for XML and JSON schemas.

### Object Types

All types that have the built-in object type at the root of their inheritance tree may use the following properties in their type declarations.

| Property  | Description |
|:----------|:----------|
| properties? | The properties that instances of this type may or must have. See section [Properties Declarations](#property-declarations) for more information.
| minProperties? | The minimum number of properties allowed for instances of this type.
| maxProperties? | The maximum number of properties allowed for instances of this type.
| additionalProperties? | Boolean that indicates if an object instance has additional properties. See section [Additional Properties](#additional-properties) for more information.<br/><br/>**Default:** `true`
| discriminator? | You may use the `discriminator` property to be able to discriminate the concrete type of an individual object at runtime when, for example, payloads contain ambiguous types (achieved via unions or inheritance). The value must correspond to a name of one of the `properties` that are defined inside a type declaration. The `discriminator` property can not be defined for inline type declarations and should only be used for scalar-valued properties. See section [Using Discriminator](#using-discriminator) for more information.
| discriminatorValue? | You may use the `discriminatorValue` property if a type also defined the `discriminator` property. The value of this property should be a valid value of the property with the name equal to the value of the `discriminator` property; and its being used to identify the declaring type. This value should be unique in the hierarchy of the type. The `discriminatorValue` property can not be defined for inline type declarations. See section [Using Discriminator](#using-discriminator) for more information.<br/><br/>**Default:** the name of the type where the discriminator is applied to

An object type is created by explicitly inheriting from the built-in type object:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: object
    properties:
      name:
        required: true
        type: string
```

#### Property Declarations

Properties of object types are defined using the OPTIONAL **properties** property. The value of the properties property is called a "properties declaration" in this spec. It is an object whose property names specify the allowed property names of the type being declared, and whose property values are either names of types or inline type declarations.

In addition to the properties available in normal type declarations, properties can specify whether they are required or not.

| Property  | Description |
|:----------|:----------|
| required? | Sets if property is optional or not.<br /><br />**Default:** `true`.

The following example declares an object type with two properties:

```yaml
types:
  Person:
    properties:
      name:
        required: true
        type: string
      age:
        required: false
        type: number
```

In order to achieve a more "object oriented" experience, a series of shortcuts are available (see [Shortcuts and Syntactic Sugar](#shortcuts-and-syntactic-sugar)). The example below shows a common idiom:

```yaml
types:
  Person:
    properties:
      name: string # equivalent to ->
                   # name:
                   #  type: string
      age?: number # optional property; equivalent to ->
                   # age:
                   #  type: number
                   #  required: false
```

Furthermore, when the `required` facet on a property is specified explicitly in a type declaration, any question mark in its property name is treated as part of the property name rather than as an indicator that the property is optional.

For example, in

```yaml
types:
  profile:
    properties:
      preference?:
        required: true
```

the `profile` type has a property whose name is `preference?` (including the trailing question mark) and that is required. The same property could be made optional in two equivalent ways:

```yaml
types:
  profile:
    properties:
      preference?:
        required: false
```

or

```yaml
types:
  profile:
    properties:
      preference??:
```

Note:

When an Object Type does not contain the "properties" property, the object is assumed to be unconstrained. That means, it may contain any properties of any type.

#### Additional Properties

By default any instance of an object can have additional properties beyond those specified in its data type `properties` node. Lets assume the following is an instance of the data type `Person` that is described in the previous section.

```yaml
Person:
  name: "John"
  age: 35
  note: "US" # valid additional property `note`
```

The property `note` has been not explicitly declared in the `Person` data type, but is valid based on the fact that all additional properties are by default valid.

To restrict that, one can either use the `additionalProperties` facet to not allow any additional properties by setting the value to `false`, or by specifying regular expression patterns that matches sets of keys and restricts their values: these are called "pattern properties". The patterns are delineated by pairs of opening and closing `/` characters, as follows:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    properties:
      name:
        required: true
        type: string
      age:
        required: false
        type: number
      /^note\d+$/: # restrict any properties whose keys start with "note"
                   # followed by one or more digits to be a string
        type: string
```

This restricts any additional properties whose keys start with "note" followed by one or more digits to be a string. Where as the  example of an object instance with an additional `note` property with value "US" is valid, the following is not:

```yaml
Person:
  name: "John"
  age: 35
  note: 123 # not valid as it is not a string
  address: "US" # valid is it does not match the pattern
```

To force all additional properties to be strings, regardless of their keys, use:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    properties:
      name:
        required: true
        type: string
      age:
        required: false
        type: number
      //: # force all additional properties to be a string
        type: string
```

If a pattern property regular expression also matches an explicitly declared property, the explicitly declared property's definition prevails. If two or more pattern property regular expressions match a property name in an instance of the data type, the first one prevails.

Moreover, if `additionalProperties` is `false` (explicitly or by inheritance) in a given type definition, then pattern properties are not allowed to be set explicitly in that definition. If it is `true` (or omitted) in a given type definition, then pattern properties are allowed and further restrict the allowed additional properties in that type.

#### Inheritance

You can declare object types that inherit from other object types:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: object
    properties:
      name:
        type: string
  Employee:
    type: Person
    properties:
      id:
        type: string
```

You can inherit from more than one type:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: object
    properties:
      name: string
  EmailOwner:
    type: object
    properties:
      email: string
  Employee:
    type: [ Person, EmailOwner ]
    properties:
      id: string
```

For more details see [Object Type Inheritance](#object-type-inheritance)

#### Using Discriminator

When payloads contain ambiguous types (achieved via unions or inheritance) it is often impossible to discriminate the concrete type of an individual object at runtime (for example when deserializing the payload into a statically typed language).

A RAML processor may provide an implementation that automatically select a concrete type from a set of possible types, but one of the simplest options is to actually store some unique value associated with the type inside the object.

The `discriminator` property allows you to set the name of an object property which will be used to discriminate the concrete type, and `discriminatorValue` stores the actual value that may identify the type of an individual object. By default, the value of `discriminatorValue` is the name of the type.   

Here's an example that illustrates how to use `discriminator`:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: object
    discriminator: kind # refers to the `kind` property of object `Person`
    properties:
      kind: string # contains name of the kind of a `Person` instance
      name: string
  Employee: # kind may equal to `Employee; default value for `discriminatorValue`
    type: Person
    properties:
      employeeId: string
  User: # kind may equal to `User`; default value for `discriminatorValue`
    type: Person
    properties:
      userId: string
```

```yaml
data:
  - name: A User
    userId: 111
    kind: User
  - name: An Employee
    employeeId: 222
    kind: Employee
```

You can also override the default for `discriminatorValue` for each individual concrete class. In the following example we will replace the default by their lowercase versions using `discriminatorValue`:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: object
    discriminator: kind
    properties:
      name: string
      kind: string
  Employee:
    type: Person
    discriminatorValue: employee # override default
    properties:
      employeeId: string
  User:
    type: Person
    discriminatorValue: user # override default
    properties:
      userId: string
```

```yaml
data:
  - name: A User
    userId: 111
    kind: user
  - name: An Employee
    employeeId: 222
    kind: employee
```

Neither `discriminator` nor `discriminatorValue` are allowed to be defined for any inline type declarations or union types.

```yaml
# valid when ever there is a key name that can identify a type
types:
  Device:
    discriminator: kind
    properties:
      kind: string
```

```yaml
# invalid in any inline type declarations
application/json:
   discriminator: kind
   properties:
     kind: string
```

```yaml
# invalid for union types
PersonOrDog:
   type: Person | Dog
   discriminator: hasTail
```

### Array Types

Array Types are declared by using the array qualifier at the end of a Type Expression. If you are defining a top-level Array Type ( like the example below ), you can pass the following additional properties to further restrict its behavior.

| Property  | Description |
|:----------|:----------|
| uniqueItems? | Boolean value that indicates if items in the array MUST be unique.
| items? |  Indicates what type all items in the array inherit from. Can be a reference to an existing type or an inline [type declaration](#type-declaration)
| minItems? | Minimum amount of items in array. Value MUST be equal or greater than 0. Defaults to 0.
| maxItems? | Maximum amount of items in array. Value MUST be equal or greater than 0. Defaults to 2147483647.

```yaml
#%RAML 1.0
title: My API With Types
types:
  Email:
    type: object
    properties:
      name:
        type: string
  emails:
    type: Email[]
    minItems: 1
    uniqueItems: true
```

### Scalar Types

RAML provides a predefined set of Scalar Types. You can "extend" these types and add further restrictions. These restrictions are called "facets" and they exist both for scalar and object types. Each scalar type has a predefined set of facets.

|Property Name | Description |
|:--------|:------------|
| facets? | When extending from a scalar type you can define new facets (which can then be set to concrete values by subtypes). The value is an object whose properties map facets names to their types.
| enum? | Enumeration of possible values for this primitive type. Cannot be used with the file type. The value is an array containing string representations of possible values, or a single string if there is only one possible value.

#### Built-in Scalar Types

RAML defines the following built-in types and additional facets.

##### String

A JSON string with the following additional facets:

|Property Name | Description |
|:--------|:------------|
| pattern? | Regular expression that this string should pass.
| minLength? | Minimum length of the string. Value MUST be equal or greater than 0. Defaults to 0
| maxLength? | Maximum length of the string. Value MUST be equal or greater than 0. Defaults to 2147483647

Example:

```yaml
types:
  Email:
    type: string
    minLength: 2
    maxLength: 6
```

##### Number

Any JSON number including [integer](#integer) with the following additional facets:

|Property Name | Description |
|:--------|:------------|
|minimum? | (applicable only for parameters of type number or integer) The minimum attribute specifies the parameter's minimum value.
|maximum? | (applicable only for parameters of type number or integer) The maximum attribute specifies the parameter's maximum value.
|format? | Identifies the format of the value. The value MUST be one of the following: int32, int64, int, long, float, double, int16, int8
|multipleOf? | A numeric instance is valid against "multipleOf" if the result of the division of the instance by this keyword's value is an integer.

Example:

```yaml
types:
  Weight:
    type: number
    minimum: 3
    maximum: 5
    format: int64
    multipleOf: 4
```

##### Integer

A subset of JSON numbers that are positive and negative multiples of 1. The integer type inherits its facets from the [number type](#number).

```yaml
types:
  Age:
    type: integer
    minimum: 3
    maximum: 5
    format: int8
    multipleOf: 1
```

##### Boolean

A JSON boolean without any additional facets.

```yaml
types:
  IsMarried:
    type: boolean
```

##### Date

The following date type representations MUST be supported:

| Type | Description |
|:-----|:------------|
| date-only | the "full-date" notation of [RFC3339](http://xml2rfc.ietf.org/public/rfc/html/rfc3339.html#anchor14), namely `yyyy-mm-dd` (no implications about time or timezone-offset)
| time-only | the "partial-time" notation of [RFC3339](http://xml2rfc.ietf.org/public/rfc/html/rfc3339.html#anchor14), namely hh:mm:ss\[.ff...\] (no implications about date or timezone-offset)
| datetime-only | combined date-only and time-only with a separator of "T", namely yyyy-mm-ddThh:mm:ss\[.ff...\] (no implications about timezone-offset)
| datetime | a timestamp, either in the "date-time" notation of [RFC3339](http://xml2rfc.ietf.org/public/rfc/html/rfc3339.html#anchor14), if _format_ is omitted or is set to `rfc3339`, or in the format defined in [RFC2616](https://www.ietf.org/rfc/rfc2616.txt), if _format_ is set to `rfc2616`

The additional property _format_ MUST only be available when the type equals to _datetime_ and the value MUST be either `rfc3339` or `rfc2616`. Any other values are invalid.

```yaml
types:
  birthday:
    type: date-only # no implications about time or offset
    example: 2015-05-23
  lunchtime:
    type: time-only # no implications about date or offset
    example: 12:30:00
  fireworks:
    type: datetime-only # no implications about offset
    example: 2015-07-04T21:00:00
  created:
    type: datetime
    example: 2016-02-28T16:41:41.090Z
    format: rfc3339 # the default, so needn't be specified
  If-Modified-Since:
    type: datetime
    example: Sun, 28 Feb 2016 16:41:41 GMT
    format: rfc2616 # this time it's required as otherwise the example is in an invalid format
```

##### File

The ​**file**​ type can be used to constrain the content to send through forms. When it is used in the context of web forms it SHOULD be represented as a valid file upload, and in JSON representation, it SHOULD be represented as a base64 encoded string with a file content.

|Property Name | Description |
|:--------|:------------|
| fileTypes? | List of valid content-types for the file. The file type `*/*`` should be a valid value.
| minLength? | Specifies the parameter value's minimum number of bytes. Value MUST be equal or greater than 0. Defaults to 0
| maxLength? | Specifies the parameter value's maximum number of bytes. Value MUST be equal or greater than 0. Defaults to 2147483647

#### Enums

All custom primitive types, except for the file type, can declare an "enum" property. It should contain a set of fixed values.

Example usage of enums

```yaml
#%RAML 1.0
title: My API With Types
types:
  country:
    type: string
    enum: [ usa, rus ]

  sizes:
    type: number
    enum: [ 1, 2, 3 ]
```

#### Custom Scalar Types

Defining a scalar type is similar to defining a custom object type in that you "specialize" a parent type. Here's a custom scalar type that "specializes" the number type and restricts one of its facets (minimum):

```yaml
#%RAML 1.0
title: My API With Types
types:
  positiveNumber:
    type: number
    minimum: 1
```

For convenience, you may specialize the built-in primitive types ( string, number, etc ). However, if you don't wish your custom scalar type to inherit the predefined facets of built-in types you can inherit directly from the "scalar" type.

You can define your own facets:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Date:
    type: string
    facets:
      format: string

  MyDate:
    type: Date
    format: 'dd.mm.yyyy'
```

### Determine Default Types

A RAML processor must be able to determine the default type of a type declaration by using the following rules:

* If, and only if, a type declaration contains a `properties` node; the default type is `object`. For example (based on this rule):

```yaml
types:
  Person:
    type: object
    properties:
```

can also be written

```yaml
types:
  Person:
    # default type is `object`, no need to explicitly define it
    properties:
```

* If, and only if, a type declaration contains neither a `properties` node nor a `type` or `schema` node, then the default type is `string`. For example (based on this rule):

```yaml
types:
  Person:
    properties:
      name: # no type or schema necessary since the default type is `string`
```

* The default type `any` is applied to any `body` node that does not contain `properties`, `type`, or `schema`. For example:

```yaml
body:
  application/json:
    # default type is `any`
```

Or in case that a default media type has been defined

```yaml
body:
  # default type is `any`
```

Of course, each rule can be overridden by explicitly define a type. For example:

```yaml
types:
  Person:
    properties:
      name:
        type: number
```

### Type Expressions

So far we have only used simple type identifiers to refer to other Types (ex: string, object, Person). Type Expressions provide a powerful way of referring to, and even defining, types. Type Expressions can be used wherever a type is expected.
The simplest Type Expression is just the name of a type. But Type expressions also allow you to express Type Unions, Arrays, and maps amongst other things.

|Expression | Description |
|:--------|:------------|
| `Person` | The simplest type expression: A single Type
| `Person[]` | An array of Person objects
| `string[]` | An array of string scalars
| `string[][]` | A bi-dimensional array of string scalars
| `string \| Person` | Union type made of members of string OR Person
| `(string \| Person)[]` | An array of the above type

Type Expressions can be used wherever a Type is expected:

```yaml
#%RAML 1.0
title: My API With Types

types:
  Phone:
    type: object
    properties:
      manufacturer:
        type: string
      numberOfSIMCards:
        type: number
  Notebook:
    type: object
    properties:
      manufacturer:
        type: string
      numberOfUSBPorts:
        type: number
  Person:
    type: object
    properties:
      devices: ( Phone | Notebook )[]
      reports: Person[]
```

You can even "extend" from a type expression. For example:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Phone:
    type: object
    properties:
      manufacturer:
        type: string
      numberOfSIMCards:
        type: number
  Notebook:
    type: object
    properties:
      manufacturer:
        type: string
      numberOfUSBPorts:
        type: number
  Devices:
    type:  ( Phone | Notebook )[]
```

The example above is actually declaring a "Type Alias", which gives a more readable name ( Devices ) to a type defined via a complex type expression ( in this case an array of a union of the types Phone and Notebook ). You can use this technique to give simple names to complex types. Type Aliases can also hold extra properties. For example a description and annotations.

#### Grammar

Type expressions are composed of names of built-in or custom types and certain symbols, as follows:

| Expression  | Description | Examples
|:----------|:----------|:---------|
| | Type name (the basic building block of a type expression) | `number:` a built-in type<br><br>`Person:` a custom type
| (type expression) | Parentheses may be used to disambiguate the expression to which an operator applies. | `Person | Animal[]`<br><br>`( Person | Animal )[]`
| (type expression)[] | Array operator: a unary postfix operator placed after another type expression (enclosed in parentheses, as needed) and indicating that the resulting type is an array of instances of that type expression. | `string[]:` an array of strings<br><br>`Person[][]:` an array of arrays of Person instances
| (type expression 1) &#124; (type expression 2) | Union operator: an infix operator indicating that the resulting type may be either of type expression 1 or of type expression 2. Multiple union operators may be combined between pairs of type expressions. | `string | number:` either a string or a number <br><br> `X | Y | Z`: either an X or a Y or a Z <br><br>`(Manager | Admin)[]:` an array whose members consist of Manager or Admin instances<br><br>`Manager[] | Admin[]:` an array of Manager instances or an array of Admin instances.

There are additional constraints on type expressions when used to define inheritance. They are described at [Rules of Inheritance](#inheritance-and-specialization). For example, the following is not valid (you cannot add properties to a union type).


```yaml
#%RAML 1.0
title: My API With Types
types:
  Phone:
    type: object
    properties:
      manufacturer:
        type: string
      numberOfSIMCards:
        type: number
  Notebook:
    type: object
    properties:
      manufacturer:
        type: string
      numberOfUSBPorts:
        type: number
  Device:
    type: Phone | Notebook
    properties:
      weight: number
```

### Union Types

Union Types are declared using pipes (|) in your type expressions. Union Types are useful to model common scenarios in JSON based applications, for example an array containing objects which can be instances of more than one type.

```yaml
#%RAML 1.0
title: My API With Types
types:
  Phone:
    type: object
    properties:
      manufacturer:
        type: string
      numberOfSIMCards:
        type: number
      kind: string
  Notebook:
    type: object
    properties:
      manufacturer:
        type: string
      numberOfUSBPorts:
        type: number
      kind: string
  Device:
    type: Phone | Notebook
```

A valid instance of a union type must pass all restrictions associated with at least one of the union type options. For example:

```yaml
types:
  CatOrDog:
    type: Cat | Dog # options: Cat or Dog
  Cat:
    type: object
    properties:
      name: string
      color: string
  Dog:
    type: object
    properties:
      name: string
      fangs: string
```

A valid instance of the type `CatOrDog` for example looks like the following:

```yaml
CatOrDog: # follows restrictions applied to the type 'Cat'
  name: "Musia",
  color: "brown"
```

### Inheritance and Specialization

When declaring a RAML Type you are always inheriting from, or specializing, an existing type. The general syntax for inheritance is:

```yaml
MyType:
  type: ParentTypeExpression
```

Depending on the value of ParentTypeExpression, though, the meaning of inheritance will change. It is important to understand the differences:

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: object
    properties:
      name: string
  MyType:
    type: Person
    properties:
      x: string
```

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: object
    properties:
      name: string
  Auditable:
    type: object
    properties:
      personalId: number
  Employee:
    type: [Person, Auditable]
    properties:
      positionName: string
```

```yaml
#%RAML 1.0
title: My API With Types
types:
  MyType:
    type: number
    minimum: 0
```

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: object
    properties:
      name: string
  MyType:
    type: Person[]
    uniqueItems: true
```

```yaml
#%RAML 1.0
title: My API With Types
types:
  Phone:
    type: object
    properties:
      someNumberProperty:
        type: number
  Notebook:
    type: object
    properties:
      someStringProperty:
        type: string
  MyType:
    type: Notebook | Phone
```

Each Inheritance type is explained in detail in the following sections:

#### Object Type Inheritance

Object inheritance works like normal Object Oriented inheritance. A subtype inherits all the properties of its parent type.

```yaml
#%RAML 1.0
title: My API With Types
types:
  B:
    type: object
  A:
    type: B
```

##### Property Overrides

Subtypes can override properties defined in parent types. There are two restrictions:

If a property is required in the parent, it cannot be made optional in the subtype
The type of an already defined property can only be changed to a narrower type ( a type that specializes the parent type )

##### Multiple Inheritance

RAML Types support multiple inheritance for object types. This is achieved by passing a sequence of types:

```yaml
#%RAML 1.0
title: My API With Types
types:
  A:
    type: object
  B:
    type: object
  C:
    type: [ A, B ]
```

Note: Multiple inheritance is only allowed if all Type Expressions are simple object Types. See [Inheritance Restrictions](#inheritance-restrictions).

##### Property Overrides

If multiple parent types define a property with the same name:

* The property will be required if at least one of the declarations are required
* The type of the property will be the narrowest type


#### Scalar Type Specialization

If the type expression is a simple scalar type, specialization is achieved by setting values for previously defined facets.

#### Array Type Specialization

If the outer type of the type expression is an array you can set a value for the available array type facets:

| Property  | Description |
|:----------|:----------|
| uniqueItems? | Boolean value that indicates if items in the array MUST be unique.
| items? |  Indicates what type all items in the array inherit from. Can be a reference to an existing type or an inline [type declaration](#type-declaration)
| minItems? | Minimum amount of items in array. Value MUST be equal or greater than 0. Defaults to 0.
| maxItems? | Maximum amount of items in array. Value MUST be equal or greater than 0. Defaults to 2147483647.

The example below defines an array of numbers and sets its "uniqueItems" facet to true.

```yaml
#%RAML 1.0
title: My API With Types
types:
  NumberSet:
    type: number[]
    uniqueItems: true
```

#### External Types

The RAML 1.0 Type system allows seamless integration of json/xsd schemas as type definitions. This is achieved by implicitly converting references to json/xsd schemas to subtypes of the **external** built-in type.

These types can then be used freely within the RAML Type system as normal types except for one restriction: You cannot inherit from them.

The following type declarations create subclasses of external types.

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person:
    type: !include schemas/PersonSchema.json
```

```yaml
#%RAML 1.0
title: My API With Types
types:
  Person: !include schemas/PersonSchema.xsd
```

##### External Types and Inheritance

External types cannot participate in type inheritance or specialization. In other words: You cannot define sub-types of external types that declare new properties or set facets. You can, however, create simple type wrappers that add metadata, examples and a description.

#### Inheritance Restrictions

* You cannot inherit from types of different kind at the same moment ( kinds are: union types, array types, object types, scalar types )
* You cannot inherit from types extending union types ( ex: you cannot extend from `Pet` if `Pet = Dog | Cat` )
* You cannot inherit from multiple primitive types ( Multiple inheritance is only allowed for object types )
* You cannot inherit from a type that extends Array type ( this will result in simple type aliasing/wrapping )
* Facets are always inherited
* You can fix a previously defined facet to a value if the facet is defined on a superclass
* Properties are only allowed on object types
* You cannot create cyclic dependencies when inheriting
* You cannot inherit from "external" types

### Shortcuts and Syntactic Sugar

RAML Types are meant to be easy to read and write. To make the syntax more concise and in line with traditional object oriented programming languages, as well as familiar for developers who have used JSON schema before, the following shortcuts have been defined:

<table>
<tr>
<td><b></b></td>
<td><b>Example</b></td>
<td><b>Expanded Equivalent</b></td>
</tr>
<tr>
<td>Inline type expression gets expanded to a proper type declaration</td>
<td><pre>Email: string</pre></td>
<td><pre>Email: <br>&nbsp;&nbsp;type: string</pre></td>
</tr>
<tr>
<td>`string` is default type when nothing else defined </td>
<td><pre>Email:</pre></td>
<td><pre>Email:<br>&nbsp;&nbsp;type: string</pre></td>
</tr>
<tr>
<td>`object` is default type when `properties` is defined</td>
<td><pre>Person:<br>&nbsp;&nbsp;properties:</pre></td>
<td><pre>Person:<br>&nbsp;&nbsp;type: object<br>&nbsp;&nbsp;properties:</pre></td>
</tr>
<tr>
<td>Shorthand for Optional Property Syntax (?)</td>
<td><pre>Person:<br>&nbsp;&nbsp;properties:<br>&nbsp;&nbsp;&nbsp;&nbsp;nick?: string</pre></td>
<td><pre>Person:<br>&nbsp;&nbsp;type: object<br>&nbsp;&nbsp;properties:<br>&nbsp;&nbsp;&nbsp;&nbsp;nick:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: string<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;required: false</pre></td>
</tr>
</table>

### Inline Type Declarations

You can declare inline/anonymous types everywhere a type can be referenced other than in a Type Expression.

```yaml
#%RAML 1.0
title: My API With Types
/users/{id}:
  get:
    responses:
      200:
        body:
          application/json:
            type: object
            properties:
              firstname:
                type: string
              lastname:
                type: string
              age:
                type: number
```

### Defining Examples in RAML

It is highly RECOMMENDED that API documentation include a rich selection of examples. RAML supports either the definition of multiple examples or a single one for any given instance of a type declaration.

#### Multiple Examples

The OPTIONAL **examples** property may be used to attach multiple examples to a type declaration. Its value is a map of key-value pairs, where each key represent a unique identifier for an example and the value is a [single example](#single-example) property.

The following is an example of the value of an **examples** property:

```yaml
message: # {key} - unique id
  title: Attention needed
  content: You have been added to group 274
record: # {key} - unique id
  name: log item
  value: permission check
```

#### Single Example

The OPTIONAL **example** property may be used to attach an example of a type's instance to the type declaration. There are two different ways to represents its value.

##### The value is a explicit description of a specific type instance

For example:

```yaml
title: Attention needed
content: You have been added to group 274
```

##### The value is a map that contains the following additional facets

|Property | Description |
|:--------|:------------|
| displayName? | An alternate, human-friendly name for the example. If the example is part of an examples node, the default value is the unique identifier that is defined for this example.
| description? | A longer, human-friendly description of the example.
| (&lt;annotationName&gt;)? | Annotations to be applied to this example. Annotations are any property whose key begins with "(" and ends with ")" and whose name (the part between the beginning and ending parentheses) is a declared annotation name. See section [Annotations](#annotations) for more information.
| value | The actual example of a type instance.
| strict? | By default, an example is validated against any type declaration. Set this to false avoid that.

For example:

```yaml
(pii): true
strict: false
value:
  title: Attention needed
  content: You have been added to group 274
```

#### Example on how to define example/examples in RAML

The following illustrates usage of both example and examples properties at different levels of a RAML API.

```yaml
#%RAML 1.0
title: API with Examples

types:
  User:
    type: object
    properties:
      name: string
      lastname: string
    example:
      name: Bob
      lastname: Marley
  Org:
    type: object
    properties:
      name: string
      address?: string
      value? : string
/organisation:
  post:
    headers:
      UserID:
        description: the identifier for the user that posts a new organisation
        type: string
        example: SWED-123 # single scalar example
    body:
      application/json:
        type: Org
        example: # single request body example
          name: Doe Enterprise
          value: Silver
  get:
    description: Returns an organisation entity.
    responses:
      201:
        body:
          application/json:
            type: Org
            examples:
              acme:
                name: Acme
              softwareCorp:
                value: # validate against the available facets for the map value of an example
                  name: Software Corp
                  address: 35 Central Street
                  value: Gold # validate against instance of the `value` property
```

### XML Serialization of Type Instances

As the serialization to XML may be a complex process, RAML introduces an additional `xml` node for [type declarations](#type-declarations) that allows to configure how type instances should be serialized to XML. The value of the `xml` node is a map that contains the following nodes.

| Name | Type | Description |
|:---------|:------:|:-----------------|
| attribute? | `boolean` | If `attribute` is set to `true`, a type instance should be serialized as an XML attribute. It can only be `true` for scalar types.<br/><br/>**Default:** `false`
| wrapped? | `boolean` | If `wrapped` is set to `true`, a type instance should be wrapped in its own XML element. It can not  be `true` for scalar types and it can not  be `true` at the same moment when `attribute` is `true`. <br/><br/>**Default:** `false`
|  name? | `string` | Allows to override the name of the XML element or XML attribute in it's XML representation.<br/><br/>**Default:** the name of the type
| namespace? | `string` | Allows to configure the name of the XML namespace.
| prefix? | `string` |  Allows to configure the prefix which will be used during serialization to XML.

The following is a type declaration example that uses the `xml` node:

```yaml
types:
  Person:
    properties:
      name:
        type: string
        xml:
          attribute: true # serialize it as an XML attribute
          name: "fullname" # attribute should be called fullname
      addresses:
        type: Address[]
        xml:
          wrapped: true # serialize it into it's own <addresses>...</addresses> XML element
  Address:
    properties:
      street: string
      city: string
```

The example above may be serialized into the following XML:

```xml
<Person fullname="John Doe">
  <addresses>
     <Address>…</Address>
     ...
  </addresses>
</Person>
```

### Using Types in RAML

* Types may be used in several positions:
  * Body ( JSON )
  * Body ( XML )
  * Body ( Web Form )
  * Headers
  * Query Parameters
  * URI Parameters
* Serialization rules depend on both the type and the position in which it is used
* When declaring a custom value type ( extending the "value" built-in type ) it will have "string" as its default serialization target.
* When extending one of the built-in types, your type will inherit the serialization target

## Resources and Nested Resources

Resources are identified by their relative URI, which MUST begin with a slash ("/"). Every property whose key begins with a slash, and is either at the root of the API definition or is the child property of a resource property, is such a resource property.

A resource defined as a root-level property is called a top-level resource. Its property's key is the resource's URI relative to the baseUri (if any). A resource defined as a child property of another resource is called a nested resource, and its property's key is its URI relative to its parent resource's URI.

This example shows an API definition with one top-level resource, /gists, and one nested resource, /public.

```yaml
#%RAML 1.0
title: GitHub API
version: v3
baseUri: https://api.github.com
/gists:
  displayName: Gists
  /public:
    displayName: Public Gists
```

The key of a resource property, i.e. its relative URI, MAY consist of multiple URI path fragments separated by slashes; e.g. /bom/items may indicate the collection of items in a bill of materials as a single resource. However, if the individual URI path fragments are themselves resources, the API definition SHOULD use nested resources to describe this structure; e.g. if /bom is itself a resource then /items should be a nested resource of /bom, vs using /bom/items as a non-nested resource.

Absolute URIs are not explicitly specified. They are computed by starting with the baseUri and appending the relative URI of the top-level resource, and then successively appending the relative URI values for each nested resource until the target resource is reached.

Taking the previous example, the absolute URI of the public gists resource is formed as follows.

```
   "https://api.github.com"               <--- baseUri
               +
             "/gists"                     <--- gists resource relative URI
               +
             "/public"                    <--- public gists resource relative URI
               =
"https://api.github.com/gists/public"     <--- public gists absolute URI
```

A nested resource can itself have a child (nested) resource, creating a multiply-nested resource. In the following example, /user is a top-level resource that has no children; /users is a top-level resource that has a nested resource, /{userId}; and the nested resource, /{userId}, has three nested resources, /followers, /following, and /keys.


```yaml
#%RAML 1.0
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

The computed absolute URIs for the resources, in the same order as their resource declarations, are as follows.

```
https://api.github.com/user
https://api.github.com/users
https://api.github.com/users/{userId}
https://api.github.com/users/{userId}/followers
https://api.github.com/users/{userId}/following
https://api.github.com/users/{userId}/keys
https://api.github.com/users/{userId}/keys/{keyId}
```

The value of a resource property is an object whose properties are described in the following table.

|Property | Description |
|:--------|:------------|
| displayName? | An alternate, human-friendly name for the resource.
| description? | A longer, human-friendly description of the resource.
| (&lt;annotationName&gt;)? | Annotations to be applied to this resource. Annotations are any property whose key begins with "(" and ends with ")" and whose name (the part between the beginning and ending parentheses) is a declared annotation name. See section [Annotations](#annotations).
| get?<br>patch?<br>put?<br>post?<br>delete?<br>options?<br>head? | Object describing the method. See section [Methods](#methods) for more information.
| is? | A list of the traits to apply to all methods declared (implicitly or explicitly) for this resource. See section [Applying Resource Types and Traits](#applying-resource-types-and-traits) for more information. Individual methods may override this declaration
| type? | The resource type which this resource inherits. See section [Applying Resource Types and Traits](#applying-resource-types-and-traits) for more information.
| securedBy? | The security schemes that apply to all methods declared (implicitly or explicitly) for this resource. See section [Applying Security Schemes](#applying-security-schemes) for more information.
| uriParameters? | Detailed information about any URI parameters of this resource
| /&lt;relativeUri&gt;? | A nested resource is identified as any property whose name begins with a slash ("/") and is therefore treated as a relative URI.

### Resource Display Name

The OPTIONAL **displayName** property provides a friendly name to the resource and can be used by documentation generation tools. If the displayName property is not defined for a resource, documentation tools SHOULD refer to the resource by its property key (i.e. its relative URI, e.g., /jobs), which acts as the resource's name.

### Resource Description

The OPTIONAL **description** property can be used to provide a longer description of the resource. It is RECOMMENDED that all resources provide such a description.

### Template URIs and URI Parameters

[Template URIs](#template-uri) containing URI parameters can be used to define a resource's relative URI when it contains variable elements. The following example shows a top-level resource with a key /jobs and a nested resource with a key /{jobId}.

```yaml
#%RAML 1.0
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs: # its fully-resolved URI is https://app.zencoder.com/api/{version}/jobs
  description: A collection of jobs
  /{jobId}: # its fully-resolved URI is https://app.zencoder.com/api/{version}/jobs/{jobId}
    description: A specific job, a member of the jobs collection
```

The OPTIONAL **uriParameters** property is used to explicitly specify URI parameters in a [Template URI](#template-uri). The value of the uriParameters property is an object, specifically a [properties declaration](#property-declarations), as is the value of the properties object of a type declaration. Each property in this declaration object is referred to as a **URI parameter declaration**. The name of each such property corresponds to the name of a parameter in the [Template URI](#template-uri), while its value specifies the URI parameter's type, as the name of a type or an inline type declaration.

Every property in a uriParameters declaration MUST correspond exactly to the name of a URI parameter in the resource's relative URI. But not every URI parameter in the resource's relative URI must be explicitly specified in the uriParameters property. Every parameter in the relative URI not specified in the uriParameters property MUST still be treated as a URI parameter, of type string, and required.

Just as is the case for [the baseUriParameters root property](#base-uri-and-base-uri-parameters), the version parameter is a reserved parameter name in the uriParameters properties declaration, with a value corresponding to the value of the version root-level property.

The example below shows two top-level resources (/user and /users) and a nested resource specified by its [Template URI](#template-uri), /{userId}. The URI parameter userId is explicitly declared, and given a description and an integer type.

```yaml
#%RAML 1.0
title: GitHub API
version: v3
baseUri: https://api.github.com
/user:
  description: The currently authenticated User
/users:
  description: All users
  /{userId}:
   description: A specific user
   uriParameters:
     userId:
       description: The id of the user
       type: integer
```

If a URI parameter declaration specifies an array, object, or union of non-scalar types, then processors MUST default to treating the format of the URI parameter value as JSON in applying the type to instances of that URI parameter. The following demonstrates an extreme example of the expected behavior.

```yaml
#%RAML 1.0
title: Serialization API

/users:
  description: All users
  /{userIds}:
   description: A specific user
   uriParameters:
     userIds:
       description: A list of userIds
       type: array
       items:
         type: string
         minLength: 1
         uniqueItems: true
```

In the example above, the URI parameter `userIds` is an array of ids. Let us assume the array should contain `[blue,green]` which then, on the wire may look as: `/users/%5B%22blue%22,%22green%22%5D/`.

If a URI parameter declaration specifies a non-string scalar type for the value of the header, the standard serialization rules for types MUST be invoked in applying the type to instances of that URI parameter.

The values matched by URI parameters MUST NOT contain slash (/) characters, in order to avoid ambiguous matching. In the example above, a URI (relative to the baseUri) of /jobs/123 matches the /{jobId} resource nested within the /jobs resource, but a URI of /jobs/123/x does not match any of those resources.

In the example below, the top-level resource has two URI parameters, folderId and fileId.

```yaml
#%RAML 1.0
title: Flat Filesystem API
version: v1
/files:
  description: A collection of all files
  /folder_{folderId}-file_{fileId}:
    description: An item in the collection of all files
```

Although URI parameters can be explicitly specified to be optional, they SHOULD be required when they are surrounded directly by slashes ("/"), that is, when they constitute complete URI path fragments, e.g. .../{objectId}/.... It usually makes little sense to allow a URI to contain adjacent slashes with no characters between them, e.g. ...//.... Hence, a URI parameter should only be specified as optional when it appears adjacent to other text; e.g., /people/~{fieldSelectors} indicates that the {fieldSelectors} URI parameter can be blank, and therefore optional, indicating that /people/~ is a valid relative URI.

A special URI parameter, **ext**, is a reserved parameter. It may or may not be specified explicitly in a uriParameters property, but its meaning is reserved: it is used by a client to specify that the body of the request or response be of the associated media type.

|URI Parameter | Value |
|:--------|:------------|
| ext | The desired media type of the request or response body

By convention, a value for the ext parameter of .json is equivalent to an Accept header of application/json, and a value of .xml is equivalent to an Accept header of text/xml. By employing the ext parameter, clients may specify the media type of a request or response via the URI rather than via the Accept HTTP header. For example, in the following example, the /users resource may be requested as application/json or text/xml:

```yaml
#%RAML 1.0
title: API Using media type in the URL
version: v1
/users{ext}:
  uriParameters:
    ext:
      enum: [ .json, .xml ]
      description: Use .json to specify application/json or .xml to specify text/xml
```

## Methods

In a RESTful API, methods are operations that are performed on a resource. The OPTIONAL properties **get**, **patch**, **put**, **post**, **delete**, **head**, and **options** of a resource define its methods; these correspond to the HTTP methods defined in the HTTP version 1.1 specification [RFC2616](https://www.ietf.org/rfc/rfc2616.txt) and its extension, [RFC5789](https://tools.ietf.org/html/rfc5789). The value of any of these method properties is an object whose properties are described in the following table.

|Property | Description |
|:--------|:------------|
| displayName? | An alternate, human-friendly name for the method (in the resource's context).
| description? | A longer, human-friendly description of the method (in the resource's context).
| (&lt;annotationName&gt;)? | Annotations to be applied to this method. Annotations are any property whose key begins with "(" and ends with ")" and whose name (the part between the beginning and ending parentheses) is a declared annotation name. See section [Annotations](#annotations) for more information.
| queryParameters? | Detailed information about any query parameters needed by this method. Mutually exclusive with queryString.
| headers? | Detailed information about any request headers needed by this method.
| queryString? | Specifies the query string needed by this method. Mutually exclusive with queryParameters.
| responses? | Information about the expected responses to a request.
| body? | Some methods admit request bodies, which are described by this property.
| protocols? | A method can override the protocols specified in the resource or at the API root, by employing this property. See section [Method-level Protocols](#method-level-protocols) for more information.
| is? | A list of the traits to apply to this method. See [Applying Resource Types and Traits](#applying-resource-types-and-traits) section.
| securedBy? | The security schemes that apply to this method. See section [Applying Security Schemes](#applying-security-schemes) for more information.

### Method-level Display Name

The OPTIONAL **displayName** property provides a friendly name for the method and can be used by documentation generation tools. If the displayName property is not defined for a method, documentation tools SHOULD refer to the resource by its property key, which acts as the method's name.

### Method-level Description

The OPTIONAL **description** property describes the operation of the method on the resource. Its value is a markdown string. It is RECOMMENDED that all methods provide such a description.

The following example shows a resource, /jobs, with post and get methods declared.

```yaml
#%RAML 1.0
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs:
  post:
    description: Create a *new* job
  get:
    description: List some or all jobs
```

### Headers

An API's methods may support or require various HTTP headers. The OPTIONAL **headers** property is used to explicitly specify those headers. The value of the headers property is an object, specifically a [properties declaration](#property-declarations), as is the value of the properties object of a type declaration. Each property in this declaration object is referred to as a header **declaration**. The name of each such property specifies an allowed header name, while its value specifies the header value's type, as the name of a type or an inline type declaration.

The following simple example shows a post method with a single HTTP header named Zencoder-Api-Key of (implied) string type.

```yaml
#%RAML 1.0
title: ZEncoder API
version: v2
baseUri: https://app.zencoder.com/api/{version}
/jobs:
  post:
    description: Create a job
    headers:
      Zencoder-Api-Key:
        description: The API key needed to create a new job
```

If a header declaration specifies an array type for the value of the header, processors MUST interpret this as allowing multiple instances of that header in the request or response, as appropriate. In such a case, the underlying type of the array -- namely, the type of the elements of the array -- MUST be applied as the type of the value of instances of this header.

If a header declaration specifies a non-array type for the value of the header (or doesn't specify a type, which is equivalent to specifying a string type), processors MUST interpret this as disallowing multiple instances of that header in the request or response, as appropriate.

If a header declaration specifies an object type or a union of non-scalar types for the value of the header, or if it specifies an array type for the value of the header and the underlying type of the array is an object or array type or a union of non-scalar types, then validation is not defined by RAML; processors MAY default to treating the format of the header value as JSON in applying the type to instances of that header, or they MAY allow other treatments based on annotations.

Note that some headers may also be added by the intermediate client- and server-side systems such as a browser or a proxy.

The following example illustrates inheriting headers from a trait, allowing multiple instances of a header, specifying examples, and overriding them when they're applied to a method and a resource.

```yaml
#%RAML 1.0
title: Example with headers
traits:
  chargeable:
    headers:
      X-Dept:
        type: array
        description: |
          A department code to be charged.
          Multiple such headers are allowed.
        items:
          pattern: ^\d+\-\w+$
          example: 230-OCTO
  traceable:
    headers:
      X-Tracker:
        description: A code to track API calls end to end
        pattern: ^\w{16}$
        example: abcdefghijklmnop
/users:
  get:
    is: [ chargeable, traceable ]
    description: |
      The HTTP interaction will look like

      GET /users HTTP/1.1
      X-Dept: 18-FINANCE
      X-Dept: 200-MISC
      X-Tracker: gfr456d03ygh38s2
    headers:
      X-Dept:
        example: [ 18-FINANCE, 200-MISC ]
      X-Tracker:
        example: gfr456d03ygh38s2
```

### Query Strings and Query Parameters

An API's methods may support or require a query string in the URL on which they are invoked. The query string in a URL is defined in [RFC3986](https://www.ietf.org/rfc/rfc3986.txt) as the part of the URL following the question mark separator ("?") and preceding any fragment ("#") separator. The query string may be specified either by the OPTIONAL **queryString** property or by the OPTIONAL **queryParameters** property. The queryString and queryParameters properties are mutually exclusive: processors MUST NOT allow both to be specified (explicitly or implicitly) on the same method of the same resource.

#### The Query String as a Whole

The queryString property is used to specify the query string as a whole, rather than as name-value pairs. Its value is either the name of a type or an inline type declaration.

If the queryString property specifies a non-scalar type or a union of non-scalar types, then processors MUST default to treating the format of the query string as JSON in applying the type to instances of that query string. They MAY allow other treatments based on annotations.

The following example shows a get method with a query string that is expected to be in JSON format.

```yaml
#%RAML 1.0
title: Example with query string
/users:
  get:
    queryString:
      description: We filter based on a JSON-formatted query string
      type: !include schemas/usersFilter.json
```

#### Query Parameters in a Query String

The queryParameters property is used to specify the set of query parameters from which the query string is composed. Processors MUST regard the query string as a set of query parameters according to the URL encoding format when applying the restrictions in the API definition. The value of the queryParameters property is an object, specifically a [properties declaration](#property-declarations), as is the value of the properties object of a type declaration. Each property in this declaration object is referred to as a **query parameter declaration**. The name of each such property specifies an allowed query parameter name, while its value specifies the query parameter value's type, as the name of a type or an inline type declaration.

If a query parameter declaration specifies an array type for the value of the query parameter, processors MUST interpret this as allowing multiple instances of that query parameter in the request or response, as appropriate. In such a case, the underlying type of the array -- namely, the type of the elements of the array -- MUST be applied as the type of the value of instances of this query parameter.

If a query parameter declaration specifies a non-array type for the value of the query parameter (or doesn't specify a type, which is equivalent to specifying a string type), processors MUST interpret this as disallowing multiple instances of that query parameter in the request.

If a query parameter declaration specifies an object type or a union of non-scalar types for the value of the query parameter, or if it specifies an array type for the value of the query parameter and the underlying type of the array is an object type or union of non-scalar types, then processors MUST default to treating the format of the query parameter value as JSON in applying the type to instances of that query parameter.

If a query parameter declaration specifies a non-string scalar type or union of non-string scalar types for the value of the query parameter, or if it specifies an array type for the value of the query parameter and the underlying type of the array is a non-string scalar type or union of non-string scalar types, the standard serialization rules for types MUST be invoked in applying the type to instances of that query parameter.

The following example shows a get method that uses HTTP query parameters; it will be sent to https://api.github.com/v3/users?page=1&per_page=50 (assuming the example values are used).


```yaml
#%RAML 1.0
title: GitHub API
version: v3
baseUri: https://api.github.com/{version}
/users:
  get:
    description: Get a list of users
    queryParameters:
      page:
        description: Specify the page that you want to retrieve
        type:        integer
        required:    true
        example:     1
      per_page:
        description: Specify the amount of items that will be retrieved per page
        type:        integer
        minimum:     10
        maximum:     200
        default:     30
        example:     50
```

### Method-level Protocols

A method can explicitly set the OPTIONAL **protocols** property to specify the protocol(s) used to invoke it, thereby overriding the protocols set elsewhere, e.g. in the baseUri or the root-level **properties** property.

In the following example, the get method is accessible through both HTTP and HTTPS, while the rest of the API requires HTTPS.

```yaml
#%RAML 1.0
title: Twitter API
version: 1.1
baseUri: https://api.twitter.com/{version}
/search/tweets.json:
  description: Search all tweets
  get:
    description: Returns a collection of relevant Tweets matching a specified query
    protocols: [ HTTP, HTTPS ]
```

### Bodies

The HTTP request **body** for a method is specified using the OPTIONAL body property. For example, to create a resource using a POST or PUT, the body of the request would usually include the details of the resource to be created.

The value of the body property is termed a **body declaration**. The body declaration is an object whose property names are the valid media types of the request body and whose property values are the corresponding data type declaration or data type name describing the request body. If [default media types](#default-media-type) has been declared at the root of the API, then the body declaration may alternatively be directly the data type declaration or data type name describing the request body for that media type.

In the first case above, when the property names represent media types, each property name MUST be a media type string conforming to the media type specification in [RFC6838](#https://tools.ietf.org/html/rfc6838).

The following example illustrates various combinations of both default and non-default media types, and both data type declarations and references.

```yaml
#%RAML 1.0
title: Example of request bodies
mediaType: application/json
types:
  User:
    properties:
      firstName:
      lastName:
/users:
  post:
    body:
      type: User
/groups:
  post:
    body:
      application/json:
        properties:
          groupName:
          deptCode:
            type: number
      text/xml:
        type: !include schemas/group.xsd
```

## Responses

The resources and methods sections of this document have so far described HTTP requests. This section describes the HTTP responses to method invocations on resources.

The OPTIONAL **responses** property of a method on a resource describes the possible responses to invoking that method on that resource. Its value is an object whose property names are the possible HTTP status codes for that method on that resource, and whose property values describe the corresponding responses. Each such value is termed a **response declaration**.

Note that the properties of the responses object are often numeric, e.g. 200 or 204. Processors MUST treat these numeric keys as string keys for all purposes. For example, '200' and 200 MUST be treated as equivalent property keys and therefore not both would be allowed simultaneously since they would constitute duplicate properties.

The value of a response declaration is an object that may contain any of the following properties.

|Property | Description |
|:--------|:------------|
| description? | A longer, human-friendly description of the response
| (&lt;annotationName&gt;) | Annotations to be applied to this response. Annotations are any property whose key begins with "(" and ends with ")" and whose name (the part between the beginning and ending parentheses) is a declared annotation name. See section [Annotations](#annotations) for more information.
| headers? | Detailed information about any response headers returned by this method
| body? |  The body of the response

The OPTIONAL properties **description**, **headers**, **body**, and **annotations** have the same syntax and semantics as they do for [method declarations](methods), but applied to HTTP responses rather than HTTP requests.

The following example illustrates some possible responses.

```yaml
#%RAML 1.0
title: Example with responses
mediaType: application/json
types:
  Invoice:
    properties:
      amount:
        type: number
        minimum: 0
      vendorName:
/invoices:
  get:
    responses:
      200:
        body:
          type: Invoice
          properties:
            id: number
  post:
    body:
      type: Invoice
    responses:
      201:
        headers:
          Location:
            example: /invoices/45612
        body:
          application/json:
            type: !include schemas/invoice.json
          text/xml:
            type: !include schemas/invoice.xsd
      422:
        body:
          properties:
            error:
          example:
            error: Amount cannot be negative
```

## Resource Types and Traits

There are many advantages to reusing patterns across multiple resources and methods.  For example, after defining a collection-type resource's characteristics, that definition can be applied to multiple resources. This use of patterns encourages consistency and reduces complexity for both servers and clients.

Moreover, resource and method declarations are frequently repetitive. For example, an API that requires OAuth authentication might require an X-Access-Token header for all methods across all resources. For many reasons it may be preferable to define such a pattern in a single place and apply it consistently everywhere.

A resource type, like a resource, can specify security schemes and methods and other properties. Resources that use a resource type inherit its properties. A resource type can also use, and thus inherit from, another resource type. Resource types and resources are related through an inheritance chain pattern. Resource type definitions MUST NOT incorporate nested resources; they cannot be used to generate nested resources when they are applied to a resource, and they do not apply to its existing nested resources.

A trait, like a method, can provide method-level properties such as description, headers, query string parameters, and responses. Methods that use one or more traits inherit those traits' properties. Resources and resource types can also use, and thus inherit from, one or more traits, which then apply to all of their methods. Traits are related to methods through a mixing pattern.

### Declaration Resource Types and Traits

Resource types may be declared via the OPTIONAL **resourceTypes** property at the root of the API definition. The value of this property is an object whose property names become names of resource types that can be referenced throughout the API, and whose property values are resource type declarations.

Similarly, traits may be declared via the OPTIONAL **traits** property at the root of the API definition. The value of this property is an object whose property names become names of traits that can be referenced throughout the API, and whose property values are trait declarations.

Resource type and trait declarations can have the following properties, in addition to all the properties that resources and methods may have, respectively (except that resource type declarations MUST NOT have nested resource properties).

| Property | Definition |
|:---------|:-----------|
| usage? | The OPTIONAL **usage** property of a resource type or trait provides instructions on how and when the resource type or trait should be used. Documentation generators MUST convey this property as characteristics of the resource and method, respectively. However, the resources and methods MUST NOT inherit the usage property: neither resources nor methods allow a property named usage.

The following example illustrates the declaration of several resource types and traits.

```yaml
#%RAML 1.0
title: Example API
version: v1
resourceTypes:
  collection:
    usage: This resourceType should be used for any collection of items
    description: The collection of <<resourcePathName>>
    get:
      description: Get all <<resourcePathName>>, optionally filtered
    post:
      description: Create a new <<resourcePathName | !singularize>>
traits:
  secured:
    usage: Apply this to any method that needs to be secured
    description: Some requests require authentication.
    headers:
      access_token:
        description: Access Token
        example: 5757gh76
        required: true
```

The following example builds on the previous one, but the the resource types and traits are defined in external files that are included by using an !include tag.

```yaml
#%RAML 1.0
title: Example API
version: v1
resourceTypes:
  collection: !include resourceTypes/collection.raml
  member: !include resourceTypes/member.raml
traits:
  secured: !include traits/secured.raml
  rateLimited: !include traits/rate-limited.raml
```

Neither resource types nor traits are allowed to incorporate nested resources. Therefore, the following example is invalid:

```yaml
resourceTypes:
  hasGroups:
    get:
    patch:
    delete:
    /groups:
```

### Applying Resource Types and Traits

Resources may specify the resource type from which they inherit using the OPTIONAL **type** property. The resource type MUST be the name of a resource type defined within the root-level resourceTypes property or in a library. Resource type definitions do not apply to existing nested resources.

Similarly, methods may specify one or more traits from which they inherit using the OPTIONAL **is** property. Its value is an array of any number of elements where each MUST be the name of a trait defined within the root-level traits property or in a library. A trait may also be applied to a resource by using the **is** property, which is equivalent to applying the trait to all methods for that resource, whether declared explicitly in the resource definition or inherited from a resource type. The order of a trait getting applied to a method is from left to right; according to the traits defined in the **is** property. Trait definitions do not apply to nested resources.

The following example illustrates the application of resource types and traits.

```yaml
#%RAML 1.0
title: Example API
version: v1
resourceTypes:
  collection:  !include resourceTypes/collection.raml
  member:      !include resourceTypes/member.raml
traits:
  secured:     !include traits/secured.raml
  paged:       !include traits/paged.raml
  rateLimited: !include traits/rate-limited.raml
/users:
  type: collection
  is: [ secured ]
  get:
    is: [ paged, rateLimited ] # this method is also secured
  post:                        # this method is also secured
```

To pass parameter values to resource types and traits, use a map when declaring the resource type or trait to be used, as illustrated in the following example.

```yaml
#%RAML 1.0
title: Example API
version: v1
resourceTypes:
  searchableCollection:
   get:
      queryParameters:
        <<queryParamName>>:
          description: Return <<resourcePathName>> that have their <<queryParamName>> matching the given value
        <<fallbackParamName>>:
          description: If no values match the value given for <<queryParamName>>, use <<fallbackParamName>> instead
traits:
  secured:
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

### Resource Type and Trait Parameters

The declarations of resource types and traits MAY contain parameters, whose values MUST be specified when applying the resource type or trait, UNLESS the parameter corresponds to a reserved parameter name, in which case its value MUST be provided by the processing application.

Parameters are indicated in resource type and trait definitions by double angle brackets (double chevrons) enclosing the parameter name; for example, <<parameterName>>.

In resource type and trait declarations, there are two reserved parameter names: **resourcePath** and **resourcePathName**.

| Parameter | Value |
|:---------|:-----------|
| resourcePath | The resource's full URI relative to the baseUri (if any)
| resourcePathName | The rightmost path fragment of the resource's relative URI, omitting any parametrizing brackets ("{" and "}")

A processing application MUST set the value of <<resourcePath>> to the concatenation of the inheriting resource's relative URI with all its parent resources' relative URIs, that is, to its URI relative to the baseUri (if any). For example, a resource /users nested in a resource /{groupId} nested in a root-level resource /groups, and applying a resource type or trait that uses the resourcePath parameter, would have the value of that parameter set to /groups/{groupId}/users.

A processing application MUST set the value of <<resourcePathName>> to the part of the inheriting resource's relative URI following the rightmost slash ("/"), after omitting any parametrizing brackets ("{" and "}"). For example, a resource /jobs/{jobId} applying a resource type or trait that uses the resourcePathName parameter would have the value of that parameter set to jobId.

Processing applications MUST also omit any ext parameter and its parametrizing brackets ("{" and "}") found in the resource's URI when setting resourcePath and resourcePathName. For example, a root-level resource /bom/{itemId}{ext} applying a resource type or trait that uses the resourcePathName and resourcePath parameters would have the value of those parameters set to /bom/{itemId} and itemId, respectively.

In trait declarations, there is an additional reserved parameter named **methodName**.

| Parameter | Value |
|:---------|:-----------|
| methodName | The name of the method

The processing application MUST set the value of the methodName parameter to the inheriting method's name.

Parameter values MAY further be transformed by applying one of the following functions. The only locale supported by this version of RAML is United States English.

| Function | Definition |
|:---------|:-----------|
| !singularize | The <b>!singularize</b> function MUST act on the value of the parameter by a locale-specific singularization of its original value.<br><br>for example: `users --> user`
| !pluralize | The <b>!pluralize</b> function MUST act on the value of the parameter by a locale-specific pluralization of its original value. <br><br>for example: `user --> users`
| !uppercase | The <b>!uppercase</b> function MUST convert the value of the parameter to uppercase letters.<br><br>for example: `userId --> USERID`
| !lowercase | The <b>!lowercase</b> function MUST convert the value of the parameter to lowercase letters.<br><br>for example: `userId --> userid`
| !lowercamelcase | The <b>!lowercamelcase</b> function MUST convert the value of the parameter to camel case where the first letter is lowercase.<br><br>for example: `userId --> userId`
| !uppercamelcase | The <b>!uppercamelcase</b> function MUST convert the value of the parameter to camel case where the first letter is uppercase.<br><br>for example: `userId --> UserId`
| !lowerunderscorecase | The <b>!lowerunderscorecase</b> function MUST convert the value of the parameter to lowercase letters; if the value is a compound word, the function MUST also add an additional underscore between consecutive words which are not already separated by one or more underscores.<br><br>for example: `userId` --> `user_id`
| !upperunderscorecase | The <b>!upperunderscorecase</b> function MUST convert the value of the parameter to uppercase letters; if the value is a compound word, the function MUST also add an additional underscore between consecutive words which are not already separated by one or more underscores.<br><br>for example: `userId --> USER_ID`
| !lowerhyphencase | The <b>!lowerhyphencase</b> function MUST convert the value of the parameter to lowercase letters; if the value is a compound word, the function MUST also add an additional hyphen between consecutive words which are not already separated by one or more hyphen.<br><br>for example: `userId --> user-id`
| !upperhyphencase | The <b>!upperhyphencase</b> function MUST convert the value of the parameter to uppercase letters; if the value is a compound word, the function MUST also add an additional hyphen between consecutive words which are not already separated by one or more hyphen.<br><br>for example: `userId --> USER-ID`

To apply these functions, append them to the parameter name within the double angle brackets, separated from the parameter name with a pipe ("|") character and optional whitespace padding. Here is an example that uses both functions as well as reserved parameters:

```yaml
#%RAML 1.0
title: Example API
version: v1
mediaType: application/json
types:
  Users: !include types/users.raml
  User:  !include types/user.raml
resourceTypes:
  collection:
    get:
      responses:
        200:
          body:
            type: <<resourcePathName>> # e.g. Users
    post:
      responses:
        200:
          body:
            type: <<resourcePathName | !singularize>>  # e.g. User
  member:
    get:
      responses:
        200:
          body:
            type: <<resourcePathName>> # e.g. User
traits:
  secured:
    description: Some requests require authentication
    queryParameters:
      <<methodName>>: # e.g. get:
        description: A <<methodName>>-token pair is required  # e.g. A get-token pair...
        example: <<methodName>>=h8duh3uhhu38   # e.g. get=h8duh3uhhu38
```

Parameters may not be used within !include tags, that is, within the location of the file to be included.

### Declaring HTTP Methods as Optional

When defining resource types, it can be useful to capture patterns that manifest several levels below the inheriting resource, without mandating the creation of the intermediate levels. For example, a resource type declaration may describe a body parameter that would be used if the API defines a post method for that resource, but applying the resource type to a resource without a post method should not create the post method.

To accommodate this need, a resource type definition MAY append a question mark ("?") suffix to the name of any method that should not be applied if it doesn't already exist in the resource at the corresponding level. The question mark suffix indicates that the value of the method property in the resource type should be applied if the method name itself (without the question mark) is already defined (whether explicitly or implicitly) at the corresponding level in that resource.

The following example shows a resource type called corpResource with an optional post? property that defines a required header called X-Chargeback and also a custom parameter called TextAboutPost. If the inheriting resource defines a post method, it will include the X-Chargeback header requirement and TextAboutPost MUST be defined as well. If the inheriting resource does not define a post method, one will not have to define the X-Chargeback header or be forced to define the TextAboutPost parameter by dint of inheriting from the corpResource resource type.

```yaml
#%RAML 1.0
title: Example of Optional Properties
resourceTypes:
  corpResource:
    post?:
      description: Some info about <<TextAboutPost>>.
      headers:
        X-Chargeback:
          required: true
/servers:
  type:
    corpResource:
      TextAboutPost: post method # post defined which will force to define the TextAboutPost parameter
  get:
  post: # will require the X-Chargeback header
/queues:
  type: corpResource
  get:
  # will not have a post method defined which means the TextAboutPost parameter is
  # not required; same for the X-Chargeback header
```

### Algorithm of Merging Traits With Methods

Each RAML element has its branch of the RAML document. Informally, applying a trait to method may be described as putting traits branch under the methods branch.
Formally, it is a recursive procedure:
1. Those properties of method node which are undefined in trait node remain unchanged.
2. The method node receives all properties of trait node (excluding optional) which are undefined in method node.
3. As for properties defined in both method node and trait node (including optional):
  * Scalar properties remain unchanged
  * Collection properties are merged by value (see below)
  * Values of object properties are subjected to the same procedure starting at step 1.

In general case a method can have more than one trait each having a sufficient hierarchy. Applying all of them is equivalent to building a stack of branches:

1. Top branch is the methods branch.
2. Other branches are traits branches.
  * Branches of those traits which are farther from the method in hierarchical sense, lay deeper (a trait may occur on different hierarchy distances, and we consider the closest one).
  * Those traits which lay on the same hierarchy distance from the method, can be ordered in a queue:
    * For distance one it's just the methods trait list.
    * Queue(d+1) is obtained from Queue(d) by concatenating trait lists of its elements and canceling all but the first occurence of each trait.
    * Branches order is determined as follows: those traits, which have higher positions in the queue, also have their branches deeper in our stack.

Finally, the resource can have its own traits, and it can be applied a chain of resource types (call them resourceType1, resourceType2, etc), each possibly having its own traits and defining the same method. The  stack is constructed as follows:
1. Traits of method itself
2. Traits of resource owning the method
3. Traits of method owned by resourceType1
4. Traits of resourceType1
5. etc.

Merging resource types with resources obeys similar rules.

The following example illustrates how a resource type gets merged into the `/products` resource.

```yaml
resourceTypes:
  collection:
    get:
      description: a list
      headers:
        APIKey:
/products:
  type: collection
  get:
    description: override the description
    responses:
      200:
        body:
          application/json:
```

The only overlap between the `collection` resource type and the resource declaration is `description` which is defined in both. In this example, the final version will have the description that has been explicitly defined in the resource.

Every explicit node will win over the ones that are declared in a resource type or trait. The rest is simply merged. The final merged result must be:

```yaml
/resource:
  get:
    headers:
      APIKey:
    description: override the description
    responses:
      200:
        body:
          application/json:
```

### Resource Types and Traits Effect on Collections

All the collections or sequences which fall under effect of applying traits and resource types are merged. Consider an example of query parameter which has its enum values defined in both resource and trait:

```yaml
#%RAML 1.0
title: Example API
version: v1
traits:
  parameters:
    queryParameters:
      platform:
        enum:
          - win
          - mac
/installer:
  get:
    queryParameters:
      platform: #the actual enum is [ mac, unix, win ]
        enum:
          - mac
          - unix
```

In this example the resulting enum value is `[ mac, unix, win ]`.

Important case of collections is a trait, which can appear as "is" attribute value for method, resource, trait or resource type. Such lists may contain same traits which differ in parameter sets and, thus, can not be considered equal:

```yaml
#%RAML 1.0
title: Example API
version: v1
resourceTypes:
  apiResource:
    get:
      is: [ { secured : { tokenName: access_token } } ]
traits:
  secured:
    queryParameters:
      <<tokenName>>:
        description: A valid <<tokenName>> is required
/servers:
  get:
    is: [ { secured : { tokenName: token } } ]
```

In resolving such a collision priority is given to that trait occurrence which is closer to the target method (or resource). In the example above the `tokenName` parameter value for the `GET:/servers` method is `token`, and the trait list consists of single trait occurrence: `[ {secured:{ tokenName:token}} ]`.

## Security Schemes

Most REST APIs have one or more mechanisms to secure data access, identify requests, and determine access level and data visibility.

This section describes how an API designer MAY include security scheme definitions in RAML API definitions. This section also outlines the support documentation that the client and server implementation generators SHOULD include.

### Security Scheme Types

RAML supports the following built-in security scheme types:

|Type       |Description|
|:----------|:----------|
|OAuth 1.0  | The API's authentication requires using OAuth 1.0 as described in [RFC5849](https://tools.ietf.org/html/rfc5849)
|OAuth 2.0  | The API's authentication requires using OAuth 2.0 as described in [RFC6749](https://tools.ietf.org/html/rfc6749)
|Basic Authentication| The API's authentication relies on using Basic Access Authentication as described in [RFC2617](https://tools.ietf.org/html/rfc2617)
|Digest Authentication| The API's authentication relies on using Digest Access Authentication as described in [RFC2617](https://tools.ietf.org/html/rfc2617)
|Pass Through| Headers or Query Parameters are passed through to the API based on a defined mapping.
|x-{other}| The API's authentication relies on another authentication method.

A processing application's developers MAY provide support for these mechanisms. If a mechanism is supported, it MUST conform to the specified standard.

Additionally, any security scheme definition may be augmented with a describedBy property, which allows the designer to document the API's security scheme.

### Security Scheme Declaration

Security scheme is declared as follows:

|Property   |Description|
|:----------|:----------|
| type | The security schemes property MUST be used to specify an API's security mechanisms, including the required settings and the authentication methods that the API supports. one authentication method is allowed if the API supports them. The value MUST be one of the following: OAuth 1.0, OAuth 2.0, Basic Authentication, Digest Authentication, Pass Through, x-&lt;other&gt;
| displayName? | An alternate, human-friendly name for the security scheme.
| description? | The description MAY be used to describe a security scheme.
| describedBy? | A description of the request components related to Security that are determined by the scheme: the headers, query parameters or responses. As a best practice, even for standard security schemes, API designers SHOULD describe these properties of security schemes. Including the security scheme description completes an API documentation. See explanation about [describedBy](#describedby) for more information.
| settings? | The settings attribute MAY be used to provide security scheme-specific information. The required attributes vary depending on the type of security scheme is being declared. It describes the minimum set of properties which any processing application MUST provide and validate if it chooses to implement the security scheme. Processing applications MAY choose to recognize other properties for things such as token lifetime, preferred cryptographic algorithms, and more. See explanation about [settings](#settings) for more information.

An optional **securitySchemes** property is defined for RAML document root.

As value it has an object whose properties map security scheme names to security scheme declarations.
Each authentication pattern supported by the API must be expressed as component of **securitySchemes** property value.

In this example, the Dropbox API supports authentication via OAuth 2.0 and OAuth 1.0:
```yaml
#%RAML 1.0
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securitySchemes:
  oauth_2_0:
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
      authorizationGrants: [ authorization_code, refresh_token ]
  oauth_1_0:
    description: |
      OAuth 1.0 continues to be supported for all API requests, but OAuth 2.0 is now preferred.
    type: OAuth 1.0
    settings:
      requestTokenUri: https://api.dropbox.com/1/oauth/request_token
      authorizationUri: https://www.dropbox.com/1/oauth/authorize
      tokenCredentialsUri: https://api.dropbox.com/1/oauth/access_token
```

#### describedBy

The value of the **describedBy** property is defined as follows:

|Property   |Description|
|:----------|:----------|
| headers? | Optional array of headers, documenting the possible headers that could be accepted. See section [Headers](#headers) for more information.
| queryParameters? | Query parameters, used by the schema in order to authorize the request. Mutually exclusive with queryString. See section [Query Strings and Query Parameters](#query-strings-and-query-parameters) for more information.
| queryString? | Specifies the query string, used by the schema in order to authorize the request. Mutually exclusive with queryParameters. See section [Query Strings and Query Parameters](#query-strings-and-query-parameters) for more information.
| responses? | Optional array of responses, describing the possible responses that could be sent. See section [Responses](#responses) for more information.
| (&lt;annotationName&gt;)? | Annotations to be applied to this security scheme part. Annotations are any property whose key begins with "(" and ends with ")" and whose name (the part between the beginning and ending parentheses) is a declared annotation name. See section [Annotations](#annotations) for more information.

#### Settings

The settings attribute MAY be used to provide security scheme specific information. The required attributes vary depending on the type of security scheme is being declared.

It describes the minimum set of properties which any processing application MUST provide and validate if it chooses to implement the security scheme. Processing applications MAY choose to recognize other properties for things such as token lifetime, preferred cryptographic algorithms, and more.

##### OAuth 1.0

Security schemes of this type have specific settings object:

|Property |Description |
|:--------|:------------|
|requestTokenUri| The URI of the *Temporary Credential Request endpoint* as defined in [RFC5849 Section 2.1](https://tools.ietf.org/html/rfc5849#section-2.1)
|authorizationUri| The URI of the *Resource Owner Authorization endpoint* as defined in [RFC5849 Section 2.2](https://tools.ietf.org/html/rfc5849#section-2.2)
|tokenCredentialsUri| The URI of the *Token Request endpoint* as defined in [RFC5849 Section 2.3](https://tools.ietf.org/html/rfc5849#section-2.3)

OAuth 1.0 authentication follows the standard described in [RFC5849](https://tools.ietf.org/html/rfc5849). The following is an example:

```yaml
#%RAML 1.0
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securitySchemes:
  oauth_1_0:
    description: |
      OAuth 1.0 continues to be supported for all API requests, but OAuth 2.0 is now preferred.
    type: OAuth 1.0
    settings:
      requestTokenUri: https://api.dropbox.com/1/oauth/request_token
      authorizationUri: https://www.dropbox.com/1/oauth/authorize
      tokenCredentialsUri: https://api.dropbox.com/1/oauth/access_token
```

##### OAuth 2.0

Security schemes of this type has specific settings object:

|Property |Description |
|:--------|:------------|
|authorizationUri| The URI of the *Authorization Endpoint* as defined in [RFC6749 Section 3.1](https://tools.ietf.org/html/rfc6749#section-3.1)
|accessTokenUri| The URI of the *Token Endpoint* as defined in [RFC6749 Section 3.2](https://tools.ietf.org/html/rfc6749#section-3.2)
|authorizationGrants| A list of the Authorization grants supported by the API As defined in RFC6749 Sections [4.1](https://tools.ietf.org/html/rfc6749#section-4.1), [4.2](https://tools.ietf.org/html/rfc6749#section-4.2), [4.3](https://tools.ietf.org/html/rfc6749#section-4.3) and [4.4](https://tools.ietf.org/html/rfc6749#section-4.4), can be any of: code, token, owner or credentials.
|scopes| A list of scopes supported by the API as defined in [RFC6749 Section 3.3](https://tools.ietf.org/html/rfc6749#section-3.3)

OAuth 2.0 authentication follows the standard described in [RFC6749](https://tools.ietf.org/html/rfc6749). The following is an example:

```yaml
#%RAML 1.0
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securitySchemes:
  oauth_2_0:
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
      authorizationGrants: [ authorization_code, refresh_token ]
```

##### Basic Authentication

Note: Basic security does not require any further specification of settings in the API Definition.

```yaml
#%RAML 1.0
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securitySchemes:
  basic:
    description: |
      This API supports Basic Authentication.
    type: Basic Authentication
```

##### Digest Authentication

Note: Digest security does not require any further specification of settings in the API Definition.

```yaml
#%RAML 1.0
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securitySchemes:
  digest:
    description: |
      This API supports DigestSecurityScheme Authentication.
    type: Digest Authentication
```

##### Pass Through

Pass Through authentication does not have any specific settings defined and the implementation is known to RAML. One MUST provide a value for every header or queryParameter defined in describedBy, and passed along with the request without modification. The following is an example:

```yaml
#%RAML 1.0
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securitySchemes:
  passthrough:
    description: |
      This API supports Pass Through Authentication.
    type: Pass Through
    describedBy:
      queryParameters:
        query:
          type: string
      headers:
        api_key:
          type: string
```

##### x-&lt;other&gt;

x-&lt;other&gt; authentication methods do not have any specific settings defined, as their implementation is unknown as a standard for RAML. These security schemes may only include a description and a describedBy section, to allow documentation of the intended use of the security scheme. The following is an example:

```yaml
#%RAML 1.0
title: Custom API
version: 1
baseUri: https://api.custom.com/{version}
securitySchemes:
  custom_scheme:
    description: |
      A custom security scheme for authenticating requests.
    type: x-custom
    describedBy:
      headers:
        SpecialToken:
          description: |
            Used to send a custom token.
          type: string
      responses:
        401:
          description: |
            Bad token.
        403:
```

#### Applying Security Schemes

The **securedBy** attribute of RAML document root may be used to apply security schemes to every method of API. This specifies that all methods in the API (unless they have their own securedBy attribute) can be authenticated by any mentioned security scheme.

Applying a security scheme to a method overrides whichever security scheme has been applied to the API as whole.
To indicate that the method is protected using a specific security scheme, the method MUST be defined by using the **securedBy** attribute.

The value assigned to the securedBy attribute MUST be a list of any of the security schemes previously defined in the **securitySchemes** property of RAML document root.

```yaml
#%RAML 1.0
title: Dropbox API
version: 1
baseUri: https://api.dropbox.com/{version}
securedBy: [oauth_2_0]
securitySchemes:
  oauth_2_0: !include securitySchemes/oauth_2_0.raml
  oauth_1_0: !include securitySchemes/oauth_1_0.raml
/users:
  get:
    securedBy: [oauth_2_0, oauth_1_0]
```

To indicate that the method may be called without applying any security scheme, the method may be provided with securedBy attribute containing null as array component.

```yaml
#%RAML 1.0
title: GitHub API
version: v3
baseUri: https://api.github.com
securitySchemes:
  oauth_2_0: !include securitySchemes/oauth_2_0.raml
/users/{userid}/gists:
  get:
    securedBy: [null, oauth_2_0]
```

A resource can also be applied a list of security schemes using the **securedBy** attribute. This specifies that all methods of this particular resource (unless they have their own securedBy attribute) can be authenticated by any mentioned security scheme. Value of resources attribute overrides that of the root attribute. Security Schemes applied to a resource MUST NOT incorporate nested resources; they do not apply to its existing nested resources.

Applying a security scheme to a method overrides security schemes applied to the API and resources having the method as sibling.

If the processing application supports custom properties, custom parameters can be provided to the security scheme at the moment of inclusion in a method.

In the following example, the parameter **scopes** is being assigned:

```yaml
#%RAML 1.0
title: GitHub API
version: v3
baseUri: https://api.github.com
securitySchemes:
  oauth_2_0: !include securitySchemes/oauth_2_0.raml
/users/{userid}/gists:
  get:
    securedBy: [null, oauth_2_0: { scopes: [ ADMINISTRATOR ] } ]
```

The list of parameters that must and may be provided to the security scheme is specified by the security scheme type.

## Annotations

Annotations provide a mechanism to extend the API specification with metadata beyond the metadata already defined in this RAML 1.0 specification. Annotations can also be regarded as a mechanism to add properties to the built-in RAML properties in certain locations within the RAML specification. Processors MAY support certain annotations to add additional specificity to the API description, enable tooling such as testing, support API repositories and API discovery, and so on. Processors MAY ignore any and all annotations.

Annotations used in an API specification MUST be declared in a root-level annotationTypes property. Annotations can have values, which are defined and constrained in annotation type declarations. Processors can then rely on the declarations to ensure annotation values are as expected.

The following is an example of various annotation type declarations and the application of the annotations to an API definition.

```yaml
#%RAML 1.0
title: Illustrating annotations
mediaType: application/json
annotationTypes:
  experimental:
  feedbackRequested:
  testHarness:
    type: string # This line may be omitted as it's the default type
  badge:         # This annotation type, too, allows string values
  clearanceLevel:
    properties:
      level:
        enum: [ low, medium, high ]
        required: true
      signature:
        pattern: "\\d{3}-\\w{12}"
        required: true
/groups:
  (experimental):
  (feedbackRequested):
/users:
  (testHarness): usersTest
  (badge): tested.gif
  (clearanceLevel):
    level: high
    signature: 230-ghtwvfrs1itr
  get:
    (experimental):
    (feedbackRequested):
    responses:
      200:
```

Annotations applied to a data type are not inherited when that data type is inherited. However, processors SHOULD make the information about the annotations in the data type hierarchy available. Annotations applied to, or applied within, a resource type or trait are also applied to the resource type or resource or method that inherits it. In particular, if a trait is applied to a resource type or resource, all annotations on or within that trait are applied implicitly to all methods of that resource. If the inheriting resource type or resource or method directly (explicitly) apply an annotation of a given type, then this annotation overrides all applications of that annotation type which would otherwise have been inherited and implicitly applied. In particular, if a trait is applied to a resource type or resource, and the resource type or resource apply an annotation of some type, then any and all applications of annotations of that type to that trait are overridden.

### Declaring Annotation Types

Annotation types are declared using the OPTIONAL root-level **annotationTypes** property. The value of the annotationsType property is an object whose keys define annotation type names, also referred to as annotations, and whose values are objects called annotation type declarations. An annotation type declaration has the same syntax as a data type declaration, and its facets have the same syntax as the corresponding ones for data types, but with the addition of the allowedTargets facet. Just as a data type declaration constrains the value of a URI parameter, query parameter, header, or body of that type, so an annotation type declaration constrains the value of an annotation of that type. The allowedTargets facet restricts at which kinds of locations the annotation may be applied. Annotation types, like data types, may extend other data types, but annotation types may not themselves be extended nor used anywhere data types may be used.

|Property |Description |
|:--------|:------------|
| displayName? | The displayName attribute specifies the $self's display name. It is a friendly name used only for display or documentation purposes. If displayName is not specified, it defaults to the element's key (the name of the property itself).
| description? | The description attribute describes the intended use or meaning of an annotation. This value MAY be formatted using markdown.
| (&lt;annotationName&gt;)? | Annotations to be applied to this annotation type. Annotations are any property whose key begins with “(“ and ends with “)” and whose name (the part between the beginning and ending parentheses) is a declared annotation name. See section [Annotations](#annotations) for more information.
| allowedTargets? | Restrictions on where annotations of this type can be applied. If this property is specified, annotations of this type may only be applied on a property corresponding to one of the target names specified as the value of this property. Value MUST be one or more of the options described in table [Annotation Target Location](#annotation-target-location).

If an annotation type declaration specifies neither a type facet nor a properties facet, then it defaults to a type of string.

All annotations used in an API specification MUST be declared in its annotationTypes property. Any value of an annotation MUST be valid according to its annotation type.

If the allowedTargets property is not present, then the annotation may be applied in any of the target locations listed in the Target Locations table below. If the allowedTargets property is present, it restricts where the annotation may be applied, as described in the section below.


### Applying Annotations

For an annotation to be applied in an API specification, the annotation MUST be declared in an annotation type.

A declared annotation may be applied to an object in the specification by adding a property on that object whose key is the name of the annotation type enclosed in parentheses, and whose value is called an annotation value and MUST be valid according to the corresponding annotation type.

The example below, a small subset of the previous example, shows an explicit declaration and use of a testHarness annotation whose value should be a string.

```yaml
#%RAML 1.0
title: Testing annotations
mediaType: application/json
annotationTypes:
  testHarness:
    type: string
/users:
  (testHarness): usersTest
```

The following is semantically equivalent but relies on the implicit default declaration of the value type when there is no explicit type declaration.

```yaml
#%RAML 1.0
title: Testing annotations
mediaType: application/json
annotationTypes:
  testHarness:
/users:
  (testHarness): usersTest
```

#### Annotating Scalar-valued Nodes

It is often useful to annotate scalar-valued nodes, e.g. `baseUri`. Since annotations are applied as extra key-value pairs to nodes that accept key-value pairs already (i.e. map-valued nodes), they cannot be easily applied to scalar-valued nodes. To apply annotations to any scalar-valued node, a RAML processor MUST also support scalar-valued nodes to be expressed as a map, with the single allowed key `value`, as an alternative to the normal syntax.

The example below shows a scalar-valued node which is normally expressed as:

```yaml
baseUri: http://www.example.com/api
```

and the alternative map syntax, with `value` as key:

```yaml
baseUri:
  value: http://www.example.com/api
```

and then annotations may be applied as usual, e.g.:

```yaml
baseUri:
  value: http://www.example.com/api
  (redirectable): true
```

The following is a list of all available scalar-valued nodes supported in RAML:
<a name="scalar-valued-nodes"></a>
```
displayName
description
type
schema
default
example
usage
repeat
required
content
strict
minLength
maxLength
uniqueItems
minItems
maxItems
discriminator
minProperties
maxProperties
discriminatorValue
pattern
format
minimum
maximum
multipleOf
requestTokenUri
authorizationUri
tokenCredentialsUri
accessTokenUri
title
version
baseUri
mediaType
extends
```

#### Annotation Targets

The location within an API specification where annotations may be applied MUST be one of the target locations in the following Target Locations table. The targets are the locations themselves, not sub-properties within the locations; for example, the Method target refers to the method property and not to the method's display name, description, etc.

<a name='annotation-target-location'></a>

|Target | Description |
|:--------|:------------|
| API | The root of a RAML document
| DocumentationItem | An item in the collection of items that is the value of the root-level documentation property
| Resource | A resource (relative URI) property, root-level or nested
| Method | A method property
| Response | A property of the responses property, whose key is an HTTP status code
| RequestBody | The body property of a method
| ResponseBody | The body property of a response
| TypeDeclaration | A data type declaration (inline or in a global types collection), header declaration, query parameter declaration, or URI parameter declaration, or property within any of these declarations, where the type property may be used.
| Example | Either an example or examples property
| ResourceType | A resource type property
| Trait | A trait property
| SecurityScheme | A security scheme declaration
| SecuritySchemeSettings | The settings property of a security scheme declaration
| AnnotationType | A property of the annotationTypes property, whose key is a name of an annotation type and whose value describes the annotation.
| Library | The root of a library
| Overlay | The root of an overlay
| Extension | The root of an extension

The following example illustrates applying some restrictions on the allowed targets of annotations.

```yaml
#%RAML 1.0
title: Illustrating allowed targets
mediaType: application/json
annotationTypes:
  meta-resource-method:
    allowedTargets: [ Resource, Method ]
  meta-data:
    allowedTargets: TypeDeclaration
types:
  User:
    type: object
    (meta-data): on an object; on a data type declaration
    properties:
      name:
        type: string
        (meta-data): on a string property
/users:
  (meta-resource-method): on a resource
  get:
    (meta-resource-method): on a method
    responses:
      200:
        body:
          type: User[]
          (meta-data): on a body
```

## Modularization

RAML provides several mechanisms to help modularize your API specification and specifications ecosystem:
* Includes
* Libraries
* Overlays
* Extensions

### Includes

RAML processors MUST support the OPTIONAL **!include** tag, which specifies the inclusion of external files into the API specification. As it is a YAML tag, it starts with an exclamation point ("!"). The location in an API specification where an !include tag may be used MUST be the value of a property, so the result of including the file specified by the !include tag is the value of that property.

In the following example, the set of types to be used elsewhere in the RAML specification is retrieved from a file called myTypes.raml and used as the value of the types property in the RAML specification.

```yaml
#%RAML 1.0
title: My API with Types
types: !include myTypes.raml
```

The !include tag accepts a single argument, the location of the content to be included, that MUST be specified explicitly. Its value MUST be one of the following:

|Argument | Description | Examples |
|:--------|:------------|:---------|
| absolute path | A path that begins with a single slash ("/") and is to be interpreted relative to the root RAML file's location. | /traits/pageable.raml
| relative path | A path that does not begin with a single slash ("/") nor is a URL, and is to be interpreted relative to the including file's location. | description.md<br>../traits/pageable.raml
| URL | An absolute URL | http://dev.domain.com/api/patterns/traits.raml

To simplify API definition, and because the included file's parsing context is not shared between the included file and its parent, an included file SHALL NOT use a YAML reference to an anchor in a separate file. Likewise, a reference made from a parent file SHALL NOT reference an anchor defined in an included file.

The argument of the !include tag must be static: namely, it MUST NOT contain any resource type parameters or trait parameters.

#### Typed Fragments

A file to be included MAY begin with a RAML fragment identifier line, which consists of the text _#%RAML_ followed by a single space followed by the text 1.0, followed by a single space followed by one of the following fragment identifiers:

|Fragment | Description |
|:--------|:------------|
| DocumentationItem | An item in the collection of items that is the value of the root-level documentation property; see the section on [User Documentation](#user-documentation).
| DataType | A data type declaration, where the type property may be used; see the section on [Types](#types)
| NamedExample | A property of the examples property, whose key is a name of an example and whose value describes the example; see the section on [Examples](#defining-examples-in-raml)
| ResourceType | A single resource type declaration; see the section on [Resource Types and Traits](#resource-types-and-traits)
| Trait | A single trait declaration; see the section on [Resource Types and Traits](#resource-types-and-traits)
| AnnotationTypeDeclaration | A single annotation type declaration; see the section on [Annotations](#annotations)
| Library | A RAML library; see the section on [Libraries](#libraries).
| Overlay | An overlay file; see the section on [Overlays](#overlays).
| Extension | An extension file; see the section on [Extensions](#extensions).

If a file begins with a RAML fragment identifier line, and the fragment identifier is neither Library nor Overlay nor Extension, the contents of the file after removal of the RAML fragment identifier line MUST be valid structurally according to the corresponding section of this RAML specification. For example, a RAML file beginning with `#%RAML 1.0 Trait` must have the structure of a RAML trait declaration as defined in the [specification for traits](#resource-types-and-traits), such that including the file in a location where a trait declaration is called for results in a valid RAML file.

The following example shows a RAML fragment file that defines a resource type, and a file that includes this fragment file.


```yaml
#%RAML 1.0 ResourceType

#This file is located at resourceTypes/collection.raml

description: A collection resource
usage: Use this to describe resource that list items
get:
  description: Retrieve all items
post:
  description: Add an item
  responses:
    201:
      headers:
        Location:
```

```yaml
#%RAML 1.0
title: Products API
resourceTypes:
  collection: !include resourceTypes/collection.raml
/products:
  type: collection
  description: All products

```

The resulting API definition is equivalent to the following single document.

```yaml
#%RAML 1.0
title: Products API
resourceTypes:
  collection:
    description: A collection resource
    usage: Use this to describe resource that list items
    get:
      description: Retrieve all items
    post:
      description: Add an item
      responses:
        201:
          headers:
            Location:
/products:
  type: collection
  description: All products
```

#### Resolving Includes

When RAML or YAML files are included, RAML parsers MUST not only read the content, but parse it and add the content to the declaring structure as if the content were declared inline. Specifically, if the included file has one of the following media types:

* application/raml+yaml
* text/yaml
* text/x-yaml
* application/yaml
* application/x-yaml

or a .raml or .yml or .yaml extension, RAML parsers MUST parse the content the file as RAML content and append the parsed structures to the RAML document's node. Otherwise, the contents of the file will be included as a scalar.

To simplify RAML definitions, and because the included files parsing context is not shared between the included file and its parent, an included file SHALL NOT use a YAML reference to an anchor in a separate file. Likewise, a reference made from a parent file SHALL NOT reference a structure anchor defined in an included file.

In the example below, the API root document includes two files from the patterns folder, one containing resource type declarations and the other containing trait declarations.

```yaml
#%RAML 1.0
title: Example API
version: v1
resourceTypes: !include patterns/resourceTypes.raml
traits: !include patterns/traits.raml
```

```yaml
#%RAML 1.0
# This file is located at patterns/resourceTypes.raml

collection:
  get:
    is: paged
  post:
member:
  get:
  patch:
  delete:
```

```yaml
#%RAML 1.0
# This file is located at patterns/traits.raml

chargeable:
  headers:
    dept_code:
paged:
  queryParameters:
    start:
      type: number
```

The resulting API definition is equivalent to the following single document.

```yaml
#%RAML 1.0
title: Example API
version: v1
resourceTypes:
  collection:
    get:
      is: paged
    post:
  member:
    get:
    patch:
    delete:
traits:
  chargeable:
    headers:
      dept_code:
  paged:
    queryParameters:
      start:
        type: number
```

#### References to inner elements of external files

RAML 1.0 supports referring to inner elements of included schemas by using URL fragments.


```yaml
schema: !include elements.xsd#Foo
```

```yaml
/id: !include myContent.raml#feature
```

Dereferencing to a fragment of JSON schemas is performed according to default JSON Schema dereferencing  rules (see chapter 7 in http://json-schema.org/latest/json-schema-core.html)

Dereferencing to a fragment of XSD schema is described in *3.15.2.2 References to Schema Components*, [XML Schema Part 1: Structures Second Edition](http://www.w3.org/TR/xmlschema-1/). However there is a special shortcut: If you are referring to a named type within XSD schema you may simplify fragment definition to its name.

Meaning of references to inner elements: referencing to inner element of schema is equivalent to referencing to the schema with a top level element with structural restrictions same as restrictions on the referenced element of schema. At this version of RAML specification it is allowed to refer on elements of schemas in the following cases:

* referencing to an element of JSON schema is valid in any context, but they do not define name of top level XML element  when serializing to XML payload
* referencing to an element of XSD schema is valid in any context
* references to XSD complex types are valid to determine inner structure of payload but they do not define name of top level XML element when serializing to XML payload
* any other kinds of references does not have well defined meaning

### Libraries

RAML libraries are used to combine any collection of data type declarations, resource type declarations, trait declarations, and security scheme declarations into modular, externalized, reusable groups. While libraries are meant to allow definition of common declarations in external documents which are then included where needed, they may also be defined inline.

A library is an object whose allowed properties are enumerated in the following table. Each is optional.

|Property | Description |
|:--------|:------------|
| types?<br>schemas?<br>resourceTypes?<br>traits?<br>securitySchemes?<br>annotationTypes?<br>(&lt;annotationName&gt;)?<br>uses? | The definition of each property is the same as that of the corresponding property in the root of a RAML document. Annotation properties are allowed as in any other RAML document.
| usage | Describes the content or purpose of a specific library. The content may be described in markdown.

The following example shows a simple library as a standalone, reusable RAML fragment document.

```yaml
#%RAML 1.0 Library
usage: |
  Use to define some basic file-related constructs.
types:
  File:
    properties:
      name:
      length:
        type: integer
traits:
  drm:
    headers:
      drm-key:
resourceTypes:
  file:
    get:
      is: drm
    put:
      is: drm
```

#### Applying Libraries

Any number of libraries may be applied by using the OPTIONAL **uses** property which may ONLY be used at the root of a RAML file (either a root ["master"] RAML file or a RAML fragment file). The value of the uses property is a map of key-value pairs where its keys are treated as library names, or namespaces, and the value MUST be the location of a RAML library file, usually an external RAML library fragment document.

When a library is applied, the data types, resource types, traits, security schemes, and annotation types which it declared are made available in the document in which it was applied, but are referenced via names formed by concatenating the library name followed by a period (".") followed by the name of the data type, resource type, trait, security scheme, or annotation type. In this way the library name defines a namespace for the library's objects within the context in which the library was applied. That means, namespaces defined in a **uses** statement in a specific file are only consumable within that file, i.e. they are only used to disambiguate the included libraries from each other within that file. Therefore, any processor MUST not be permitted to allow any composition of namespaces using "." across multiple libraries.

Using **uses** does NOT automatically import the remote library's assets into the local file, but it allows the local file to import those assets by referring to them in its contents: e.g., a RAML type fragment file that uses a library of remote types can then import one of those types by referring to it, and that remote type will be included as if it were defined locally within the RAML type fragment file.

The following examples demonstrate the use of a library in a second library, and the use of that second library in a resource type fragment as well as in RAML API definition.

```yaml
#%RAML 1.0 Library
# This file is located at libraries/file-type.raml
types:
  File:
    properties:
      name:
      length:
        type: integer
```

```yaml
#%RAML 1.0 Library
# This file is located at libraries/files.raml
usage: |
  Use to define some basic file-related constructs.
uses:
  file-type: libraries/file-type.raml
traits:
  drm:
    headers:
      drm-key:
resourceTypes:
  file:
    get:
      is: drm
      responses:
        201:
          body:
            application/json:
              type: file-type.File
    put:
      is: drm

```

```yaml
#%RAML 1.0 ResourceType
# This file is located at files-resource.raml
uses:
  files: libraries/files.raml
get:
  is: files.drm
```

The following example is not valid according to the restriction that chaining namespaces is not allowed.

```yaml
#%RAML 1.0 ResourceType
# Invalid RAML Fragment
uses:
  files: libraries/files.raml
get:
  is: files.drm
  responses:
    200:
      body:
        application/json:
          type: files.file-type.File # invalid - no chaining allowed
```

### Overlays and Extensions

API definitions may need to be extended in a variety of ways for different needs. Annotations allow for adding metadata beyond that which is standardized in this RAML specification. Another set of needs is satisfied by overlaying standard or non-standard metadata on top of an existing API definition without changing its behavior, for example to specify implementation details or provide a translation of human-oriented documentation into different languages. Yet another set of needs requires extending an API definition by adding to its behavior or overriding certain aspects. RAML provides two mechanisms for doing so: overlays and extensions.

Overlays and extensions are RAML documents that add or override properties of a RAML API definition. The first line of an overlay or extension document MUST begin with the text _#%RAML 1.0 Overlay_ or _#%RAML 1.0 Extension_, respectively, followed by nothing but the end of the line. An overlay or extension document MUST contain a root-level `extends` property whose value MUST be the location of a valid RAML API definition, or another overlay or extension; the location is specified equivalently to the location specified in the value of an !include tag (as an absolute or relative path or as a URL). The document specified in the `extends` property is called the master RAML document.

The remainder of an overlay or extension document follows the same rules as a RAML API definition, but with certain restrictions in case of an overlay, as discussed in section about [Overlays](#overlays).

To apply an overlay or extension, RAML processors MUST apply the merging algorithm described in the Merging Rules section below to the master RAML document and the extension or overlay, thereby producing a modified API definition; in the case of applying an overlay, the modified API definition is then validated against the master RAML document to adhere to the restrictions on overlays.

To apply any combination of overlays and/or extensions, all of them must share the same master RAML document; the first is applied to the master RAML document as before, producing a modified API definition, and validating the result in the case of an overlay; then the second overlay or extension is applied to that modified API definition as if the latter were the master RAML document, and again validating the result in the case of an overlay; and so on until the last overlay or extension. All !include tags are resolved before any application of the merging algorithm, the validation of restrictions on overlays occurs after each overlay is applied, and all inheritances (of types, resource types, traits, and annotation types) are applied at the end of the application of all overlays and extensions.

#### Overlays

An overlay adds or overrides properties of a RAML API definition while preserving its behavioral, functional aspects. Certain properties of a RAML API definition specify the behavior of an API: its resources, methods, parameters, bodies, responses, etc. These may not be changed by applying an overlay. In contrast, other properties such as descriptions or annotations address concerns beyond the functional interface, such as the human-oriented descriptive documentation in some language, or implementation or verification information for use in automated tools. These may be changed by applying an overlay.

Overlays are particularly important for separating interface from implementation, and for enabling separate lifecycles for the behavioral aspects of the API that need to be controlled more tightly as a contract between the API provider and its consumers, versus the human- or implementation-oriented aspects that can evolve at different paces. For example, adding hooks for testing and monitoring tools, appending metadata relevant to a registry of APIs, or or providing updated or translated human documentation can be achieved without changing any aspects of the behavioral aspects of the API, which may be controlled through a more rigorous version and change management process.

While it is difficult to draw a definitive line between the two, for example because some semantics of the API is often captured only in human documentation, RAML does define the specific behavior-invariance restrictions on overlay files which processors MUST follow. Processors may then choose to offer the master API definition as well as its modifications after applying one or more overlays, so the consumer may benefit from all the information available; for example, if overlay files are provided as a means of localizing textual descriptions of resources, methods, and data, the consumer of generated documentation may be offered a choice of which localized overlays to apply.

The behavior-invariance restrictions of an overlay are defined as follows: after applying the merging algorithm described in the Merging Rules section, and before any inheritances (of types, resource types, traits, and annotation types) are applied, the tree of nodes in the merged document is compared with the tree of nodes in the master RAML document after resolving all !include tags. Any differences MUST only be in properties listed in the following table.

|Property | Allowed differences |
|:--------|:------------|
| title<br>description<br>documentation<br>usage<br>example | The merged tree may include new properties of this type, or properties with different values than those in the master tree.
| types | In addition to allowed differences described elsewhere in this table, the merged tree may also include new data types.
| annotationTypes | The merged tree may include new annotation types, or new values for existing annotation types, as long as all annotations in the merged API definition validate against the annotation types in the merged tree.
| any annotation property | The merged tree may include new annotations of annotation types declared in the merged tree, or annotations with different values than those in the master tree.
| examples | The merged tree may contain new named examples, or named examples with different values than those in the master tree.
| documentation | The merged tree may contain new items in the array that is the value of the documentation root-level property. To change or remove existing items, the documentation property itself may be overridden in the overlay.

The following example illustrates a (very) simple RAML definition of a library books API, along with an overlay file that provides a Spanish translation and an overlay file that provides metadata for an API monitoring service.

```yaml
#%RAML 1.0
# This file is located at librarybooks.raml
title: Book Library API
documentation:
  - title: Introduction
    content: Automated access to books
  - title: Licensing
    content: Please respect copyrights on our books.
/books:
  description: The collection of library books
  get:
```

```yaml
#%RAML 1.0 Overlay
usage: Spanish localization
extends: librarybooks.raml
documentation:
  - title: Introducción
    content: El acceso automatizado a los libros
  - title: Licencias
    content: Por favor respeta los derechos de autor de los libros
/books:
  description: La colección de libros de la biblioteca
```

```yaml
#%RAML 1.0 Overlay
usage: Hints for monitoring the library books API
extends: librarybooks.raml
annotationTypes:
  monitor:
    parameters:
      frequency:
        properties:
          interval: integer
          unitOfMeasure:
            enum: [ seconds, minutes, hours ]
      script:
/books:
  get:
    (monitor):
      frequency:
        interval: 5
        unitOfMeasure: minutes
      script: randomBooksFetch
```

#### Extensions

An extension allows extending a RAML API definition by adding to, or modifying, its behavioral (functional) aspects as well as its non-behavioral aspects. This can be useful in separating a core, broadly-available API from layers of functionality available to more restricted audiences, for creating variants of an API for somewhat different purposes, or for specifying instance-specific properties of an API such as its service endpoint (URL) without altering its pure interface definition document.

The following examples build on the examples in the overlays section above, by adding an extension available to admins for adding items (books) to a collection, adding an overlay to provide a translation of the added functionality, and adding an extension that locates a particular service endpoint of the API.

```yaml
#%RAML 1.0 Extension
usage: Add administrative functionality
extends: librarybooks.raml
/books:
  post:
    description: Add a new book to the collection
```

```yaml
#%RAML 1.0 Overlay
usage: Spanish localization for admin functionality
extends: librarybooks.raml
/books:
  post:
    description: A?adir un nuevo libro para la colecci?n
```

```yaml
#%RAML 1.0 Extension
usage: The location of the public instance of the Piedmont library API
extends: librarybooks.raml
baseUri: http://api.piedmont-library.com
```

#### Merging Rules

The algorithm of how exactly an overlay/extension structure is applied to the master is described in this section.  

##### Terminology

###### Object & Property

_Object_ is a MAP or a SEQUENCE containing MAPPINGS in terms of YAML.

_Property_ is a MAPPING in terms of YAML, the pair of key and its value.

In the following example, "properties" highlighted in yellow is a _Property_ key, and the corresponding _Object_ value is highlighted in green.

<pre style="background-color:#111;">
<font color="yellow">properties:</font>
<font color="#44ff44">  statusCode: 200</font>
<font color="#44ff44">    responseParameters:</font>
<font color="#44ff44">      type: object</font>
<font color="#44ff44">      description: "some description"</font>
</pre>

In the same example, there is also a "responseParameters" _Property_ key and its _Object_ value colored in green:

<pre style="background-color:#111;">
<font color="white">properties:</font>
<font color="white">  statusCode: 200</font>
<font color="yellow">    responseParameters:</font>
<font color="#44ff44">      type: object</font>
<font color="#44ff44">      description: "some description"</font>
</pre>

And while "statusCode", "type" and "description" colored yellow are also properties, their values are not _Objects_:

<pre style="background-color:#111;">
<font color="white">properties:</font>
<font color="yellow">   statusCode:</font> <font color="white">200</font>
<font color="white">   responseParameters:</font>
<font color="yellow">       type:</font> <font color="white">object</font>
<font color="yellow">       description:</font> <font color="white">"some description"</font>
</pre>

In the following sample "FilteredByPrice" and "Paged" are yellow-colored _Properties_ with _Object_ values colored in green.

<pre style="background-color:#111;">
<font color="white">traits:</font>
<font color="yellow"> - FilterableByPrice:</font>
<font color="#44ff44">     queryParameters:</font>
<font color="#44ff44">       priceLessThen?:</font>
<font color="#44ff44">         type: number</font>
<font color="#44ff44">       priceMoreThen?:</font>
<font color="#44ff44">        type: number</font>
<font color="yellow"> - Paged:</font>
<font color="#44ff44">     queryParameters:</font>
<font color="#44ff44">       offset: number</font>
<font color="#44ff44">       length: number</font>
</pre>

###### Array

_Array_ is a SEQUENCE containing SCALARs or SEQUENCE containing MAPs in terms of YAML.

In the following example, the "enum" _Property_ key is highlighted in yellow that has an _Array_ value highlighted blue.

<pre style="background-color:#111;">
<font color="yellow">enum:</font>
<font color="#4444ff"> - White</font>
<font color="#4444ff"> - Black</font>
<font color="#4444ff"> - Colored</font>
</pre>

Another example for an _Array_ definition, a "documentation" _Property_ key has an _Array_ value, which contains two _Objects_ highlighted in green:

<pre style="background-color:#111;">
<font color="yellow">documentation:</font>
<font color="#44ff44">- title: Introduction</font>
<font color="#44ff44">  content: Automated access to books</font>

<font color="#44ff44">- title: Licensing</font>
<font color="#44ff44">  content: Please respect copyrights on our books.</font>
</pre>

###### Property Types

In the merging algorithm the _Property_ types are referred to as _Property Kind_ which can be one of the following (highlighted in **bold**):

**_Object Property_** - a _Property_ having _Object_ as a value.

In the following example, "properties" _Property_ is an _Object Property_:

<pre style="background-color:#111;">
<font color="yellow">properties:</font>
<font color="#44ff44">   statusCode: 200</font>
<font color="#44ff44">   responseParameters:</font>
</pre>

**_Array Property_** - a _Property_ having _Array_ of _Objects_ as a value.

In the following example, "documentation" _Property_ is an _Object Property_:

<pre style="background-color:#111;">
<font color="yellow">documentation:</font>
<font color="#44ff44">- title: Introduction</font>
<font color="#44ff44">  content: Automated access to books</font>

<font color="#44ff44">- title: Licensing</font>
<font color="#44ff44">  content: Please respect copyrights on our books.</font>
</pre>

**_Simple property_** - a _Property_ having YAML SCALAR or a SEQUENCE of YAML SCALARS as a value.

In the following sample "statusCode" and "enum" are simple properties.

<pre style="background-color:#111;">
<font color="yellow">statusCode:</font><font color="white"> 200</font>
<font color="yellow">enum:</font>
<font color="white"> - White</font>
<font color="white"> - Black</font>
<font color="white"> - Colored</font>
</pre>

**_Single-value Simple Property_** - a Simple property having YAML SCALAR value.

<pre style="background-color:#111;">
<font color="yellow">statusCode</font>: <font color="white">200</font>
</pre>

**_Multi-value Simple Property_** - a Simple property having a SEQUENCE of YAML SCALARS as value.

<pre style="background-color:#111;">
<font color="yellow">enum:</font>
<font color="white"> - White</font>
<font color="white"> - Black</font>
<font color="white"> - Colored</font>
</pre>

Exceptions:
* Examples are always _Simple Properties_ despite its ability to have complex YAML samples as values.
* Annotations are always _Simple Properties_ despite potentially having a complex node structure.
* Resource type applications are always _Simple Properties_.
* Trait applications are always _Simple Properties_.
* _Security Schema_ applications are always Simple Properties.

###### Conflicting Properties

Conflicting properties are the properties, which can not coexist in the same Object at the same time.

In the following example both "type" and "properties" _Properties_ can coexist with each other, but the "enum" _Property_ cannot coexist with both "type" and "properties".

<pre style="background-color:#111;">
<font color="white">color:</font>
<font color="#44ff44">  type:</font> <font color="white">object</font>
<font color="#44ff44">  properties:</font>
<font color="white">    name: string</font>
<font color="#ff4444">  enum:</font>
<font color="white">   - White</font>
<font color="white">   - Black</font>
<font color="white">   - Colored</font>
</pre>

###### Ignored properties

_Ignored Properties_ - the following properties are considered ignored:
"uses" and "usage".

###### The Trees

_Master Tree_ - Master file document YAML parsing tree result.
_Extension Tree_ - overlay or extension YAML parsing tree result.
_Target Tree_ - the result tree.

##### Merging Algorithm:

Master document and Extension or Overlay are parsed by YAML parser to produce _Master Tree_ and _Extension Tree_.

_Master Tree_ and _Extension Tree_ are validated, in case of an error the merge process is cancelled.

All _includes_ are resolved and applied for both _Master Tree_ and _Extension Tree_.

All _uses_ are resolved and applied for both _Master Tree_ and _Extension Tree_. The trees MUST NOT have _uses_ instructions with the same namespace referring to different files.

Initially, _Target Tree_ is made equal to the _Master Tree_.

**Current Extension Tree Object** is set to the _Extension Tree_ root (API).
**Current Target Tree Object** is set to the _Target Tree_ root (API).

For each **Current Extension Tree Object property** the following is done:

* If the **property** is an _Ignored Property_, continue to process the next property.
* If the **property** with the same name exists in **Current Target Tree Object**:
  * If the **property** and the equally named property in **Current Target Tree Object** have different _Property Kind_:
    * The **property** value in the equally named **Current Target Tree Object** property is replaced with its value from **Current Extension Tree Object** property.
  * If the **property** is a _Simple Property_
    * If the **property** is a _Single-value Simple Property_,
      * The **property** value in the equally named **Current Target Tree Object** property is replaced with its value from **Current Extension Tree Object** property.
    * If the **property** is a _Multi-value Simple Property_
      * The **property** value from **Current Extension Tree Object** property is added to the equally named **Current Target Tree Object** property values if no such value already exists.
  * If the **property** is an _Object Property_:
    * The same _Merging Algorithm_ is recursively performed for **Current Extension Tree Object** being set to the **property** value, and **Current Target Tree Object** being set to the value of the equally named property in **Current Target Tree Object**.
  * If the **property** is an _Array Property_:
    * _Objects_ from the property value are added to the equally named **Current Target Tree Object** property value.
* If the **property** with the same name does not exist in **Current Target Tree Object**:
  * All _Conflicting Properties_ are removed from the **Current Target Tree Object**
  * The **property** is added to the **Current Target Tree Object**.

_Target Tree_ is validated.

If the _Extension Tree_ is an Overlay, _Target Tree_ is compared to the _Master Tree_. There MUST NOT be any differences, besides listed in the "Allowed differences" table in section [Overlays](#overlays). Otherwise the process is cancelled.

_Target Tree_ has its resource types and Traits applied.

_Target Tree_ is being serialized to a document, or returned as the algorithm output.

## References

### Normative References

Berners-Lee, T., Masinter, L., and M. McCahill, "Uniform Resource Locators (URL)", RFC 1738, December 1994.

Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997.

Berners-Lee, T., Fielding, R., and L. Masinter, "Uniform Resource Identifiers (URI): Generic Syntax", RFC 2396, August 1998.

Fielding, R., Gettys, J., Mogul, J., Frystyk, H., Masinter, L., Leach, P., and T. Berners-Lee, "Hypertext Transfer Protocol -- HTTP/1.1", RFC 2616, June 1999.

Crockford, D., "The application/json Media Type for JavaScript Object Notation (JSON)", RFC 4627, July 2006.

Dusseault, L. and J. Snell, "PATCH Method for HTTP", RFC 5789, March 2010.

Gregorio, J., Fielding, R., Hadley, M., Nottingham, M., and D. Orchard, "URI Template", RFC 6570, March 2012.

Ben Kiki, O., Evans, C., and I. Net, "YAML Aint Markup Language", 2009, <http://www.yaml.org/spec/1.2/spec.html>.

### Informative References

Galiegue, F., Zyp, K., and G. Court, "JSON Schema: core definitions and terminology", 2013, <http://tools.ietf.org/html/draft-zyp-json-schema-04>.

Gruber, J., "Markdown Syntax Documentation", 2004, <http://daringfireball.net/projects/markdown/syntax>.

Fielding, R., "Representational State Transfer (REST)", 2000, <http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm>.

Rose, M., "Writing I-Ds and RFCs using XML", RFC 2629, June 1999.

Rescorla, E. and B. Korver, "Guidelines for Writing RFC Text on Security Considerations", BCP 72, RFC 3552, July 2003.

Gao, S., Sperberg-McQueen, C., and H. Thompson, "W3C XML Schema Definition Language (XSD) 1.1", 2012, <http://www.w3.org/XML/Schema>.
