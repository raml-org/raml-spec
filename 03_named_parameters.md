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
(Optional)
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
---
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
