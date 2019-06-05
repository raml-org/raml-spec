# The RESTful API Modeling Language (RAML) Spec

[![Build Status](https://travis-ci.org/raml-org/raml-spec.svg?branch=master)](https://travis-ci.org/raml-org/raml-spec)

**The current version of the RAML specification is 1.0 - and you can find it [here](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md).**

RAML is a language for the definition of HTTP-based APIs that embody most or all of the principles of Representational State Transfer (REST). The RAML specification (this document) defines an application of the [YAML 1.2 specification](http://yaml.org/spec/1.2/spec.html) that provides mechanisms for the definition of practically-RESTful APIs, while providing provisions with which source code generators for client and server source code and comprehensive user documentation can be created.

Why not pay us a visit on [raml.org](http://www.raml.org)? You will find tons of information around RAML such as a tutorial, what the RAML Workgroup is, RAML projects, a forum, and a lot more.

## What is the fastest way to get started?

All you need is an editor of your choice - we recommend either MuleSoft's [API Designer](https://github.com/mulesoft/api-designer) or [API Workbench](http://apiworkbench.com/); but any text editor will do just fine.

Now you only need to do is to write the design for your first endpoint

```yaml
#%RAML 1.0
title: Hello world # required title

/greeting: # optional resource
  get: # HTTP method declaration
    responses: # declare a response
      200: # HTTP status code
        body: # declare content of response
          application/json: # media type
            # structural definition of a response (schema or type)
            type: object
            properties:
              message: string
            example: # example how a response looks like
              message: "Hello world"
```

Interested? Learn more about the syntax in the [RAML 1.0 specification](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md) or take a look at some [examples](https://github.com/raml-org/raml-examples).

## How do I learn more?

* [Tutorial](http://raml.org/developers/raml-100-tutorial)
* [Advanced Tutorial](http://raml.org/developers/raml-200-tutorial)
* [Examples](https://github.com/raml-org/raml-examples)
* [Blog](https://medium.com/raml-api)
* [Projects](http://www.raml.org/projects)

## How can I contribute?

We welcome any contributions from the community! You can contribute or provide feedback for the RAML Specification in different ways depending on your intentions. The following table illustrates the different ways to help us not only to improve the documentation of the specification, but also RAML itself.

|Your Intention  |What to do?|
|:----------|:----------|
|You see a spelling or grammar mistake, or an error in our examples? | Fork this repository, make edits, and then submit a pull request. We will respond to your request as quickly as possible.
|You want to suggest a new feature, improve existing features, ask questions, or things in general around the RAML specification? | File an issue. Please be as specific as possible about your intentions or what you’d like to see.

## How can I get in touch?

* [Slack](https://raml.org/slack)
* [@ramlapi](https://twitter.com/ramlapi)
* info@raml.org
* [Forum](http://forum.raml.org)
* [Stack Overflow](http://stackoverflow.com/questions/tagged/raml)
* [Github Issues](https://github.com/raml-org/raml-spec/issues)

## Licensing

[Branding Guidelines](http://raml.org/licensing.html)
