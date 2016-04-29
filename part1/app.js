var main = function () {
    "use strict";

    // Var initial array of items from index.html-
    var initComment = [
        "This is the first comment!",
        "Here's the second one!",
        "And this is one more.",
        "Here is another one!"
    ];

    // Define a KO Comment Model
    var commentModel = {
        commentInput: ko.observable(),
        comments: ko.observableArray(initComment),

    };

    var addCommentFromInputBox = function () {
        var $new_comment;

        if ($(".comment-input input").val() !== "") {
            $new_comment = $("<p>").text($(".comment-input input").val());
            $new_comment.hide();
            $(".comments").append($new_comment);
            $new_comment.fadeIn();
            $(".comment-input input").val("");
        }
    };

    $(".comment-input button").on("click", function (event) {
        addCommentFromInputBox();
    });

    $(".comment-input input").on("keypress", function (event) {
        if (event.keyCode === 13) {
            addCommentFromInputBox();
        }
    });

    ko.applyBindings(commentModel);
};

$(document).ready(main);
