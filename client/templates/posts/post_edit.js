Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});


Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post_id = this._id,
        postProperties = {
      url: $(e.target).find('#url').val(),
      title: $(e.target).find('#title').val(),
      id: post_id
    };

    var errors = validatePost(postProperties);
    if (errors.title || errors.url){
      return Session.set('postEditErrors', errors);
    }

    Meteor.call('postEdit', postProperties, function(error, result) {
      if (error){
        return throwError(error.reason);
      }
      if (result.postExists){
        throwError('This link has already been posted');
      }
      Router.go('postPage', {_id: result.id})
    });

  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('home');
    }
  }
});
