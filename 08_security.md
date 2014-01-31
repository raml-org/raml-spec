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

Applying a *securityScheme* definition to a method overrides whichever *securityScheme* has been defined at the root level. To indicate that the method is protected using a specific security scheme, the method MUST be defined by using the *securedBy* attribute. The value of the *securedBy* attribute MUST be a list of any of the security schemas defined in the *securitySchema* declaration.

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


