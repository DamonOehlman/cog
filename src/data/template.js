var parseTemplate = exports.parseTemplate = function(templateHtml, data) {
    // look for template variables in the html
    var matches = REGEX_TEMPLATE_VAR.exec(templateHtml);
    while (matches) {
        // remove the variable from the text
        templateHtml = templateHtml.replace(matches[0], XPath.first(matches[1], data));

        // find the next match
        REGEX_TEMPLATE_VAR.lastIndex = 0;
        matches = REGEX_TEMPLATE_VAR.exec(templateHtml);
    } // while

    return templateHtml;
};