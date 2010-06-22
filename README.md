GRUNT is a set of core javascript tools that anyone who is writing a javascript library will probably find themselves needing.  I love jQuery, but when writing a library it is pretty much insane to assume that you are going to have a particular version of a library available and that fact caused me some hassle.  As such I have created GRUNT as a core suite of javascript functions that are useful when creating modular javascript libraries.  There are some things that have come across from jQuery (such as extend) and others that have been written from the ground up (the XHR implementation).  The library has been released under the MIT licence and I would like to say a big thanks to John Resig and the jQuery team for releasing their code under a licence that permits the creation of derivative works like this one.

Please note that *GRUNT* is very much a _work in progress_ and while it has been very useful to me in building SLICK [http://github.com/sidelab/slick] it is far from finished.  If you would like to use it in your own project, please feel free.  In terms of integration I use the following for integrating into the build.xml for a project (obviously ant is required).

<available property="grunt" file="lib/grunt" />

<target name="grunt-clone" unless="grunt">
	<exec executable="git" outputproperty="git-grunt" >  
		<arg line="clone git://github.com/sidelab/grunt.git lib/grunt"/>  
	</exec>
	<echo message="git clone grunt: ${git-grunt}" />
</target>

<target name="grunt-pull" if="qunit">
	<exec executable="git" outputproperty="git-grunt" dir="lib/grunt" >  
		<arg line="pull origin master"/>  
	</exec> 
	<echo message="git pull grunt: ${git-grunt}" />
</target>

<target name="grunt-build" depends="grunt-clone,grunt-pull">
	<ant dir="lib/grunt" />
</target>

You can then use the <concat> ant task to combine grunt into your library.