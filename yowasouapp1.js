// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players."

Images = new Meteor.Collection("images");

if (Meteor.is_client) {
  Template.main.images = function () {
    return Images.find({}, {});
  };

//  Template.leaderboard.selected_name = function () {
//    var player = Players.findOne(Session.get("selected_player"));
//    return player && player.name;
//  };
//
//  Template.player.selected = function () {
//    return Session.equals("selected_player", this._id) ? "selected" : '';
//  };
//
//  Template.leaderboard.events = {
//    'click input.inc': function () {
//      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
//    }
//  };
//



  Template.main.events = {
    'click button.fileupload': function () {
      handleFileSelect(document.getElementById('file_select'));
    } ,
    'click button.allclear': function () {
      if(window.confirm('OK?')){
        Images.remove({});
      }
    }
  };

  function handleFileSelect(fileobject) {
    var files = fileobject.files; // FileList object

    for (var i = 0, f; f = files[i]; i++) {
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Add databse.
          Images.insert({image_binary: e.target.result});
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }
}

// On server startup, create some players if the database is empty.
if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Images.find().count() === 0) {
      Images.insert({image_binary: "test_binary"});
    }
  });
}
