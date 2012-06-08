function cog(feature) {
    // if the feature is defined the 
    if (typeof cog[feature] != 'undefined') {
        return cog[feature];
    }

    // if we are running in node then patch in the requested feature
    if (typeof module != 'undefined' && typeof require == 'function') {
    }
}