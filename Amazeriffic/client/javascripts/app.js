var main = function (toDoObjects) {
    "use strict";
    console.log("SANITY CHECK");
    var getToDos = function() {
        var toDos = toDoObjects.map(function (toDo) {
            // we'll just return the description
            // of this toDoObject
            return toDo.description;
        });
        return toDos;
    };

    // Define KO Model
    var Model = {};

    Model.newestModel = {
        visible: ko.observable(false),
        newest: ko.observableArray(getToDos()).reverse(),
    };

    Model.oldestModel = {
        visible: ko.observable(false),
        oldest: ko.observableArray(getToDos()),
    };

    Model.tagsModel = {
        visible: ko.observable(false),
    };

    Model.addModel = {
        visible: ko.observable(false),
        description: ko.observable(),
        tags: ko.observable(),

        // Function click to add
        add: function () {
            var self = this;
            var description = self.description(),
                tags = self.tags.split(","),
                newToDo = {"description":description, "tags":tags};

            $.post("todos", newToDo, function (result) {
                console.log(result);

                //toDoObjects.push(newToDo);
                toDoObjects = result;

                // update toDos
                toDos = toDoObjects.map(function (toDo) {
                    return toDo.description;
                });

                self.description("");
                self.tags("");
            });
        },
    };


    ko.applyBindings(Model);

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            var $content,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            //$("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                // $content = $("<ul>");
                // for (i = toDos.length-1; i >= 0; i--) {
                //     $content.append($("<li>").text(toDos[i]));
                // }
                Model.newestModel.visible(true);
                Model.oldestModel.visible(false);
                Model.tagsModel.visible(false);
                Model.addModel.visible(false);

            } else if ($element.parent().is(":nth-child(2)")) {
                // $content = $("<ul>");
                // toDos.forEach(function (todo) {
                //     $content.append($("<li>").text(todo));
                // });
                Model.newestModel.visible(false);
                Model.oldestModel.visible(true);
                Model.tagsModel.visible(false);
                Model.addModel.visible(false);

            } else if ($element.parent().is(":nth-child(3)")) {
                Model.newestModel.visible(false);
                Model.oldestModel.visible(false);
                Model.tagsModel.visible(true);
                Model.addModel.visible(false);

                // var tags = [];
                //
                // toDoObjects.forEach(function (toDo) {
                //     toDo.tags.forEach(function (tag) {
                //         if (tags.indexOf(tag) === -1) {
                //             tags.push(tag);
                //         }
                //     });
                // });
                // console.log(tags);
                //
                // var tagObjects = tags.map(function (tag) {
                //     var toDosWithTag = [];
                //
                //     toDoObjects.forEach(function (toDo) {
                //         if (toDo.tags.indexOf(tag) !== -1) {
                //             toDosWithTag.push(toDo.description);
                //         }
                //     });
                //
                //     return { "name": tag, "toDos": toDosWithTag };
                // });
                //
                // console.log(tagObjects);
                //
                // tagObjects.forEach(function (tag) {
                //     var $tagName = $("<h3>").text(tag.name),
                //         $content = $("<ul>");
                //
                //
                //     tag.toDos.forEach(function (description) {
                //         var $li = $("<li>").text(description);
                //         $content.append($li);
                //     });
                //
                //     $("main .content").append($tagName);
                //     $("main .content").append($content);
                // });

            } else if ($element.parent().is(":nth-child(4)")) {
                Model.newestModel.visible(false);
                Model.oldestModel.visible(false);
                Model.tagsModel.visible(false);
                Model.addModel.visible(true);
                // var $input = $("<input>").addClass("description"),
                //     $inputLabel = $("<p>").text("Description: "),
                //     $tagInput = $("<input>").addClass("tags"),
                //     $tagLabel = $("<p>").text("Tags: "),
                //     $button = $("<span>").text("+");
                //
                // $button.on("click", function () {
                //     var description = $input.val(),
                //         tags = $tagInput.val().split(","),
                //         newToDo = {"description":description, "tags":tags};
                //
                //     $.post("todos", newToDo, function (result) {
                //         console.log(result);
                //
                //         //toDoObjects.push(newToDo);
                //         toDoObjects = result;
                //
                //         // update toDos
                //         toDos = toDoObjects.map(function (toDo) {
                //             return toDo.description;
                //         });
                //
                //         $input.val("");
                //         $tagInput.val("");
                //     });
                // });
                //
                // $content = $("<div>").append($inputLabel)
                //                      .append($input)
                //                      .append($tagLabel)
                //                      .append($tagInput)
                //                      .append($button);
            }

            //$("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});
