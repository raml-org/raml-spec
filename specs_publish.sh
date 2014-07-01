header="---\nlayout: specs\ntitle: Your New Jekyll Site\n---\n"
echo "Getting last version of RAML specs"
rm spec.md
echo "$header" >> spec.md
curl -s "https://raw.githubusercontent.com/raml-org/raml-spec/master/raml-0.8.md" >> spec.md
echo "DONE"
