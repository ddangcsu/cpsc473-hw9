// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true,
immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double,
undef: true, unused: true, strict: true, trailing: true */
/* global console: true, ko: true*/

var main = function (toDoObjects) {
    "use strict";
    console.log("SANITY CHECK");

    // Turn the toDoObject map to function
    var getToDos = function() {
        var toDos = toDoObjects.map(function (toDo) {
            // we'll just return the description
            // of this toDoObject
            return toDo.description;
        });
        return toDos;
    };

    // Turn the organizedByTags into a function return
    var organizedByTags = function () {
        var tags = [];

        toDoObjects.forEach(function (toDo) {
            toDo.tags.forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });
        var tagObjects = tags.map(function (tag) {
            var toDosWithTag = [];

            toDoObjects.forEach(function (toDo) {
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
        name: "Newest",
        contents: ko.observableArray(getToDos().reverse()),
        update: function () {
            var self = this;
            // newContent is a description string
            self.contents(getToDos().reverse());
        }
    };

    // Define a Model to handle oldest Tab
    var oldestTab = {
        name: "Oldest",
        contents: ko.observableArray(getToDos()),
        update: function () {
            var self = this;
            // newContent is a description string
            self.contents(getToDos());
        }
    };

    // Define a Model to handle tags Tab
    var tagsTab = {
        name: "Tags",
        contents: ko.observableArray(organizedByTags()),
        update: function () {
            var self = this;
            // newContent is a description string
            self.contents(organizedByTags());
        }
    };

    // Define a Model to handle newest Tab
    var addTab = {
        name: "Add",
    };

    // Define the main app model
    Model.appModel = {
        selectedTab: ko.observable(0),
        tabs: [
            newestTab, // Index 0
            oldestTab, // Index 1
            tagsTab, // Index 2
            addTab,  // Index 3
        ],
    };

    // Define a computed KO that will select the content of each tab (except)
    // add Tab to populate the content on tab selected
    Model.appModel.selectedContent = ko.pureComputed(function(){
        var self = this;
        //console.log(self.tabs());
        //console.log(self.selectedTab());
        if (self.selectedTab() === 3) {
            return null;
        } else {
            return self.tabs[self.selectedTab()].contents();
        }
    }, Model.appModel);

    // Separate model to handle the add Tab
    Model.addModel = {
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

                    toDoObjects = result;
                    newestTab.update();
                    oldestTab.update();
                    tagsTab.update();
                    self.description("");
                    self.tags("");

                    $(".tabs a:first-child span").trigger("click");
                });
                return false;
            }
            return true;
        },
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
