// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true,
immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double,
undef: true, unused: true, strict: true, trailing: true */
/* global console: true, ko: true*/

var main = function (toDoObjects) {
    "use strict";
    console.log("SANITY CHECK");

    // Turn the toDoObject map to function
    var getToDos = function(objects) {
        var toDos = objects.map(function (toDo) {
            // we'll just return the description
            // of this toDoObject
            return toDo.description;
        });
        return toDos;
    };

    // Turn the organizedByTags into a function return
    var organizedByTags = function (objects) {
        var tags = [];

        objects.forEach(function (toDo) {
            toDo.tags.forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });
        var tagObjects = tags.map(function (tag) {
            var toDosWithTag = [];

            objects.forEach(function (toDo) {
                if (toDo.tags.indexOf(tag) !== -1) {
                    toDosWithTag.push(toDo.description);
                }
            });

            return { "name": tag, "toDos": toDosWithTag };
        });

        return tagObjects;
    };

    // Define KO Model
    var Model = {};

    // Define a Model to handle newest Tab
    var newestTab = {
        contents: ko.observableArray(getToDos(toDoObjects).reverse()),
        update: function (newToDo) {
            var self = this;
            self.contents.unshift(newToDo.description);
        }
    };

    // Define a Model to handle oldest Tab
    var oldestTab = {
        contents: ko.observableArray(getToDos(toDoObjects)),
        update: function (newToDo) {
            var self = this;
            self.contents.push(newToDo.description);
        }
    };

    // Define a Model to handle tags Tab
    var tagsTab = {
        contents: ko.observableArray(organizedByTags(toDoObjects)),
        update: function () {
            var self = this;
            // Since it's more complicated to add an organized by tags objects
            // we just refresh the entire contents
            self.contents(organizedByTags(toDoObjects));
        }
    };

    // Separate model to handle the add Tab
    var addTab = {
        description: ko.observable(),
        tags: ko.observable(),

        // Function click to add
        add: function () {
            var self = this;
            if (self.description() && self.tags()) {
                var description = self.description(),
                    tags = self.tags().split(","),
                    newToDo = {"description":description, "tags":tags};

                $.post("todos", newToDo, function (result) {
                    console.log(result);
                    // Update the list of ToDoObjects
                    toDoObjects.push(newToDo);

                    // Update all the 3 models to reflect the changes
                    newestTab.update(newToDo);
                    oldestTab.update(newToDo);
                    tagsTab.update();

                    // Clear the data in the add Model
                    self.description("");
                    self.tags("");

                    // Redirect to first tab
                    $(".tabs a:first-child span").trigger("click");
                });
                return false;
            }
            return true;
        },
    };

    // Define the main app model
    Model.appModel = {
        selectedTab: ko.observable(0),
        tabs: ["Newest", "Oldest", "Tags", "Add"],
        // Linking all the sub Models to this main model
        newestTab: newestTab,
        oldestTab: oldestTab,
        tagsTab: tagsTab,
        addTab: addTab,
    };

    //ko.applyBindings(appModel);
    ko.applyBindings(Model);

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            var index;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");

            if ($element.parent().is(":nth-child(1)")) {
                index = 0;

            } else if ($element.parent().is(":nth-child(2)")) {
                index = 1;

            } else if ($element.parent().is(":nth-child(3)")) {
                index = 2;

            } else if ($element.parent().is(":nth-child(4)")) {
                index = 3;
            }
            Model.appModel.selectedTab(index);
            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(function () {
    "use strict";
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});
