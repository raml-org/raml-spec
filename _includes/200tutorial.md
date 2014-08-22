## SETTING UP THE WORKSPACE
If you decided to be "hands-on", please clone the GitHub repository

```
git clone https://github.com/raml-org/raml-tutorial-200.git
```

**Spoiler alert:** After cloning, the repository will be in its final state. You can browse the code as is, but it will be like reading the last chapter of a book.
Before each step, we recommend you "sync" the code with the step you are about to read, like this:

```
git checkout -f [stepX]
```

Note: after cloning the repository, you will need to access to its folder on your local computer. Don’t worry! We’ll remind you each time.

## USE CASE

Build a music Jukebox. While the physical device will be responsible for displaying the information and capturing the user input, it will be relying on your API to retrieve the information requested. The Jukebox needs to be able to:

- Show the full list of artists.
- Show the full list of albums.
- Show the list of artists by nationality.
- Show the list of albums by genre.
- Search for a song by title.
- Show a particular artist's albums collection.
- Show a particular album's songs list.
- Play a song (by specifying the song id).
- Enter new Artists, Albums and Songs (only authenticated users).

**Consideration:** This is a jukebox, not a command line. People in pubs might be unable to type lots of characters, so a user friendly UI (paging, image-based, etc) would be very appreciated.

## BASE RAML FILE

Reset your workspace:

```
git checkout -f step0
```
If you have read the [RAML 100 Tutorial](http://raml.org/docs.html), you should be able to understand our base RAML API definition without major difficulties. Its basic structure could be described as:

```
/songs
  get
  post
  /{songId}
    get
    /file-content
      get
      post
/artists
  get
  post
    /{artistId}
      get
      /albums
        get
/albums
  get
  post
    /{albumId}
      get
      /songs
        get
```

If you look into jukebox-api.raml you will find all the resources defined, their GET methods described, and POST methods nearly empty.

As you can see in the following example (extracted from jukebox-api.raml), the resource "/songs" doesn't have a well defined POST: body parameters are missing.

```yaml
/songs:
  description: Collection of available songs in Jukebox
  get:
    description: Get a list of songs based on the song title.
    queryParameters:
      songTitle:
        description: "The title of the song to search (it is case insensitive and doesn't need to match the whole title)"
        required: true
        minLength: 3
        type: string
        example: "Get L"
    responses:
      200:
        body:
          application/json:
            example: |
              "songs": [
                  {
                    "songId": "550e8400-e29b-41d4-a716-446655440000",
                    "songTitle": "Get Lucky"
                  },
                  {
                    "songId": "550e8400-e29b-41d4-a716-446655440111",
                    "songTitle": "Loose yourself to dance"
                  },
                  {
                    "songId": "550e8400-e29b-41d4-a716-446655440222",
                    "songTitle": "Gio sorgio by Moroder"
                  }
                  ]
  /{songId}:
    description: Song entity
    get:
      description: Get the song with `songId = {songId}`
      responses:
        200:
          body:
            application/json:
              example: |
                {
                  "songId": "550e8400-e29b-41d4-a716-446655440000",
                  "songTitle": "Get Lucky",
                  "duration": "6:07",
                  "artist": {
                    "artistId": "110e8300-e32b-41d4-a716-664400445500"
                    "artistName": "Daft Punk",
                    "imageURL": "http://travelhymns.com/wp-content/uploads/2013/06/random-access-memories1.jpg"
                  },
                  "album": {
                    "albumId": "183100e3-0e2b-4404-a716-66104d440550",
                    "albumName": "Random Access Memories",
                    "imageURL": "http://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg"
                  }
                }
        404:
          body:
            application/json:
              example: |
                {"message": "Song not found"}
    /file-content:
      description: The file to be reproduced by the client
      get:
        description: Get the file content
        responses:
          200:
      post:
  post:
```

## BODY PARAMETERS
**Form Parameters**

Reset your workspace:

```
git checkout -f step1a
```

There are several ways of defining the body parameters for an HTTP method. You can check the jukebox-api.raml file looking for the `/songs/{songId}/file-content` definition and you will find one of these.

```yaml
/file-content:
  description: The file to be reproduced by the client
  get:
    description: Get the file content
    responses:
      200:
        body:
          binary/octet-stream:
            example:
              !include heybulldog.mp3
  post:
    description: |
       Enters the file content for an existing song entity.

       Use the "binary/octet-stream" content type to specify the content from any consumer (excepting web-browsers).
       Use the "multipart-form/data" content type to upload a file which content will become the file-content
    body:
      binary/octet-stream:
      multipart/form-data:
        formParameters:
          file:
            description: The file to be uploaded
            required: true
            type: file
```

`/file-content` resource represents the file to reproduce when a Jukebox user select a particular song, although, there are tons of ways of modeling this scenario on a RESTful API. We've chosen this one for this tutorial purposes. It doesn't mean it's a best practice at all.


As you can see in the POST definition, its body contains two possible content-types.
The `binary/octet-stream` simply expects `file-content` to be sent as a parameter. It's a valid and popular technique for APIs that supporting files. Unfortunately, it makes the API impossible to call from a web browser (at least with the purpose of uploading a file).

For the `multipart/form-data` (and also the `application/x-www-form-urlencoded`), it is possible to define a map of "formParameters", defining this map the same way that the rest of the RAML ones (in this case, the "file" field is required and of type "file").

**Schemas**

Reset your workspace:

```
git checkout -f step1b
```

A body also can be of `application/json` content-type (among others, like `application/xml`) and for these, the expected body parameter will be a string with a valid JSON (or XML). So, this is another way of defining a method's body parameter.
One of the RAML supported features is the possibility of defining schemas and apply these to the body parameters as well, as it is shown on the code of jukebox-api.raml

```yaml
body:
  application/json:
    schema: |
      {
        "type": "object",
        "$schema": "http://json-schema.org/draft-03/schema",
        "id": "http://jsonschema.net",
        "required": true,
        "properties": {
          "songTitle": {
            "type": "string",
            "required": true
          },
          "albumId": {
            "type": "string",
            "required": true,
            "minLength": 36,
            "maxLength": 36
          }
        }
      }
    example: |
      {
        "songId": "550e8400-e29b-41d4-a716-446655440000",
        "songTitle": "Get Lucky",
        "albumId": "183100e3-0e2b-4404-a716-66104d440550"
      }
```

What the example is basically saying is: "The expected parameter is a valid json, and for valid, it needs to fulfill the specified schema definition". In this case, the represented object has:

- "songTitle" property of type "string", and it's required
- "albumId" property of type "string", and not only is it required, but it also needs to be 36 characters long.

It's not the intention of this tutorial explain how JSON and XML schemas work, but you can learn more at [http://json-schema.org/](http://json-schema.org/) and [http://www.w3.org/XML/Schema.html](http://json-schema.org/).

## EXTRACT SCHEMAS

Reset your workspace:

```
git checkout -f step2
```

One interesting RAML feature is the ability to extract the schemas and reference them by name. There are three major advantages of doing this, and the first two might look a bit obvious:
- Improve RAML readability
- Allow reusing the schemas in several sections.

The third advantage will become clear in following sections, when trying to use "resource types" and parameterize these.

```yaml
schemas:
 - song: |
    {
      "type": "object",
      "$schema": "http://json-schema.org/draft-03/schema",
      "id": "http://jsonschema.net",
      "required": true,
      "properties": {
        "songTitle": {
          "type": "string",
          "required": true
        },
        "albumId": {
          "type": "string",
          "required": true,
          "minLength": 36,
          "maxLength": 36
        }
      }
    }
```

```yaml
body:
  application/json:
    schema: song
    example: |
      {
        "songId": "550e8400-e29b-41d4-a716-446655440000",
        "songTitle": "Get Lucky",
        "albumId": "183100e3-0e2b-4404-a716-66104d440550"
      }
```

As you can see in the code example, the schema described in previous sections is now being defined and referenced by the name "song". The name choice is not random, and the correct convention will allow you to parameterize resource types and reuse a lot of code (this will be explained in following sections).

## RESOURCE TYPES
**The "collection/collection-item" pattern**

**We are definitively not saying that all RESTful APIs are the same.** I don’t want to even suggest it. But there are absolutely some common behaviors. For example, if we are trying to represent resources that could be inferred from a business model, it will likely be analogous with the CRUD model. Given a resource, you can **c**reate a new one, **r**etrieve one or all of them and **u**pdate or **d**elete an existing one.

In that sense, we can easily identify an existing resource (to be fetched, deleted or updated), a new one (to be added to a collection) and the collection itself (to be retrieved).

```yaml

#%RAML 0.8
title:

/resources:
  get:
  post:
  /{resourceId}:
    get:
    put:
    delete:
```

So, we found two different type of resources. The item (represented by an id), and the collection (containing all the items). It would be nice to be able to define these types, and declare the resources of those types. Luckily, there is a way to do this in RAML.
**Resource Types in RAML**

Reset your workspace:

```
git checkout -f step3a
```

Similar to the last example code, where we only showed the resources and supported methods, this step consists in just creating the "resourceTypes" with their supported methods.

```yaml
resourceTypes:
  - collection:
      get:
      post:
  - collection-item:
      get:
```

As you may notice, the PUT and DELETE methods are not defined for the collection-item resourceType. This is basically because the use case does not request any resource to be deleted or updated.
So, what this version of the jukebox-api.raml is saying is "There are two resource types: collection, which has the GET and POST methods defined, and collection-item which has the GET method defined". Standing alone, it doesn't really seem to be very useful. However, it's important to understand as the first step of defining good resourceTypes and reusing patterns in the code.

**Defining and parameterizing resourceTypes**

The following explanation and code snippets will guide you step by step on how to get the next version of the jukebox-api.raml.

Reset your workspace:

```
git checkout -f step3b
```

What do we know about our collections thus far? Let's check what "/songs", "/artists", and "/albums" have in common:

- Description
- GET method with:
  - description
  - response for HTTP status 200 (which body's content type is "application/json")
- POST method with:
  - description
  - "access_token" queryParameter
  - bodyParameter with "application/json" contentType and validated by a Schema
  - response with HTTP status 200 (which body's content type is "application/json")

So, let's extract this from one of the resources (I will take "/songs" for this example, but we will end up parameterizing the resourceType, so it doesn't matter which one you choose to start).

```yaml
resourceTypes:
  - collection:
      description: Collection of available songs in Jukebox
      get:
        description: Get a list of songs based on the song title.
        responses:
          200:
            body:
              application/json:
      post:
        description: |
          Add a new song to Jukebox.
        queryParameters:
          access_token:
            description: "The access token provided by the authentication application"
            example: AABBCCDD
            required: true
            type: string
        body:
          application/json:
            schema: song
        responses:
          200:
            body:
              application/json:
                example: |
                  { "message": "The song has been properly entered" }
```

With the `collection` resourceType as it is right now, there is not much we can do. Applying it to the `/songs` resource is a possibility, but we don't want those descriptions, schemas, or even the POST response to be applied to all the resources since the collection is specific to `/songs`.
Parameters are useful here. Suppose that you can write a "placeholder" on the resourceType to be filled with a value specified on the resource. For instance:

```
description: Collection of available <<resource>> in Jukebox
```

with `<<resource>>` receiving "songs", "artists", or "albums" depending on the resource.

While this is possible (and very useful for most scenarios), for this particular case it's not necessary for the resource to even pass the parameter thanks to **Reserved Parameters**.

A Reserved Parameter simply is a parameter with a value automatically specified by its context. For the resourceTypes case, there are two Reserved Parameters: resourcePath and resourcePathName. For the `/songs` example, the values will be "/songs" and "songs" respectively.

Now, if you are looking at the last code snippet, you will realize that we need the values to be "songs" in some cases and "song" in others.
Here is where **Parameters Transformers** become handy.

There are two Parameters Transformers we could use for this example: `!singularize` and `!pluralize` (note: The only locale supported by the current version of RAML is "United States English").

So combining this, let's update our latest code snippet:

```yaml
resourceTypes:
  - collection:
      description: Collection of available <<resourcePathName>> in Jukebox.
      get:
        description: Get a list of <<resourcePathName>>.
        responses:
          200:
            body:
              application/json:
      post:
        description: |
          Add a new <<resourcePathName|!singularize>> to Jukebox.
        queryParameters:
          access_token:
            description: "The access token provided by the authentication application"
            example: AABBCCDD
            required: true
            type: string
        body:
          application/json:
            schema: <<resourcePathName|!singularize>>
        responses:
          200:
            body:
              application/json:
                example: |
                    { "message": "The <<resourcePathName|!singularize>> has been properly entered" }
```

```yaml
/songs:
  type: collection
  get:
    queryParameters:
      songTitle:
        description: "The title of the song to search (it is case insensitive and doesn't need to match the whole title)"
        required: true
        minLength: 3
        type: string
        example: "Get L"
    responses:
      200:
        body:
          application/json:
            example: |
              "songs": [
                  {
                    "songId": "550e8400-e29b-41d4-a716-446655440000",
                    "songTitle": "Get Lucky"
                  },
                  {
                    "songId": "550e8400-e29b-41d4-a716-446655440111",
                    "songTitle": "Loose yourself to dance"
                  },
                  {
                    "songId": "550e8400-e29b-41d4-a716-446655440222",
                    "songTitle": "Gio sorgio by Moroder"
                  }
                  ]
  post:
    body:
      application/json:
          example: |
            {
              "songId": "550e8400-e29b-41d4-a716-446655440000",
              "songTitle": "Get Lucky",
              "albumId": "183100e3-0e2b-4404-a716-66104d440550"
            }
```

Note that even the Schema name is specified with this parameter (singular in this case). Do you remember when we extracted the schemas at step 2? We mentioned that the schema name was not random - this is why.
Another important aspect to stress is that defining and applying a resourceType to a resource doesn't forbid you from overwriting any of the map's elements. In this example, we still see that GET method is present in both, resource and resourceType (the same for the responses, POST, etc). Not only is this allowed, but also is the way of redefining something that changes from one resource to other. **If you think this looks like OOP inheritance, you’re right!**

Now, let's work with the "collection-item" resourceType.

Reset your workspace:

```
git checkout -f step3c
```

There is nothing new with this code. More resourceType definitions, parameterization, and usage:

```yaml
- collection-item:
      description: Entity representing a <<resourcePathName|!singularize>>
      get:
        description: |
          Get the <<resourcePathName|!singularize>>
          with <<resourcePathName|!singularize>>Id =
          {<<resourcePathName|!singularize>>Id}
        responses:
          200:
            body:
              application/json:
          404:
            body:
              application/json:
                example: |
                  {"message": "<<resourcePathName|!singularize>> not found" }
```

```yaml
/songs:
  ...
  /{songId}:
    type: collection-item
    get:
      responses:
        200:
          body:
            application/json:
              example: |
                {
                  "songId": "550e8400-e29b-41d4-a716-446655440000",
                  "songTitle": "Get Lucky",
                  "duration": "6:07",
                  "artist": {
                    "artistId": "110e8300-e32b-41d4-a716-664400445500"
                    "artistName": "Daft Punk",
                    "imageURL": "http://travelhymns.com/wp-content/uploads/2013/06/random-access-memories1.jpg"
                  },
                  "album": {
                    "albumId": "183100e3-0e2b-4404-a716-66104d440550",
                    "albumName": "Random Access Memories",
                    "imageURL": "http://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg"
                  }
                }
```

But as you can see, we are still repeating lot of code. Specifically:

```yaml
get:
  responses:
    200:
      body:
        application/json:
          example: |
```

Basically, every piece of code needed to define the **examples**. And this is basically because we have only learned how to use Reserved Parameters. However, we have also mentioned that the idea of parameterizing is to specify "placeholder" to be filled with a specified value.
That would solve our "examples problem".

## PARAMETERS

Reset your workspace:

```
git checkout -f step4
```

At the moment of defining the parameter in the resourceType (with the placeholder), there is no difference between a parameter and a reserved parameter. The actual difference only appears when passing the parameter at the resource level. For instance, a parameter named as `exampleItem` will need to be passed this way:

```yaml
/{songId}:
    type:
      collection-item:
        exampleItem: THIS IS THE EXAMPLE
```

In "human language", it's basically saying that `/{songId}` resource is of `collection-item` type (the same as on the previous step). But now, it's also indicating that the value for the `collection-item` parameter `exampleItem` is "THIS IS THE EXAMPLE". Since this is a string, all the YAML rules for strings are valid.
Having said that, let's take a look at some relevant code pieces.

```yaml
resourceTypes:
  - collection:
      description: Collection of available <<resourcePathName>> in Jukebox.
      get:
        description: Get a list of <<resourcePathName>>.
        responses:
          200:
            body:
              application/json:
                example: |
                  <<exampleCollection>>
      post:
        description: |
          Add a new <<resourcePathName|!singularize>> to Jukebox.
        queryParameters:
          access_token:
            description: "The access token provided by the authentication application"
            example: AABBCCDD
            required: true
            type: string
        body:
          application/json:
            schema: <<resourcePathName|!singularize>>
            example: |
              <<exampleItem>>
        responses:
          200:
            body:
              application/json:
                example: |
                  { "message": "The <<resourcePathName|!singularize>> has been properly entered" }
  - collection-item:
      description: Entity representing a <<resourcePathName|!singularize>>
      get:
        description: |
          Get the <<resourcePathName|!singularize>>
          with <<resourcePathName|!singularize>>Id =
          {<<resourcePathName|!singularize>>Id}
        responses:
          200:
            body:
              application/json:
                example: |
                  <<exampleItem>>
          404:
            body:
              application/json:
                example: |
                  {"message": "<<resourcePathName|!singularize>> not found" }
```

```yaml
/songs:
  type:
    collection:
      exampleCollection: |
        [
          {
            "songId": "550e8400-e29b-41d4-a716-446655440000",
            "songTitle": "Get Lucky"
          },
          {
            "songId": "550e8400-e29b-41d4-a716-446655440111",
            "songTitle": "Loose yourself to dance"
          },
          {
            "songId": "550e8400-e29b-41d4-a716-446655440222",
            "songTitle": "Gio sorgio by Morodera"
          }
        ]
      exampleItem: |
        {
          "songId": "550e8400-e29b-41d4-a716-446655440000",
          "songTitle": "Get Lucky",
          "albumId": "183100e3-0e2b-4404-a716-66104d440550"
        }
  get:
    queryParameters:
      songTitle:
        description: "The title of the song to search (it is case insensitive and doesn't need to match the whole title)"
        required: true
        minLength: 3
        type: string
        example: "Get L"
  /{songId}:
    type:
      collection-item:
        exampleItem: |
          {
            "songId": "550e8400-e29b-41d4-a716-446655440000",
            "songTitle": "Get Lucky",
            "duration": "6:07",
            "artist": {
              "artistId": "110e8300-e32b-41d4-a716-664400445500"
              "artistName": "Daft Punk",
              "imageURL": "http://travelhymns.com/wp-content/uploads/2013/06/random-access-memories1.jpg"
            },
            "album": {
              "albumId": "183100e3-0e2b-4404-a716-66104d440550",
              "albumName": "Random Access Memories",
              "imageURL": "http://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg"
            }
          }
```

As you can see, the same concept shown in the previous example was applied to both the `/songs`, and `/songs/{songId}` resources.
The code that was repeated at the end of the step 3 is now completely within the resourceType at the point that the POST definition directly disappeared from the resources. **That's correct. Now, every `collection-item` typed resources will have a valid (generic) POST definition without you ever writing it.**

## INCLUDES

Reset your workspace:

```
git checkout -f step5
```

We have improved our RAML definition a lot during the last step with resourceTypes. We were able to extract common components of the resources and encapsulate these with a structure that grants inheritance-like capabilities.

Nevertheless, the RAML file still contains lot of information that could be considered as "not API-describing". Sort of "economy-class" members, if you will. **Equally important, but not necessarily part of the main RAML file**.

Through `!includes`, RAML allows us to build file-distributed API definitions, which is not only useful to encourage code reuse but also improves readability.

Here, we will extract the examples used for `/songs` resource to different files and include these in the main RAML definition.

```json
{
  "songId": "550e8400-e29b-41d4-a716-446655440000",
  "songTitle": "Get Lucky",
  "albumId": "183100e3-0e2b-4404-a716-66104d440550"
}
```

```json
{
  "songId": "550e8400-e29b-41d4-a716-446655440000",
  "songTitle": "Get Lucky",
  "duration": "6:07",
  "artist": {
    "artistId": "110e8300-e32b-41d4-a716-664400445500"
    "artistName": "Daft Punk",
    "imageURL": "http://travelhymns.com/wp-content/uploads/2013/06/random-access-memories1.jpg"
  },
  "album": {
    "albumId": "183100e3-0e2b-4404-a716-66104d440550",
    "albumName": "Random Access Memories",
    "imageURL": "http://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg"
  }
}
```

```json
[
  {
    "songId": "550e8400-e29b-41d4-a716-446655440000",
    "songTitle": "Get Lucky"
  },
  {
    "songId": "550e8400-e29b-41d4-a716-446655440111",
    "songTitle": "Loose yourself to dance"
  },
  {
    "songId": "550e8400-e29b-41d4-a716-446655440222",
    "songTitle": "Gio sorgio by Morodera"
  }
]
```

As you can see, the extracted files contain raw strings. It's important to stress that every included file is treated as a string by RAML, which presents some well known restrictions regarding how to distribute the definition among files. More than limitations, these restrictions attempt to define a common way to work with !includes and avoid free-form defined APIs. Remember that one of RAML’s major goals is to unify criteria and encourage best-practices.
The following code snippet shows how to include or "call" the extracted files from the main definition.

```yaml
/songs:
  type:
    collection:
      exampleCollection: !include jukebox-include-songs.sample
      exampleItem: !include jukebox-include-song-new.sample
  /{songId}:
    type:
      collection-item:
        exampleItem: !include jukebox-include-song-retrieve.sample
```

As shown in the last snippet, RAML features encourage you to reduce the quantity of code you write, while making it more reusable and maintainable.

## REFACTOR

We have introduced several features and made great progress with our API definition, but aren't we missing something? We have just focused on the "/songs" resource (and its descending branch). If you check your RAML file right now, you will discover that all other resources are still not taking advantage of the work we have done.
Let's solve that right now! Repeat the same procedures for all the resources:
- identify and apply the collection and collection-item pattern
- pass the correct parameters
- extract the belonging examples into separated files

When you finish with that your workspace should look like the following one.

Reset your workspace:

```
git checkout -f step6a
```

As you might notice, the quantity of lines in the RAML file has been significantly reduced and there are more files than before. Most important: It's visibly simpler!
But not everything went so smoothly. If you look carefully, there is a problem with sub-collections (`/artists/{artistId}/albums` and `/albums/{albumId}/songs`). Since these aren't the main collections of each resource, we decided not to allow new elements to be created on them. In other words, these collections were READ-ONLY. When applying the `collection` resourceType, we also automatically added the "POST" method. As an additional consequence, the RAML definition now requires the `exampleItem` parameter to be passed for those resources too (which we have temporarily resolved by passing `{}`).

```yaml
/artists:
  /{artistId}:
    /albums:
      type:
        collection:
          exampleCollection: !include jukebox-include-artist-albums.sample
          exampleItem: {}
      description: Collection of albulms belonging to the artist
      get:
        description: Get a specific artist's albums list
```

While that's awkward, it’s not a big deal and it will actually help us go further in order to solve it.

Let's create another resourceType called `readOnlyCollection`. It will be similar to `collection` but without the "POST method". And let's apply this new resourceType to its corresponding collections: `artists/{artistId}/albums` and `/albums/{albumId}/songs`:

```yaml
- readOnlyCollection:
    description: Collection of available <<resourcePathName>> in Jukebox.
    get:
      description: Get a list of <<resourcePathName>>.
      responses:
        200:
          body:
            application/json:
              example: |
                <<exampleCollection>>
```

```yaml
/artists:
  /{artistId}:
    /albums:
      type:
        readOnlyCollection:
          exampleCollection: !include jukebox-include-artist-albums.sample
      description: Collection of albulms belonging to the artist
      get:
        description: Get a specific artist's albums list
/albums:
  /{albumId}:
    /songs:
      type:
        readOnlyCollection:
          exampleCollection: !include jukebox-include-album-songs.sample
      get:
        description: Get the list of songs for the album with `albumId = {albumId}`
```


The result should be similar to the step6b workspace.

Reset your workspace:

```
git checkout -f step6b
```

If you are following the code in detail, you will have already noticed something: `collection` and `readOnlyCollection` resourceTypes are repeating some code. Actually, `readOnlyCollection` code is completely included in `collection` code. That’s correct! And there is a way of making this even more efficient. It's all about "types composing" and it will be totally covered in a later tutorial.

## TRAITS
We are almost done! We are busy fulfilling all the requirements for the described use case. As usual however, we’ve discovered something while building, and this tutorial cannot be the exception.
Will I be able to sort my collections? Shouldn't my API give users the chance of paging these? Is the strategy we chose for searching a collection good enough? What if we need to enhance and make more complex queries in the future?
Let's tackle these issues. But first, we need to understand them correctly

**Understanding our resources**

Let's build a simple table to discover and agree about each collection capabilities:

| Collection/Capabilities        | Searchable	           | Sorteable  |  Pageable |
| ------------- |:-------------:| :-----:| :-----: |
| `/songs`      | YES | YES | YES |
| `/artists`    | YES | YES | YES |
| `/albums`     | YES | YES | YES |
| `/artists/{aId}/albums` | NO | YES | YES |
| `/albums/{aId}/songs` | NO | YES | NO |

If we consider who will be consuming the API, this table would probably look very different (small collections can be filtered, ordered and paged on the client side). For the purposes of this tutorial, we are keeping it anyway.

**Fixing the Searchable collections**

Before getting involved with the Traits concept, let's enhance the Searchable fixed parameters by applying a generic "query" queryParameter.

```yaml
/songs:
  type:
    collection:
      exampleCollection: !include jukebox-include-songs.sample
      exampleItem: !include jukebox-include-song-new.sample
  get:
    queryParameters:
      songTitle:
        description: "The title of the song to search (it is case insensitive and doesn't need to match the whole title)"
        required: true
        minLength: 3
        type: string
        example: "Get L"
```

```yaml
/songs:
  type:
    collection:
      exampleCollection: !include jukebox-include-songs.sample
      exampleItem: !include jukebox-include-song-new.sample
  get:
    queryParameters:
        query:
          description: |
            JSON array [{"field1","value1","operator1"},{"field2","value2","operator2"},...,{"fieldN","valueN","operatorN"}] with valid searchable fields: songTitle
          example: |
            ["songTitle", "Get L", "like"]
```

If you reset your workspace, you will see this enhancement applied to every Searchable resource.

Reset your workspace:

```
git checkout -f step7a
```

**Searchable Trait**

The same way that several resources might utilize a specific resourceType, it's possible to define and reuse similar behavior with traits. This is one of these concepts that are better explained by code:

```yaml
/songs:
  type:
    collection:
      exampleCollection: !include jukebox-include-songs.sample
      exampleItem: !include jukebox-include-song-new.sample
  get:
    queryParameters:
        query:
          description: |
            JSON array [{"field1","value1","operator1"},{"field2","value2","operator2"},...,{"fieldN","valueN","operatorN"}] with valid searchable fields: songTitle
          example: |
            ["songTitle", "Get L", "like"]
```

```yaml
traits:
  - searchable:
      queryParameters:
        query:
          description: |
            JSON array [{"field1","value1","operator1"},{"field2","value2","operator2"},...,{"fieldN","valueN","operatorN"}] <<description>>
          example: |
            <<example>>aml
```

As you can see, this Searchable trait is comprised of a name and an applicable parameter. It is also evident in the example above that traits can be parameterized. Let's check how the trait can be applied to a method:

```yaml
/songs:
  type:
    collection:
      exampleCollection: !include jukebox-include-songs.sample
      exampleItem: !include jukebox-include-song-new.sample
  get:
    is: [searchable: {description: "with valid searchable fields: songTitle", example: "[\"songTitle\", \"Get L\", \"like\"]"}]
```

So, what the definition is really saying is that there is a trait called "Searchable" and that the "/songs" resource utilizes it. Furthermore, the trait is applied to the GET method itself, since the "Searchable" contract should only be applied to that particular method.  In other cases, you could apply a trait to the whole resource, and even more: **traits can also be applied to resourceTypes.** This topic should and will be covered in a separate tutorial (types composition). Feel free to try this out anyway, and always remember that you can:

Reset your workspace:

```
git checkout -f step7b
```

Note that in the step7b workspace, we have already applied the Searchable trait to `/songs`, `/artists` and `/albums` resources.

**Other traits**

Considering our table, we need to create 2 additional traits: Orderable and Pageable. The creation is trivial, and when applied we confirm something that you might have noticed during  the previous step: traits are a collection (that's why they are applied within an array).

```yaml
  - orderable:
      queryParameters:
        orderBy:
          description: |
            Order by field: <<fieldsList>>
          type: string
          required: false
        order:
          description: Order
          enum: [desc, asc]
          default: desc
          required: false
  - pageable:
      queryParameters:
        offset:
          description: Skip over a number of elements by specifying an offset value for the query
          type: integer
          required: false
          example: 20
          default: 0
        limit:
          description: Limit the number of elements on the response
          type: integer
          required: false
          example: 80
          default: 10
```

```yaml
/songs:
  type:
    collection:
      exampleCollection: !include jukebox-include-songs.sample
      exampleItem: !include jukebox-include-song-new.sample
  get:
    is: [
          searchable: {description: "with valid searchable fields: songTitle", example: "[\"songTitle\", \"Get L\", \"like\"]"},
          orderable: {fieldsList: "songTitle"},
          pageable
        ]
```

In this case, you can see that the "Pageable" trait receives no parameter.

Go ahead! Apply the proper traits to the proper resources as we defined in the table.
Once done, the code should look like the one on step7c

Reset your workspace:

```
git checkout -f step7c
```

## FINAL TUNNING

We could say that our RAML file has been properly refactored and is now much more readable, reusable, and maintainable. Maybe a last step would be to double-check which parts of the RAML definition could now be extracted to other files (the same way we have done with the "examples").
Starting at the root, we find the schemas, and it seems a no-brainer that each JSON (in this case) could be extracted and included as we have learned.

Reset your workspace:

```
git checkout -f step8
```

You will see that the schemas section ended as:

```yaml
schemas:
 - song: !include jukebox-include-song.schema
 - artist: !include jukebox-include-artist.schema
 - album: !include jukebox-include-album.schema
```
and of course, three new files will appear in your file system.

While this doesn't seem to be a revelation (it isn't), let's keep checking our RAML file to discover what else can be extracted. Honestly, resourceTypes and traits are really tempting. But if you try to follow the same strategy, you will surely fail. Remember in previous sections that we explained that the `!include` function would just take the content of the file and embed its contents as a string? That’s precisely what we wanted to do with the examples and the schemas. However, if we look at the resourceTypes and traits again, we will notice that they are not just strings, but maps (just like the rest of the RAML file). So basically, NO! You CANNOT extract these with the same approach you used to extract examples and schemas.

However, you could extract all the resourceTypes to a file (and do the same with the traits).

```
resourceTypes: !include jukebox-includes-resourceTypes.inc
```

While this is not a restriction, it’s good to note it doesn't mean it's a recommended practice. In some cases, you will need to compromise. For example: if we had 2000 lines of resourceTypes definition, we probably would like to extract this to a separate file. But if the resourceTypes are not really complicating the readability, it could also be nice to be able to see how they are defined without going to an external file. As usual, it's a matter of good judgment.

## CONCLUSION
In this tutorial, we learned how to optimize our RAML file from a code reuse and maintainability point of view, Traits, resourceTypes, and includes were introduced and a full use case was developed and refactored.

Finally, just like in every discipline, we need to use good judgment. Always remember that over engineering is never a good idea. Ever.
