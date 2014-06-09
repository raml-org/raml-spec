### Resource Types and Traits

Resource and method declarations are frequently repetitive. For example, if an API requires OAuth authentication, the API definition must include the *access_token* query string parameter (which is defined by the *queryParameters* property) in all the API's resource method declarations.

Moreover, there are many advantages to reusing patterns across multiple resources and methods. For example, after defining a collection-type resource's characteristics, that definition can be applied to multiple resources. This use of patterns encouraging consistency and reduces complexity for both servers and clients.

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

The following example builds on the previous one, but the resource types and traits are defined in external files that are included by using the RAML !include data type.

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
