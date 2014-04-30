## RAML 200 TUTORIAL

### Objective
Once you got familiar with the [basics of RAML](http://raml.org/docs.html), it's time to move on and get into more complex features of the language itself, that will allow you to take full advantadge of it.

### Introduction
This tutorial will guide you through a complete use case by showing how to optimize and reuse your code by applying concepts such as resourceTypes and traits and RAML utilities such as includes. The tutorial will also introduce the concept of schemas and show how to use these to validate an HTTP body

### Assumptions
You know the [basics of RAML](http://raml.org/docs.html): how to write a RAML file, resources, parameters, methods, and responses.

### Hands on!
This tutorial will be explaining and showing snippets of RAML definitions. However, the best approach to learn the presneted concepts, is to hands on and play with the code.
With this purpose, you can easily setup a workspace, play and mess with the code, and reset it to any of the steps of this tutorial.


## SETTING UP THE WORKSPACE
If you decided to "hands on", please clone the GitHub repository

```
git clone https://github.com/mulesoft/raml-tutorial-200.git
```

**Spoiler alert:** After cloning, the repository will be in its final state. You can browse the code as it is, but it will be like reading the last chapter of a book.

Before each step, it will be possible (and recommended) to "sync" the code with the step you are about to read, like

```
git checkout -f [stepX]
```

Note: after clonning the repository, you will need to access to its folder on your local computer. This step will be reminded on each step.

## USE CASE DESCRIPTION

You are helping to build a music Jukebox. While the physical device will be responsible for displaying the information, and capturing the user input, it will be relying on your API to get the contents. The Jukebox needs to be able to:

- Show the full list of artists.
- Show the full list of albums.
- Show the list of artists by nationality.
- Show the list of albums by genre.
- Search for a song by title.
- Show a particular artist's albums collection.
- Show a particular album's songs list.
- Play a song (by specifying the song id).
- Enter new Artists, Albums and Songs (only authenticated users).

**Consideration:** This is a jukebox, not a command line. People in pubs might be unable to type lot of characters, so, a user friendly UI (paging, pictures-based, etc) would be very appreciated.

## **STEP 0:** BASE RAML FILE

Reset your workspace:
```
git checkout -f step0
```
If you have read the [RAML 100 Tutorial](http://raml.org/docs.html), you should be able to understand our base RAML file without major difficulties. Its basic structure could be described as:

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

If you look into jukebox-api.raml you will find all the resources defined, their GETs methods described, and POSTs methods almost empty.

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

## **STEP 1:** BODY PARAMETERS
### Form Parameters

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
`/file-content` resource represents the file to reproduce when a Jukebox user select a particular song. There are tons of ways of modeling this scenario on a RESTful API. We've chosen this one for this tutorial purposes. It doesn't mean it's a best practice at all.

As you can see in the POST definition, its `body` contains two possible content-types. Yes, you can represent that on a RESTful API, and this is the way that RAML supports it. The `binary/octet-stream` is simple expecting for a file content to be sent as parameter. It's a valid and popular technique on APIs supporting files, however, it makes the API impossible to use from a Web Browser (at least with the purpose of uploading a file).

For the `multipart/form-data` (and also the `application/x-www-form-urlencoded`), it is possible to define a map of "formParameters", defining this map the same way that the rest of the RAML ones (in this case, the "file" field is required and of type "file").

### Schemas

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

What the example is basically saying is: "The expected parameter is a valid json, and for valid, it needs to fulfill the specified schema definition". In this case, the represented object:

- Has a "songTitle" property of type "string", and it's required
- Has a "albumId" property of type "string", and not only is it required, but also it needs to be 36 characters long.

It's not the intention of this tutorial explain how JSON and XML schemas work, but you could find information about it at [http://json-schema.org/](http://json-schema.org/) and [http://www.w3.org/XML/Schema.html](http://json-schema.org/)

## **STEP 2:** EXTRACT SCHEMAS

Reset your workspace:
```
git checkout -f step2
```

One interesting RAML feature is the possibility of extracting the schemas and reference them by using a name. There are three major advantadges of doing this, the first two might look obvious: Improve RAML readability and allow reusing the schemas in several sections. The third advantadge will become clear in following sections, when trying to use "resource types" and parametrize these.

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

As you can see in the code example, the schema described in previous sections is now being defined and referenced by the name "song". The name choice is not random, and the correct convention will allow you to parametrize resource types and reuse a lot of code (this will be explained in following sections).

## **STEP 3:** INTRODUCING RESOURCE TYPES
### The "collection/collection-item" pattern

**We are definitively not saying that all RESTful APIs are the same,** not even suggesting it. But there are some common "behaviors" that can be found in tons of them. Particualrilly, if we are trying to represent "resources" that could be infered from a business model, it will probably happen to find some kind of analogy with the CRUD models. Given a resource, you can **c**reate a new one, **r**etrieve one or all of them and **u**pdate or **d**elete an existing one.

In that sense, we can easily identify an existing resource (to be fetched, deleted or updated), a new one (to be added to a collection) and the collection itself (to be retrieved)

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

So, we found two different type of resources. The item (represented by an id), and the collection (containing all the items). It would be nice to be able to define these types, and "declare" the resources of those types.

### Resource Types in RAML

Luckily, there is a way to do this in RAML.

Reset your workspace:
```
git checkout -f step3a
```

Similar to last example code, where we only showed the resources and supported methods, this step consists in just creating the "resourceTypes" with their supported methods.

```yaml
resourceTypes:
  - collection:
      get:
      post:
  - collection-item:
      get:
```

As you may notice, the PUT and DELETE methods are not defined for the collection-item resourceType, as you could expect. This is basically because the use case is not requesting for any resource to be deleted or updated.

So, what this version of the jukebox-api.raml is saying is "There are two resource types: collection, which has the GET and POST methods defined, and collection-item which has the GET method defined". Like that, it doesn't really seem to be very useful, however, it's easy to understand as the first step of defining good resourceTypes and reusing code.

### Defining and parametrizing resourceTypes

The following explanation and code snippets will guide you step by step on how to get the next version of the jukebox-api.raml. Nevertheless, you can see the final result by reseting your workspace.

Reset your workspace:

```
git checkout -f step3b
```

What we know about our collections this far? Let's check what "/songs", "/artists", and "/albums" have in common:

- Description
- GET method with:
  - a description
  - a response for HTTP status 200 (which body's content type is "application/json")
- POST method with:
  - a description
  - an "access_token" queryParameter
  - a bodyParameter with "application/json" contentType and validated by a Schema
  - and a response for HTTP status 200 (which body's content type is "application/json")

So, let's extract this from one of the resources (I will take "/songs" for this example, but we will end parametrising the resourceType, so it doesn't matter which one you choose to start).

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

With the `collection` resourceType as it is right now, there is not much we can do. Apply it to `/songs` resource is a possibility, but we don't want that descriptions, schemas, or even the POST response to be applied to all the resources since they are "song's specifics".

Parameters are useful here. Suppose that you can write a "placeholder" on the resourceType to be filled with a value specified on the resource. For instance:

```
description: Collection of available <<resource>> in Jukebox
```

with <<resource>> receiving "songs", "artists", or "albums" depending on the resource.

Well, while this is possible (and useful for most scenarios), for this particular case, it's not even necessary for the resource to pass the parameter thanks to the **Reserved Parameters.**

A Reserved Parameter simply is a parameter with a value automatically specified by its context. For the resourceTypes case, there are two Reserved Parameters: resourcePath and resourcePathName and for the `/songs` example, the values will be "/songs" and "songs" respectively.

But if you are looking at the last code snippet, you will realize that we need the values to be "songs" in some cases and "song" in others.

Here is where Parameters Transformers become handy.

There are two Parameters Transformers we could use for this example: `!singularize` and `!pluralize` (note: The only locale supported by the current version of RAML is "United States English").

So, combining this, let's replace in our latest code snippet:

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

Please, note that even the Schema name is specified by making use of this parameter (singular in this case). Do you remember when extracting the schemas at the step 2? We've mentioned that the schema name was not random and that was going to be important. Well, this is why.

Another important aspect to stress out, is that defining and applying a resourceType to a resource doesn't forbid you to overwrite any of the map's elements. In this example, we still see that GET method is present in both, resource and resourceType (the same for the responses, POST, etc). Not only is this allowed, but also is the way of redefining something that changes from one resource to other. **If you are thinking of inheritance, you are getting the idea right!**

If this is already clear, let's work with the "collection-item" resourceType.

Reset your workspace:

```
git checkout -f step3c
```

There is nothing new with that code. More resourceType definition, parametrization and usage

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

But as you can see, we are still repeating lot of code. For instance:

```yaml
get:
  responses:
    200:
      body:
        application/json:
          example: |
```

Basically, every piece of code needed to define the **examples**. And this is basically because we have only learned how to use Reserved Parameters. However, we have also mentioned that the idea of parametrizing is to specify "placeholder" to be filled with a specified value.

That would solve our "examples problem".

## **STEP 4:** FREE PARAMETERS

Reset your workspace:

```
git checkout -f step4
```

At the moment of defining the parameter in the resourceType (put the placeholder), there is no difference between a free or reserved parameter. The actual difference appears when passing the parameter at the resource level. For instance, a parameter named as `exampleItem` will need to be passed this way:

```yaml
/{songId}:
    type:
      collection-item:
        exampleItem: THIS IS THE EXAMPLE
```

In "human language", it's basically saying that `/{songId}` resource is of `collection-item` type (the same than on the previous step). But now, it's also indicating that the value for the `collection-item` parameter `exampleItem` is "THIS IS THE EXAMPLE". Since this is a String, all the YAML rules for Strings are valid.

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

As you can see, the same concept shown at the previous example, was applied to the entire `/songs`, and `/songs/{songId}` resources.

The code that was being repeated at the end of the step 3, is now completely on the resourceType at the point that the POST definition, directly disappeared from the resources. **That's correct. Now, every `collection-item` typed resources will have a valid (generic) POST definition without even writing it.**

## **STEP 5:** INCLUDES

Reset your workspace:
```
git checkout -f step5
```

We have improved our RAML definition a lot on last step by using resourceTypes. We were able to extract common members of the resources and encapsulate these on some kind of structure that grants inheritance-like capabilities.

Nevertheless, the RAML file still contains lot of information that could be considered as "not API-describing" or at least "economy-class" members **Equally important, but not necessarily part of the main RAML file**.

Through includes, RAML allows us to build file-distributed API definitions, which not only is useful to encourage code reuse, but also improves the definition readability.

In this step, we are going to extract the examples used for `/songs` resource to different files and include these in the main RAML definition.

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

As you can see, the extracted files contains raw strings. It's important to stress out that every included file, is treated as a string by RAML, which presents some well known restrictions regarding with the way to distribute the definition among files. More than limitations, those restrictions attempt to define a common way to work with includes, to avoid free form defined APIs. Remember that one of the RAML major goals, is to unify criteria after all.

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

As it's being shown on the last code snippet, RAML features encourage you to reduce the quantity of code you need to write, while making it more reusable and maintainable.

## **STEP 6:** HARD STOP

We have introduced several features and made great progress with our API definition, but aren't we missing something? We have just focused on "/songs" resource (and descending branch). If you check your RAML file right now, you will discover that all other resources are still not taking advangadge of all the work we have done.

Let's solve that right now! Repeat the same procedures for all the resources (identify and apply the collection and collection-item pattern , pass the correct parameters, and extract the belonging examples into separated files). When you finish with that your workspace should look like the following one:

Reset your workspace:

```
git checkout -f step6a
```
As you might notice, the quantity of lines in the RAML file has been reduced a lot and there are more files than before. Most important: It's simpler!

But not everything went that well and smooth. If you look carefully, there is a problem with sub-collections (`/artists/{artistId}/albums` and `/albums/{albumId}/songs`). Since these aren't the main collection of each resource, we had decided not to allow new elements to be created on them. In other words, these collections were READ-ONLY. When applying `collection` resourceType, we have automatically added the "POST" method to these. As an additional consequence, the RAML definition now requires the `exampleItem` parameter to be passed for those resources too (which we have temporarily resolved by passing `{}`).

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

Well, that's awkward but not a big deal, and it will actually help us to go further in order to solve it.

Let's just create another resourceType called `readOnlyCollection`. It will be similar to `collection` but without the "POST method". And let's apply this new resourceType to the belonging collections.

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

If you are follwing the code in detail, you will have already notice something: `collection` and `readOnlyCollection` resourceTypes are repeating some code. Actually, `readOnlyCollection` code is completely included in `collection` code. You are right! And there is a way of making this more efficient. It's all about "types composing" and it will be totally covered on some other tutorial.


## **STEP 7:** TRAITS
We are almost done. Actually, we are fulfilling all the requirements for the described use case. But as usual, we discover something while building, and this tutorial cannot be the exception.

Won't I be able to sort my collections? Shouldn't my API give the chance of paging these? And by the way, is the strategy we choose for searching on a collection good enough? What if we need to enhance and make more complex queries in the future?

Let's tackle down these issues. First, we need to understand in right.

### Understanding our resources

Let's build a simple table to discover and agree about each collection capabilities:

| Collection/Capabilities        | Searchable	           | Sorteable  |  Pageable |
| ------------- |:-------------:| :-----:| :-----: |
| `/songs`      | YES | YES | YES |
| `/artists`    | YES | YES | YES |
| `/albums`     | YES | YES | YES |
| `/artists/{aId}/albums` | NO | YES | YES |
| `/albums/{aId}/songs` | NO | YES | NO |

If we considered who will be consuming the API, this table would probably be different (small collections can be filtered, ordered and paged on the client side). We are keeping it anyway for this tutorial purposes.

### Fixing the Searchable collections

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

If you reset your workspace, you will see this enhancement applied to every Searchable resource

Reset your workspace:

```
git checkout -f step7a
```

### Searchable Trait
The same way that several resources could belong to a specific resourceType, it's possible to define and reuse similar behavior by wirting traits. This is one of these concepts that are better explained by code:
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

As you can see, this Trait is composed by a name and the applicable parameter. It's also shown in the example that traits can also be parametrized.
Let's check how a Trait can be applied:

```yaml
/songs:
  type:
    collection:
      exampleCollection: !include jukebox-include-songs.sample
      exampleItem: !include jukebox-include-song-new.sample
  get:
    is: [searchable: {description: "with valid searchable fields: songTitle", example: "[\"songTitle\", \"Get L\", \"like\"]"}]
```

So, what the definition is really saying is that, there is a trait called "Searchable", and the "/songs" resource applies it. Further than that, the trait is applied to the method "GET" itself, since the "Searchable" contract should only be applied to it. In other cases, you could apply a Trait to the whole resource, and even more: **traits can also be applied to resourceTypes.** This topic should and will be covered in a separated tutorial (types composition). Feel free to try this out anyway, always remember that you can:

Reset your workspace:

```
git checkout -f step7b
```

Note that in the step7b workspace, we have already applied the Searchable trait to `/songs`, `/artists` and `/albums` resources.

### Other traits
Well, considering the table we built, we would need to create 2 additional traits: Orderable and Pageable. The creation is trivial, and when applied, we end confirming something that could have been seen on the previous step: Traits are a collection (that's why they are applied within an array).

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

Go ahead! Apply the proper traits to the proper resources as we defined on the table.

Once done, the code should look like the one on step7c

Reset your workspace:
```
git checkout -f step7c
```

### The hidden trait

Have you noticed another "piece of code"/"behavior or contract" that is being repeated in our RAML definition? No? Well, that's because it's kind of hidden by a resourceType.

Remember the use case description? For the writeable collections the user needs to have some specific access permission. We had implemented this by adding an `access_token` queryParameter to the "POST" methods of these resources, and after a couple of steps, we extracted that piece of code to the `collection` resourceType.

While technically, there isn't anything wrong with that, conceptually, the parameter could be added by implementing a trait (since it's more signature related than type itself), and of course as it has been said, it can be applied then at resourceType level (in this case, `collection` that is writeable will have it).

```yaml
- collection:
    description: Collection of available <<resourcePathName>> in Jukebox.
    is: [securized]
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
- securized:
    queryParameters:
        access_token:
          description: "The access token provided by the authentication application"
          example: AABBCCDDEE
          required: true
          type: string
```

In our OOP analogy, `collection` implements `securized`, and `/songs`, `/artists`, `/albums` extend `collection`.

You can now implement that code or simply reset your workspace:
```
git checkout -f step7d
```


## **STEP 8:** INCLUDES (SECOND PART)
We could say that our RAML file has been properly refactorized and is now much more readable, reusable and maintainable. Maybe a last step would be to double check which parts of the RAML definition could now be extracted to other files (the same way we have done with the "examples").

Starting from the top, we find the "schemas", and it seems to be a no brainer that each JSON (in this case) could be extracted and included as we have learned

Reset your workspace:
```
git checkout -f step8
```

You will see that the "schemas" section ended like:

```yaml
schemas:
 - song: !include jukebox-include-song.schema
 - artist: !include jukebox-include-artist.schema
 - album: !include jukebox-include-album.schema
```
and of course, three new files will appear on your file system.

While this doesn't seem to be a revelation (it isn't), let's keep checking our RAML file to discover what else can be extracted. Well, honestly, resourceTypes and traits are really tempting. But if you try to follow the same strategy, you will surely fail. Remember in previous sections that we explained that the "include" function would just take the content of the file and embeed it contents as a string? Well, that's precisely what we wanted to do with the examples and the schemas, but if we look at the resourceTypes and traits twice, we will notice that they are not just "strings", but maps (as the rest of the RAML file). So basically, NO! you can't extract these with the same approach you extracted examples and resourceTypes.

However, you could try to extract all the resourceTypes to a file (and do the same with the traits).

```
resourceTypes: !include jukebox-includes-resourceTypes.inc
```

Since this is not a restriction, it could be good to mention that it doesn't mean it's a recommended practice. In some cases, you will need to compromise. For example: if we had 2000 lines of resourceTypes definition, we probably will like to extract this to a separated file. But if the resourceTypes are not really complicating the readability, it could also be nice to be able to see how they are defined without going to a separated file. As usual, it's a matter of good judgement and criteria.

## CONCLUSION
On this tutorial, we have learned how to optimize our RAML file from a code reuse and maintainibility point of view. Usage of resourceTypes, traits, and includes was introduced and a full use case was developed and refactorized.

It was also introduced the idea of "types composing" even though a deeper explanation will be provided on a separated tutorial.

Finally, and like in every discipline, we need to apply criteria and good judgement. Always remember that overengineering is not a good idea. Not at all.
