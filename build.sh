MINIFY=$1
CLOSURE_COMPILER="/development/tools/javascript/closure/compiler.jar"

: ${MINIFY:=false}

for variant in cog loopage observable configurable jsonp tween
do
    echo "Building COG: $variant"
    
    # sprocketize the source
    sprocketize $SPROCKET_OPTS src/$variant.js > dist/$variant.js

    # minify
    if $MINIFY; then
        java -jar $CLOSURE_COMPILER \
             --compilation_level SIMPLE_OPTIMIZATIONS \
             --js_output_file dist/$variant.min.js \
             --js dist/$variant.js
    fi;
done;