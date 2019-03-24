//Load data of not present
postsCount = 0;
commentsCount = 500;

function loadData() {
  //Load Posts
  if (!localStorage.getItem("posts")) {
    console.log("POSTS ajax call made");
    jQuery.ajax({
      type: "GET",
      url: "https://jsonplaceholder.typicode.com/posts",
      success: function(response) {
        localStorage.setItem("posts", JSON.stringify(response));
      },
      error: function(error) {
        console.log("Error!", error);
      }
    });
  }
  //Load Comments
  if (!localStorage.getItem("comments")) {
    console.log("COMMENTS ajax call made");
    jQuery.ajax({
      type: "GET",
      url: "https://jsonplaceholder.typicode.com/comments",
      success: function(response) {
        var comments = response;
        comments.forEach(element => {
          element.like = false;
        });
        localStorage.setItem("comments", JSON.stringify(comments));
      },
      error: function(error) {
        console.log("Error!", error);
      }
    });
  }
  //Load Users
  if (!localStorage.getItem("users")) {
    console.log("USERS ajax call made");
    jQuery.ajax({
      type: "GET",
      url: "https://jsonplaceholder.typicode.com/users",
      success: function(response) {
        localStorage.setItem("users", JSON.stringify(response));
      },
      error: function(error) {
        console.log("Error!", error);
      }
    });
  }
}
function createPosts() {
  // Create 20 posts dynamically
  for (var i = postsCount; i < 20 + postsCount; i++) {
    // Add Title
    var title = jQuery("<h1/>", {
      text: posts[i].title
    });
    // Add Username
    var username = jQuery("<p/>", {
      text: "Created by " + users[posts[i].userId - 1].name
    });
    // Add Post body
    var body = jQuery("<p/>", {
      text: posts[i].body
    });
    // Add Show Comments buttons
    var showComments = jQuery("<button/>", {
      id: posts[i].id,
      class: "showComments",
      text: "Show Comments"
    });
    // Add add-Comment button
    var addComment = jQuery("<button/>", {
      id: posts[i].id,
      class: "addComment",
      text: "Add Comment"
    });
    // Add Delete Post
    var delPost = jQuery("<button/>", {
      id: posts[i].id,
      class: "delPost",
      text: "Delete post"
    });
    // Add post and attach elements
    var post = jQuery("<div/>", {
      id: "Post_" + posts[i].id,
      class: "div_class"
    }).append(title, username, body, showComments, addComment, delPost);
    $("body").append(post);
  }
  postsCount += 20;
}

//Load data
loadData();

$(document).ready(function() {
  //create new Elelemts on scroll
  window.onscroll = function(ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      console.log("down");
      if (postsCount < 100) createPosts();
    }
  };
  // Add new Post button
  var newPost = jQuery("<button/>", {
    class: "newpost",
    text: "New Post"
  });
  jQuery("body").append(newPost);
  // Create Posts dynamically
  setTimeout(function() {
    posts = JSON.parse(localStorage.getItem("posts"));
    comments = JSON.parse(localStorage.getItem("comments"));
    users = JSON.parse(localStorage.getItem("users"));
    createPosts();

    // New Post Click functionality
    jQuery(document).on("click", ".newpost", function(e) {
      if (!jQuery(this).siblings(".newPostDiv").length) {
        //Add title
        var title = jQuery("<input/>", {
          id: "title",
          placeholder: "Title"
        });
        // Add UserId
        var userId = jQuery("<input/>", {
          id: "userID",
          placeholder: "UserID"
        });
        // Add body
        var body = jQuery("<input/>", {
          id: "body",
          placeholder: "Body"
        });
        // Add addPost
        var addPost = jQuery("<button/>", {
          id: "addPost",
          text: "Add Post"
        });
        // Add new Post div
        var newPost = jQuery("<div/>", {
          class: "newPostDiv"
        }).append(title, userId, body, addPost);
        $("body").prepend(newPost);

        // Add-Post Click functionality
        jQuery("body").on("click", "#addPost", function(e) {
          var newPost = {
            userId: $("#userID")[0].value,
            id: posts.length,
            title: $("#title")[0].value,
            body: $("#body")[0].value
          };
          posts.push(newPost);
          localStorage.setItem("posts", JSON.stringify(posts));
          jQuery(".newPostDiv").remove();
        });
      }
    });

    // Show Comments Functionality
    jQuery(document).on("click", ".showComments", function(e) {
      if (!jQuery(this).siblings(".showCommentsDiv").length) {
        var com = comments.filter(comment => comment.postId == e.target.id);
        var CommentDiv = jQuery("<div/>", {
          id: e.target.id,
          class: "showCommentsDiv"
        }).append(comment, like, delComment);
        $("#Post_" + e.target.id).append(CommentDiv);
        for (let i = 0; i < com.length; i++) {
          var comment = jQuery("<p/>", {
            text:
              "Name: " +
              com[i].name +
              " Email: " +
              com[i].email +
              "" +
              com[i].body
          });
          var like = jQuery("<span/>", {
            class: "fa fa-heart" + (com[i].like ? "-o" : "")
          });
          // "<span class='fa fa-heart'></span>";
          var delComment = jQuery("<button/>", {
            class: "delComment",
            text: "Delete"
          });
          var eachCommentDiv = jQuery("<div/>", {
            id: com[i].id,
            class: "showComments"
          }).append(comment, like, delComment);
          jQuery(CommentDiv).append(eachCommentDiv);
        }

        //Like functionality
        jQuery("#Post_" + e.target.id).on("click", ".fa", function(e) {
          var newComment = comments.filter(
            comment => comment.id == jQuery(this).parent()[0].id
          );
          newComment[0].like = !newComment[0].like;
          jQuery(this)[0].className=(newComment[0].like?"fa fa-heart-o":"fa fa-heart");
          localStorage.setItem("comments",JSON.stringify(comments));
        });
      } else {
        jQuery(this)
          .siblings(".showCommentsDiv")
          .toggle();
      }
    });

    // Add Comment show div functionality
    jQuery(document).on("click", ".addComment", function(e) {
      if (!jQuery(this).siblings(".Add_Comment").length) {
        var name = jQuery("<input/>", {
          id: "Name_" + e.target.id,
          placeholder: "Name"
        });
        // Add Email
        var email = jQuery("<input/>", {
          id: "Email_" + e.target.id,
          placeholder: "Email"
        });
        // Add body
        var body = jQuery("<input/>", {
          id: "Body_" + e.target.id,
          placeholder: "Body"
        });
        // Add add-button
        var addingComment = jQuery("<button/>", {
          id: "Add_" + e.target.id,
          text: "Add"
        });
        // Add add-comment div
        var newComment = jQuery("<div/>", {
          id: e.target.id,
          class: "Add_Comment"
        }).append(name, email, body, addingComment);
        //Add it to the post
        $("#Post_" + e.target.id).append(newComment);
      }

      // Add Comment Click functionality
      jQuery("#Post_" + e.target.id).on(
        "click",
        "#Add_" + e.target.id,
        function(e) {
          var commentAdd = {
            postId: e.currentTarget.parentElement.id,
            id: commentsCount + 1,
            name: $("#" + e.target.id).siblings()[0].value,
            email: $("#" + e.target.id).siblings()[1].value,
            body: $("#" + e.target.id).siblings()[2].value
          };
          comments.push(commentAdd);
          localStorage.setItem("comments", JSON.stringify(comments));
          jQuery(".Add_Comment").remove();
          commentsCount++;
        }
      );
    });
    // Delete post
    jQuery(document).on("click", ".delPost", function(e) {
      posts = posts.filter(post => post.id != jQuery(this)[0].id);
      localStorage.setItem("posts", JSON.stringify(posts));
      jQuery("#" + jQuery(this).parent()[0].id).remove();
      comments = comments.filter(
        comment => comment.postId != jQuery(this)[0].id
      );
      localStorage.setItem("comments", JSON.stringify(comments));
    });
    // Delete Comment
    jQuery(document).on("click", ".delComment", function(e) {
      comments = comments.filter(
        comment => comment.id != jQuery(this).parent()[0].id
      );
      localStorage.setItem("comments", JSON.stringify(comments));
      jQuery(this)
        .parent()
        .remove();
    });
  }, 1000);
});
