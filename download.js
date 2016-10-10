
var links = [].slice.apply(document.getElementsByTagName('a'));
    links = links.map(function(element) {
        var href = element.title;
        var hashIndex = href.indexOf('下载');
        if (hashIndex >= 0) {
            element.click();
        }
    });


