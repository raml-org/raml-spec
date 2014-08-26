raml-spec gh-pages branch (A.K.A raml.org website)

# Working with gh-pages

## Creating a new "Pages Project"

You can skip this step if you are working within an existing gh-pages project.
If not, just follow the steps on https://pages.github.com/ (this guideline is based on "Project Sites").

## Cloning the repo

It's convenient to keep your workspace with a single repo created and work by changing from branch to branch.
This means that the real project will coexists at the same workspace that the gh-pages and any other branch.


    # git clone [yourProjectURL]


Note: if you are following this first step, run a `git pull` on your machine so your local repo is aware of the existance of this new branch "gh-pages"

## Branching gh-pages

If we start working directly on "gh-pages" branch, every time that we push to the remote repository, the changes will be published
on the "Production" site.

It's not always desired. For example, what happens if we wanted to work and send for peer reviewing? TOO LATE, once it's published, it's published.

So, it makes sense to work on a branch of "gh-pages". We will call it "gh-pages-staging" for this example.

    # git branch gh-pages-staging gh-pages

From the git branch -h: `git branch [options] [-l] [-f] <branchname> [<start-point>]`

Now, let's move to that branch to start working:

    # git checkout gh-pages-staging
    
Once there, just make the desired changes and, as usual:

    # git add .
    # git commit -m "A good and describing comment"
    # git push origin gh-pages-staging
    
Please, pay attention to the destination of the push.
Once it's done, you can check that the "gh-pages" branch was have not been modified, hence, the published version isn't either.
mov

## Styling

The stylesheet language "Sass" (with SCSS syntax) is used for organizing and writing CSS.

All styling is contained in sass/screen.scss and needs to be compiled into stylesheets/screen.css before being committed.

To install Sass and compile your scss into css, you can either do it manually using the command line, or download an application that installs Sass and automatically compiles your scss everytime you make a change to screen.scss (applications Compass or Scout are recommended) Learn more: http://sass-lang.com/install

To learn how to use Sass: http://sass-lang.com/guide

## Reviewing

The reviewer can just clone and checkout the "gh-pages-staging" branch to have it in his local environment
and perform the review there.

Once approved, it can be published.

## Publishing

Since "gh-pages-staging" is just a branch of "gh-pages", merging and pushing will do the publishing trick.


Make sure you are standing on "gh-pages" branch (yes, the production one), since we will be merging the changes
inhere.

    # git checkout gh-pages
    # git merge gh-pages-staging

Now the changes are on the production branch (on your local repository), waiting for them to be pushed (and published at the same time).

    # git push origin gh-pages
    
Done!
