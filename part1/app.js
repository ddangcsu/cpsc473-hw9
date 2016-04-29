// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true,
immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double,
undef: true, unused: true, strict: true, trailing: true */
/* global ko:true */

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

        // Function to add comments
        addComment: function () {
            var self = this;
            if (self.commentInput() !== "") {
                // Add to comments list and clear the input
                self.comments.push(self.commentInput());
                self.commentInput("");
                return false;
            }
            return true;
        },

        // Add function to handle enter keypress to add comment
        enterToAdd: function (data, event) {
            var self = this;
            if (event.keyCode === 13) {
                self.addComment();
                return false;
            }
            return true;
        }
    };

    // var addCommentFromInputBox = function () {
    //     var $new_comment;
    //
    //     if ($(".comment-input input").val() !== "") {
    //         $new_comment = $("<p>").text($(".comment-input input").val());
    //         $new_comment.hide();
    //         $(".comments").append($new_comment);
    //         $new_comment.fadeIn();
    //         $(".comment-input input").val("");
    //     }
    // };

    // $(".comment-input button").on("click", function (event) {
    //     addCommentFromInputBox();
    // });

    // $(".comment-input input").on("keypress", function (event) {
    //     if (event.keyCode === 13) {
    //         addCommentFromInputBox();
    //     }
    // });

    ko.applyBindings(commentModel);
};

$(document).ready(main);
