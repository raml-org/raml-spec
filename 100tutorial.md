---
layout: regular
title: Your New Jekyll Site
---
## RAML 100 TUTORIAL

### Objective
Learn the basics of RAML by designing a very basic API for BookMobile.

### Introduction
This tutorial will guide you through conceptualizing the design of your API and writing it in RAML, the RESTful API Modeling Language.

### Assumptions
You know the basics of how RESTful APIs operate: how to send requests and responses, and how to specify the components of a RESTful API.

## **STEP 1:** ENTER THE ROOT
Let's say you are the API designer for a BookMobile startup. You've worked out a business plan, a scaling plan, and Ashton Kutcher is an angel investor. You know you want developers to capitalize on what you've built, so that you can capitalize on what THEY build. You know having a RESTful API is one way to make that happen. So, let's get started by writing a spec.

**First, you'll enter some basic information in a text editor. You can save your API's RAML definition as a text file with a recommended extension .raml:**

```yaml
#%RAML 0.8
---
title: e-BookMobile API
baseUri: http://api.e-bookmobile.com/{version}
version: v1
```

Everything you enter in at the [root](https://github.com/raml-org/raml-spec/blob/master/04_basic_information.md#root-section) (or top) of the spec applies to the rest of your API. This is going to come in very handy later as you discover patterns in how you build your API. The baseURI you choose will be used with every call made, so make sure it's as clean and concise as can be.

## **STEP 2:** ENTER RESOURCES

As a thoughtful API designer, it's important to consider how your API consumers will use your API. It's especially important because in many ways, as the API designer YOU control the consumption. For example, consider the functionality of the BookMobile API. You know you want your users to be able to keep track of what they've read and their favorites. Users should also be able to discover new books and look at other titles written by their favorite authors. To do this, you define various _collections_ as your [resources](https://github.com/raml-org/raml-spec/blob/master/05_resources_and_methods.md#resources-and-nested-resources).

**Recalling how your API consumers will use your API, enter the following three resources under your root:**

```yaml
  /users:
  /authors:
  /books:
```

Notice that these resources all begin with a backslash (/). In RAML, this is how you indicate a resource. Any methods and parameters nested under these top level resources belong to and act upon that resource. Now, since each of these resources is a collection of individual objects (specific authors, books, and users), we'll need to define some sub-resources to fill out the collection.

**Nested resources are useful when you want to call out a particular subset of your resource in order to narrow it. For example:**

```yaml
  /authors:
    /{authorname}:
```

This lets the API consumer interact with the key resource and its nested resources. For example a GET request to http://api.e-bookmobile.com/authors/Mary_Roach returns details about science writer and humorist Mary Roach. Now, let's think about what we want developers and API consumers to DO.

## **STEP 3:** ENTER METHODS

Here's where it starts to get interesting, as you decide what you want the developer to be able to do with the resources you've made available. **Let's quickly review the 4 most common HTTP verbs:**

**GET -** Retrieve the information defined in the request URI.

**PUT -** Replace the addressed collection. At the object-level, create or update it.

**POST -** Create a new entry in the collection. This method is generally not used at the object-level.

**DELETE -** Delete the information defined in the request URI.

You can add as many methods as you like to each resource of your BookMobile API, at any level. However, each HTTP method can only be used once per resource. Do not overload the GET (you know who you are).

In this example, you want developers to be able to work at the collection level. For example, your API consumers can retrieve a book from the collection (GET), add a book (POST), or update the entire library (PUT). You do not want them to be able to delete information at the highest level. Let's focus on building out the /books resource.

**Nest the methods to allow developers to perform these actions under your resources. Note that you must use lower-case for methods in your RAML API definition:**

```yaml
  /books:
    get:
    post:
    put:
```
## **STEP 4:** ENTER URI PARAMETERS

The resources that we defined are collections of smaller, relevant objects. You, as the thoughtful API designer, have realized that developers will most likely want to act upon these more granular objects. Remember the example of nested resources above? /authors is made up of individual authors, referenced by {authorName}, for example. This is a URI parameter, denoted by surrounding curly brackets in RAML:

```yaml
  /books:
    /{bookTitle}:
```

So, to make a request to this nested resource, the URI for Mary Roach's book, Stiff would look like http://api.e-bookmobile.com/v1/books/Stiff

**Time to edit your spec to reflect the inherent granular characteristics of your resources:**

```yaml
 /books:
   get:
   put:
   post:
   /{bookTitle}:
     get:
     put:
     delete:
     /author:
       get:
     /publisher:
       get:
```

## **STEP 5:** ENTER QUERY PARAMETERS

Great job so far! Now, let's say you want your API to allow even more powerful operations. You already have collections-based resource types that are further defined by object-based URI parameters. But you also want developers to be able perform actions like filtering a collection. Query parameters are a great way to accomplish this.

**Start by adding some query parameters under the GET method for books. These can be specific characteristics, like the year a book was published:**

```yaml
  /books:
    get:
      queryParameters:
        author:
        publicationYear:
        rating:
        isbn:
    put:
    post:
```

Query parameters may also be something that the server requires to process the API consumer's request, like an access token. Often, you need security authorization to alter a collection or record.

**Nest the access-token query parameter under the PUT method for a specific title:**


```yaml
 /books:
   /{bookTitle}
     get:
       queryParameters:
         author:
         publicationYear:
         rating:
         isbn:
     put:
       queryParameters:
         access_token:
```

An API's resources and methods often have a number of associated query parameters. Each query parameter may have any number of optional attributes to further define it. The Quick reference guide contains a full listing.

**Now, specify attributes for each of the query parameters you defined above. As always, be as complete in your documentation as possible:**

```yaml
 /books:
   /{bookTitle}
     get:
       queryParameters:
         author:
           displayName: Author
           type: string
           description: An author's full name
           example: Mary Roach
           required: false
         publicationYear:
           displayName: Pub Year
           type: number
           description: The year released for the first time in the US
           example: 1984
           required: false
         rating:
           displayName: Rating
           type: number
           description: Average rating (1-5) submitted by users
           example: 3.14
           required: false
         isbn:
           displayName: ISBN
           type: string
           minLength: 10
           example: 0321736079?
      put:
        queryParameters:
          access_token:
            displayName: Access Token
            type: string
            description: Token giving you permission to make call
            required: true
```

To make a PUT call, your URI looks like http://api.e-bookmobile.com/books/Stiff?access_token=ACCESS TOKEN

## **STEP 6:** ENTER RESPONSES

Responses MUST be a map of one or more HTTP status codes, and each response may include descriptions, examples, or schemas. Schemas are more fully explained in the Level 200 tutorial.

```yaml
 /books:
   /{bookTitle}:
     get:
       description: Retrieve a specific book title
       responses:
         200:
           body:
             application/json:
              example: |
                 {
                   "data": {
                     "id": "SbBGk",
                     "title": "Stiff: The Curious Lives of Human Cadavers",
                     "description": null,
                     "datetime": 1341533193,
                     "genre": "science",
                     "author": "Mary Roach",
                     "link": "http://e-bookmobile.com/books/Stiff",
                   },
                   "success": true,
                   "status": 200
                 }
```

**Congratulations! You've just written your first API definition in RAML.**
