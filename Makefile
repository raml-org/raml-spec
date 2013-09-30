MARKDOWN_FILES = $(wildcard [0-9][0-9]*.md)

raml-spec.md: clean
	cat $(MARKDOWN_FILES) > $@

clean:
	rm -f raml-spec.md

.DEFAULT_GOAL := raml-spec.md

.PHONY: clean raml-spec.md

