// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

(function (mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror/lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror/lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    'use strict';

    var Pos = CodeMirror.Pos, cmpPos = CodeMirror.cmpPos;

    function isArray(val) { return Object.prototype.toString.call(val) == "[object Array]" }

    function match(string, word) {
        var len = string.length;
        var sub = getText(word).substr(0, len);
        return string.toUpperCase() === sub.toUpperCase();
    }

    function getText(item) {
        return typeof item == "string" ? item : item.text;
    }

    function words (str) {
        var obj = {},
            words = str.split(' ')
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true
        return obj
    }

    function addMatches(result, search, wordlist, formatter) {
        if (isArray(wordlist)) {
            for (var i = 0; i < wordlist.length; i++)
                if (match(search, wordlist[i])) result.push(formatter(wordlist[i]))
        } else {
            for (var word in wordlist) if (wordlist.hasOwnProperty(word)) {
                var val = wordlist[word]
                if (!val || val === true)
                    val = word
                else
                    val = val.displayText ? {text: val.text, displayText: val.displayText} : val.text
                if (match(search, val)) result.push(formatter(val))
            }
        }
    }

    CodeMirror.registerHelper("hint", "groovy", function (editor, options) {
        var disableKeywords = options && options.disableKeywords;
        var keywords = words(
            "abstract as assert boolean break byte case catch char class const continue def default " +
            "do double else enum extends final finally float for goto if implements import in " +
            "instanceof int interface long native new package private protected public return " +
            "short static strictfp super switch synchronized threadsafe throw throws trait transient " +
            "try void volatile while null true false this");

        var cur = editor.getCursor();
        var result = [];
        var token = editor.getTokenAt(cur), start, end, search;
        if (token.end > cur.ch) {
            token.end = cur.ch;
            token.string = token.string.slice(0, cur.ch - token.start);
        }

        if (token.string.match(/^[.`"'\w@][\w$#]*$/g)) {
            search = token.string;
            start = token.start;
            end = token.end;
        } else {
            start = end = cur.ch;
            search = "";
        }

        var objectOrClass = function (w, className) {
            if (typeof w === "object") {
                w.className = className;
            } else {
                w = {text: w, className: className};
            }
            return w;
        };

        if (!disableKeywords)
            addMatches(result, search, keywords, function (w) {
                return objectOrClass(w, "CodeMirror-hint-keyword");
            });

        return {list: result, from: Pos(cur.line, start), to: Pos(cur.line, end)};
    });
});
