---
layout: post
title: 'Better understanding Linux dependency solving with examples'
author: 'David Corvoysier'
date: '2015-01-08 14:00:00'
categories:
- Linux
tags:
- gcc
- ld
type: post
---
A few months ago I stumbled upon a linking problem with secondary dependencies I couldn't solved without 'over-linking' the corresponding libraries.

I only realized today in a discussion with my friend [Yann E. Morin](http://ymorin.is-a-geek.org/) that not only did I use the wrong solution for that particular problem, but that my understanding of the gcc linking process was not as good as I had imagined.

This blog post is to summarize what I have now understood.

<!--more-->

#A few words about Linux libraries

This paragraph is only a brief summary of what is very well described in [The Linux Documentation Project library howto](http://tldp.org/HOWTO/Program-Library-HOWTO/introduction.html).

Man pages for the linux [linker](http://linux.die.net/man/1/ld) and [loader](http://linux.die.net/man/8/ld-linux) are also a good source of information.

There are three kind of libraries in Linux: static, shared and dynamically loaded (DL).

##Static libraries

A static library is simply an archive of object files conventionally starting with the `lib` prefix and ending with the `.a` suffix.

_Example:_
~~~
libfoobar.a
~~~

Static libraries are created using the __ar__ program:

~~~
$ ar rcs libfoobar.a foo.o bar.o
~~~

Linking a program with a static library is as simple as adding it to the link command either directly with its full path:

~~~
$ gcc -o app main.c /path/to/foobar/libfoobar.a
~~~

or indirectly using [linker options](http://linux.die.net/man/1/ld):

~~~
$ gcc -o app main.c -lfoobar -L/path/to/foobar
~~~

##Shared libraries

A shared library is an __ELF__ object loaded by programs when they start.

Shared libraries follow the same naming conventions as static libraries, but with the `.so` suffix instead of `.a`.

_Example:_
~~~
libfoobar.so
~~~

Shared library objects need to be compiled with the `-fPIC` option that produces position-independent code, ie code that can be relocated in memory.

~~~
$ gcc -fPIC -c foo.c
$ gcc -fPIC -c bar.c
~~~

The __gcc__ command to create a shared library is similar to the one used to create a program, with the addition of the `-shared` option.

~~~
$ gcc -shared -o libfoobar.so foo.o bar.o
~~~

Linking against a shared library is achieved using the exact same commands as linking against a static library:

~~~
$ gcc -o app main.c libfoobar.so
~~~

or

~~~
$ gcc -o app main.c -lfoobar -L/path/to/foobar
~~~

>Note that in the latter case, if a static library is present at the same location, the linker will link against it, and not against the shared library.

##Shared libraries and undefined symbols

An __ELF__ object maintains a table of all the symbols it uses, including symbols belonging to another __ELF__ object that are marked as undefined.

At compilation time, the linker will try to __resolve__ an undefined symbol by linking it either statically to code included in the overall output __ELF__ object or dynamically to code provided by a shared library.

If an undefined symbol is found in a shared library, a `DT_NEEDED` entry is created for that library in the output __ELF__ target.

The content of the `DT_NEEDED` field depends on the link command:
- the full path to the library if the library was linked with an absolute path,
- the library name otherwise (or the library [__soname__](#library-versioning-and-compatibility) if it was defined).

You can check the dependencies of an__ELF__object using the __readelf__ command:

~~~
$ readelf -d main
~~~
or
~~~
$ readelf -d libbar.so
~~~

When producing an executable a symbol that remains undefined after the link will raise an error: all dependencies must therefore be available to the linker in order to produce the output binary. 

For historic reason, this behavior is disabled when building a shared library: you need to specify the `--no-undefined` (or `-z defs`) flag explicitly if you want errors to be raised when an undefined symbol is not resolved.

~~~
$ gcc -Wl,--no-undefined -shared -o libbar.so -fPIC bar.c
~~~
or
~~~
$ gcc -Wl,--no-undefined -shared -o libbar.so -fPIC bar.c
~~~

>Note that when producing a static library, which is just an archive of object files, no actual 'linking' operation is performed, and undefined symbols are kept unchanged.

##Dynamically Loaded libraries

Dynamically loaded (DL) libraries are shared libraries that are loaded at times other than during the startup of a program (ie plugins), using the [`dlopen`](http://linux.die.net/man/3/dlopen) API.

They use the exact same format as shared libraries and are created using the same commands.

##Library versioning and compatibility

Several versions of the same library can coexist in the system.

By conventions, two versions of the same library will use the same library name with a different version suffix that is composed of three numbers:
- major revision,
- minor revision,
- build revision.

_Example:_
~~~
libfoobar.so.1.2.3
~~~

This is often referred as the library __real name__.

Also by convention, the library major version should be modified every time the library binary interface ([ABI](http://en.wikipedia.org/wiki/Application_binary_interface)) is modified.

Following that convention, an executable compiled with a shared library version is theoretically able to link with another version of the __same major revision__.

This concept if so fundamental for expressing compatibility between programs and shared libraries that each shared library can be associated a __soname__, which is the library name followed by a period and the major revision:

_Example:_
~~~
libfoobar.so.1
~~~

The library __soname__ is stored in the `DT_SONAME` field of the __ELF__ shared object.

The __soname__ has to be passed as a linker option to __gcc__.

~~~
$ gcc -shared -Wl,-soname,libfoobar.so.1 -o libfoobar.so foo.o bar.o
~~~

As mentioned before, whenever a library defines a __soname__, it is that __soname__ that is stored in the `DT_NEEDED` field of __ELF__ objects linked against that library.

##Solving versioned libraries dependencies at build time

As mentioned before, libraries to be linked against can be specified using a shortened name and a path:

~~~
$ gcc -o app main.c -lfoobar -L/path/to/foobar
~~~

For the linker to find the library, the installer will typically create a symbolic link from the library __real name__ to its __linker name__.

_Example:_
~~~
/usr/lib/libfoobar.so -> libfoobar.so.1.5.3
~~~

The linker uses the following search paths to locate required shared libraries:

- directories specified by -rpath-link options (more on that later)
- directories specified by -rpath options (more on that later)
- directories specified by the environment variable `LD_RUN_PATH`
- directories specified by the environment variable `LD_LIBRARY_PATH`
- directories specified in `DT_RUNPATH` or `DT_RPATH` of a shared library are searched for shared libraries needed by it
- the default directories, normally `/lib` and `/usr/lib`
- in directories listed inthe `/etc/ld.so.conf` file

##Solving versioned shared libraries dependencies at runtime

On GNU glibc-based systems, including all Linux systems, starting up an__ELF__binary executable automatically causes the program loader to be loaded and run. 

On Linux systems, this loader is named [`/lib/ld-linux.so.X`](http://linux.die.net/man/8/ld-linux) (where X is a version number). This loader, in turn, finds and loads recursively all other shared libraries listed in the `DT_NEEDED` fields of the __ELF__ binary.

Please note that if a __soname__ was specified for a library when the executable was compiled, the loader will look for the __soname__ instead of the library real name. For that reason, installation tools automatically create symbolic names from the library __soname__ to its real name.

_Example:_
~~~
/usr/lib/libfoobar.so.1 -> libfoobar.so.1.5.3
~~~

When looking fo a specific library, if the value described in the `DT_NEEDED` doesn't contain a `/`, the loader will consecutively look in:

- directories specified at compilation time in the __ELF__ object `DT_RPATH` (deprecated),
- directories specified using the environment variable `LD_LIBRARY_PATH`,
- directories specified at compile time in the __ELF__ object `DT_RUNPATH`,
- from the cache file `/etc/ld.so.cache`, which contains a compiled list of candidate libraries previously found in the augmented library path (can be disabled at compilation time),
- in the default path `/lib`, and then `/usr/lib` (can be disabled at compilation time).

#Proper handling of secondary dependencies

As mentioned in the introduction, my issue was related to secondary dependencies, ie shared libraries dependencies that are exported from one library to a target.

Let's imagine for instance a program __main__ that depends on a library __libbar__ that itself depends on a shared library __libfoo__.

We will use either a static __libbar.a__ or a shared __libbar.so__.

_foo.c_
~~~
int foo()
{
    return 42;
}
~~~

_bar.c_
~~~
int foo();

int bar()
{
    return foo();
}
~~~

_main.c_
~~~
int bar();

int main(int argc, char** argv)
{
    return bar();
}
~~~

##Creating the libfoo.so shared library

__libfoo__ has no dependencies but the __libc__, so we can create it with the simplest command:

~~~
$ gcc -shared -o libfoo.so -fPIC foo.c
~~~

##Creating the libbar.a static library

As said before, static libraries are just archives of object files, without any means to declare external dependencies.

In our case, there is therefore no explicit connection whatsoever between libbar.a and libfoo.so.

~~~
$ gcc -c bar.c
$ ar rcs libbar.a bar.o
~~~

##Creating the libbar.so dynamic library

The proper way to create the __libbar.so__ shared library it by explicitly 
specifying it depends on __libfoo__:

~~~
$ gcc -shared -o libbar2.so -fPIC bar.c -lfoo -L$(pwd)
~~~

This will create the library with a proper `DT_NEEDED` entry for __libfoo__.

~~~
$ readelf -d libbar.so
Dynamic section at offset 0xe08 contains 25 entries:
  Tag        Type                         Name/Value
 0x0000000000000001 (NEEDED)             Shared library: [libfoo.so]
 0x0000000000000001 (NEEDED)             Shared library: [libc.so.6]
...
~~~

However, since undefined symbols are not by default resolved when building a shared library, we can also create a "dumb" version without any `DT_NEEDED` entry:

~~~
$ gcc -shared -o libbar_dumb.so -fPIC bar.c
~~~

Note that it is very unlikely that someone actually chooses to create such an incomplete library on purpose, but it may happen that by misfortune you encounter one of these beasts in binary form and still __need__ to link against it (yeah, sh... happens !).

##Creating the main executable

#Linking against the libbar.a static library

As mentioned before, when linking an executable, the linker must resolve all undefined symbols before producing the output binary.

Trying to link only with __libbar.a__ produces an error, since it has an undefined symbol and the linker has no clue where to find it:

~~~
$ gcc -o app_s main.c libbar.a
libbar.a(bar.o): In function `bar':
bar.c:(.text+0xa): undefined reference to `foo'
collect2: error: ld returned 1 exit status
~~~

Adding __libfoo.so__ to the link command solves the problem:

~~~
$ gcc -o app main.c libbar.a -L$(pwd) -lfoo
~~~

You can verify that the __app__ binary now explicitly depends on __libfoo__:

~~~
$ readelf -d app
Dynamic section at offset 0xe18 contains 25 entries:
  Tag        Type                         Name/Value
 0x0000000000000001 (NEEDED)             Shared library: [libfoo.so]
 0x0000000000000001 (NEEDED)             Shared library: [libc.so.6]
...
~~~

At run-time, the dynamic linker will look for __libfoo.so__, so unless you have installed it in standard directories (`/lib` or `/usr/lib`) you need to tell it where it is:

~~~
LD_LIBRARY_PATH=. ./app
~~~

To summarize, when linking an executable against a static library, you need to specify explicitly all its dependencies towards shared libraries on the link command.

>Note however that expressing, discovering and adding implicit static libraries dependencies is typically a feature of your build system (__autotools__, __cmake__).

##Linking against the libbar.so shared library

As specified in the [linker documentation](http://linux.die.net/man/1/ld), when the linker encounters an input shared library it processes all its `DT_NEEDED` entries as secondary dependencies:

- if the linker output is a shared relocatable __ELF__ object (ie a shared library), it will add all `DT_NEEDED` entries from the input library as new `DT_NEEDED` entries in the output,
- if the linker ouput is a non-shared, non-relocatable link (our case), it will automatically add the libraries listed in the `DT_NEEDED` of the input library on the link command line, producing an error if it can't locate them.

###Linking against the "dumb" library

When trying to link an executable against the "dumb" version of __libbar.so__, the linker encounters undefined symbols in the library itself it cannot resolve since it lacks the `DT_NEEDED` entry related to __libfoo__:

~~~
$ gcc -o app main.c -L$(pwd) -lbar_dumb
libbar_dumb.so: undefined reference to `foo'
collect2: error: ld returned 1 exit status
~~~

Just like we did when we linked against the static version, we can just add __libfoo__ to the link command to solve the problem:

~~~
$ gcc -o app main.c -L$(pwd) -lbar_dumb -lfoo
~~~

It creates an explicit dependency in the __app__ binary:

~~~
$ readelf -d app
Dynamic section at offset 0xe18 contains 25 entries:
  Tag        Type                         Name/Value
 0x0000000000000001 (NEEDED)             Shared library: [libbar_dumb.so]
 0x0000000000000001 (NEEDED)             Shared library: [libfoo.so]
 0x0000000000000001 (NEEDED)             Shared library: [libc.so.6]
...
~~~

Again, at runtime you may need to tell the dynamic linker where __libfoo.so__ is:

~~~
$ LD_LIBRARY_PATH=. ./app
~~~

There is another option you can use when dealing with the "dumb" library: tell the linker to ignore its undefined symbols altogether:

~~~
$ gcc -o app main.c -L$(pwd) -lbar_dumb -Wl,--allow-shlib-undefined
~~~

This will produce a binary that doesn't declare its hidden dependencies towards __libfoo__:

~~~
$ readelf -d app
Dynamic section at offset 0xe18 contains 25 entries:
  Tag        Type                         Name/Value
 0x0000000000000001 (NEEDED)             Shared library: [libbar_dumb.so]
 0x0000000000000001 (NEEDED)             Shared library: [libc.so.6]
...
~~~

This isn't without consequences at runtime though, since the dynamic linker is now unable to resolve the executable dependencies:

~~~
$ ./app: symbol lookup error: ./libbar_dumb.so: undefined symbol: foo
~~~

Your only option is then to load __libfoo__ explicitly (yes, this is getting uglier and uglier):

~~~
$ LD_PRELOAD=./libfoo.so LD_LIBRARY_PATH=. ./app
~~~

###Linking against the "correct" library

As mentioned before, when linking against the correct shared library, the linker encounters the __libfoo.so__ `DT_NEEDED` entry and adds it to the link command, thus solving the undefined symbols ... or at least that is what I expected:

~~~
$ gcc -o app main.c -L$(pwd) -lbar
/usr/bin/ld: warning: libfoo.so, needed by libbar.so, not found (try using -rpath or -rpath-link)
/home/diec7483/dev/linker-example/libbar.so: undefined reference to `foo'
collect2: error: ld returned 1 exit status
~~~

Why the error ? I thought I had done everything by the book !

Okay, let's take a look at the `ld` man page again, looking at the `-rpath-link` option. This says:

>When using ELF or SunOS, one shared library may require another. This happens when an "ld -shared" link includes a shared library as one of the input files.
When the linker encounters such a dependency when doing a non-shared, non-relocatable link, it will automatically try to locate the required shared library and include it in the link, if it is not included explicitly. In such a case, the -rpath-link option specifies the first set of directories to search. The -rpath-link option may specify a sequence of directory names either by specifying a list of names separated by colons, or by appearing multiple times.

Ok, this is not crystal-clear, but what it actually means is that when specifying the path for a secondary dependency, you should not use the `-L` but `-rpath-link`:

~~~
$ gcc -o app main.c -L$(pwd) -lbar -Wl,-rpath-link=$(pwd)
~~~

You can verify that __app__ depends only explicitly on __libbar__:

~~~
$ readelf -d app
Dynamic section at offset 0xe18 contains 25 entries:
  Tag        Type                         Name/Value
 0x0000000000000001 (NEEDED)             Shared library: [libbar.so]
 0x0000000000000001 (NEEDED)             Shared library: [libc.so.6]
...
~~~

And this is __finally how things should be done__.

>In extreme cases where you don't have access to secondary dependencies at build time but only at runtime, there is still the last resort option of ignoring unresolved dependencies using --allow-shlib-undefined.