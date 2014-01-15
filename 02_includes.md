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
