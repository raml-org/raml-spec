# The RESTful API Modeling Language (RAML) Spec

###Licensing
[Contributors License Agreement](https://github.com/raml-org/raml-spec/blob/master/legal/contribution_agreement.docx)

[Branding Guidelines](https://github.com/raml-org/raml-spec/blob/master/legal/brand_guidelines.pdf)

## Index

###[Introduction:](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#introduction)
[RAML Overview](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#overview)  
[RAML Markup Language](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#markup-language)

####[Includes](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#includes)

Named Parameters:

[Named Parameters with Multiple Types](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#named-parameters-with-multiple-types)

Basic Information:

[Root](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#root-section)  
[Base URI and baseUriParameters](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#base-uri-and-baseuriparameters)  
[Protocols](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#protocols)  
[Default Media Type](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#default-media-type)  
[Schemas](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#schemas)  
[URI Parameters](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#uri-parameters)  
[User Documentation](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#user-documentation)

Resources and Methods:

[Resources and Nested Resources](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#resources-and-nested-resources)  
[Template URIs and URI Parameters](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#template-uris-and-uri-parameters)
[Absolute URI](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#absolute-uri)  
[Query Parameters](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#query-strings)  
[Body](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#body)  
[Web Forms](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#web-forms)  

Schemas and Responses:

[Schemas](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#schema)  
[Responses](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#responses)  
[Headers](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#headers)

Security:

[Declaration](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#declaration)  
[Type](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#type)  
[OAuth 1.0](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#oauth-10)  
[OAuth 2.0](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#oauth-20)  
[Usage: Applying a Security Scheme to an API](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#usage-applying-a-security-scheme-to-an-api)

###[References:](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#references)
[Normative References](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#normative-references)  
[Informative References](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#informative-references)

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/2c379a9b36749a80379d5f3f328a8bed "githalytics.com")](http://githalytics.com/raml-org/raml-spec)

##Contributing

Please, follow these steps to contribute with the RAML Spec project:
- Check the [Contributors License Agreement](https://github.com/raml-org/raml-spec/blob/master/legal/contribution_agreement.docx)
- Fork this repository.
- Clone the forked repository.
- Apply the changes on master.
- Commit, Push.
- Generate Pull Request.

Please, follow these steps to accept a contribution
- Verify the Pull Request.
- If it's correct: Merge/Accept.
- Move to `gh-pages` branch (`git checkout gh-pages`)  and run `./specs_publish.sh` (this script copies the resulting `raml-0.8.md` file from `master` to the current branch
  `gh-pages`  and places it in the following path: `./spec.md` which is needed to have the specs published in the site). **Note: This is a shell script, only working on UNIX based OS**.

## Logos

Download the RAML Logos in [JPG](https://github.com/raml-org/raml-spec/raw/master/logos/RAML-logo.jpg) and [EPS](https://github.com/raml-org/raml-spec/raw/master/logos/RAML-logo.eps) format. ( for usage questions email [info@raml.org](mailto:info@raml.org) ).