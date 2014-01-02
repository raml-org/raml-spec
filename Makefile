MARKDOWN_FILES = $(wildcard [0-9][0-9]*.md)
RAML_VERSION := 0.8
SINGLE_SPEC_FILE := raml-$(RAML_VERSION).md

$(SINGLE_SPEC_FILE): $(MARKDOWN_FILES)
	cat $(MARKDOWN_FILES) > $@

# I am playing with substituting text in the READM.md (it actually works)
# README.md: README.md.bk
	# sed matching and substitutiuon is makefile specific
#	cat README.md.bk | sed -e 's/\$${RAML_VERSION}/$(RAML_VERSION)/g' -e 's/\$${SPEC_FILE}/$(SINGLE_SPEC_FILE)/g' > $@ 

clean:
	rm -f $(SINGLE_SPEC_FILE)

.DEFAULT_GOAL := $(SINGLE_SPEC_FILE)

.PHONY: clean
