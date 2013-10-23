RAML&trade; Version 0.8: RESTful API Modeling Language
===================================


Abstract
--------

RAML&trade; is a YAML-based language that describes RESTful APIs. Together with the [YAML specification](http://yaml.org/spec/1.2/spec.html), this specification provides all the information necessary to describe RESTful APIs; to create API client-code and API server-code generators; and to create API user documentation from RAML API definitions.


Introduction
------------

This specification describes RAML. RAML is a human-readable and machine process-able description of a RESTful API interface. API documentation generators, API client-code generators, and API servers consume a RAML document to create user documentation, client code, and server code stubs, respectively.

Conventions
-----------

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 [RFC2119].

Overview
--------

RAML defines the media type "application/raml+yaml" for describing and documenting a RESTful API's resources, such as the resources' methods and schema. RAML is YAML-based, and RAML documents support all YAML 1.2 features. The recommended filename extension for RAML files is ".raml".

RAML also provides facilities for extensively documenting a RESTful API, enabling documentation generator tools to extract the user documentation and translate it to visual formats such as PDF, HTML, and so on.

RAML also introduces the innovative concept of resource types and traits for characterizing resources and methods, thereby minimizing the amount of repetition required to specify a RESTful API's design.

This RAML Specification is organized as follows:

* **Basic Information.** Explains how to describe core aspects of a RESTful API, such as is name, title, and location.
* **User Documentation.** Describes how to include supporting documentation for the RESTful API. 
* **Resource Types and Traits.** Describes the optional mechanism for using RAML resource types and traits to characterize resources so as to avoid unnecessary repetition in the RESTful API's definition. 
* **Resources.** Describes how to specify a RESTful API's resources, resources' methods and schema, and the interactions between resources. 

RAML is a trademark of MuleSoft, Inc.

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
---
```

The RAML version MUST be the first line of the RAML document. RAML parsers MUST interpret all other YAML-commented lines as comments.
 
In RAML, the YAML data structures are enhanced to include data types that are not natively supported. All RAML document parsers MUST support these extensions.

In RAML, all values MUST be interpreted in a case-sensitive manner.

