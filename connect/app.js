/*
const firebaseConfig = {
    apiKey: "AIzaSyAmIklkvQizta3qinqaXYIImYz_3yIQaCM",
    authDomain: "florb-6eb74.firebaseapp.com",
    projectId: "florb-6eb74",
    storageBucket: "florb-6eb74.appspot.com",
    messagingSenderId: "413728580900",
    appId: "1:413728580900:web:107434e2336ce858b8bfb1",
    measurementId: "G-31P0FQX4DD"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
*/
function getCookie(name) {
    const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    return cookieValue ? cookieValue.pop() : null;
}
  let nom = '';
  nom = getCookie('username');

const db = firebase.firestore();



function post() {
  if (canWrite){
    const title = document.getElementById('inputtitle').value.trim();
    const text = document.getElementById('inputtext').value.trim();
    let image = null;
    savePostData(title, text, image);
  }
  else{
    alert('Post writing is disabled temporarily. Come back in 5 hours.');
  }
}

//save function
  function savePostData(title, text, image) {
    // Validate that title and text are not empty
    if (title === "" || text === "") {
      alert("Please enter both title and text for your post.");
      return;
    }
    // Prepare the post data object
    const postData = {
      title: title,
      text: text,
      author: nom,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
      // Add any other fields you want to store in Firestore
    };
    // Add the post data to the "Posts" collection using Firestore's .add() method
    db.collection("Posts")
      .add(postData)
      .then((docRef) => {
        console.log("Post data saved successfully! Document ID:", docRef.id);
        // Clear the form inputs
        document.querySelector('.thought').value = "";
        document.querySelector('textarea.thought').value = "";
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error saving post data:", error);
      });
    console.log("Post Data:", postData);
    document.getElementById('inputtitle').value = "";
    document.getElementById('inputtext').value = "";
    document.getElementById('file').value = "";
    const actualBtn = document.getElementById('file');
    const fileChosen = document.getElementById('file-chosen');
    actualBtn.addEventListener('change', function(){
    fileChosen.textContent = this.files.length > 0 ? this.files[0].name : '* Not required';
    });
  }
//display

function displayPosts(posts) {
  if (canRead) {
    const postContainer = document.getElementById('posts');
    postContainer.innerHTML = ''; // Clear existing posts

    // Loop through the posts and create HTML elements for each post
    posts.forEach((post) => {
      const postDiv = document.createElement('div');
      postDiv.classList.add('post'); // Add the 'post' class to each post

      // Create the post title element
      const titleElement = document.createElement('p');
      titleElement.textContent = post.title;
      titleElement.classList.add('post-title');

      // Create the post author element
      const authorElement = document.createElement('span');
      authorElement.textContent = `-${post.author}`;
      authorElement.classList.add('author');

      // Create the post text element
      const textElement = document.createElement('pre');
      textElement.textContent = post.text;
      textElement.classList.add('post-text');

      // Check if the link contains any video extensions
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
      const link = post.image || ''; // Ensure link is not null or undefined
      const isVideo = videoExtensions.some((ext) => link.toLowerCase().includes(ext));

      // Create the post image or video element if available
      if (isVideo) {
        const videoElement = document.createElement('video');
        videoElement.src = link;
        videoElement.classList.add('post-video');
        videoElement.id = 'postVideo';
        videoElement.controls = true; // Add controls for video playback (optional)

        // Append the video after the text
        postDiv.appendChild(titleElement);
        postDiv.appendChild(authorElement);
        postDiv.appendChild(document.createElement('br'));
        postDiv.appendChild(textElement);
        postDiv.appendChild(document.createElement('br'));
        postDiv.appendChild(videoElement);
      } else if (link) {
        // Assume it's an image if it's not a video and link exists
        const imageElement = document.createElement('img');
        imageElement.src = link;
        imageElement.classList.add('post-image');

        // Append the image after the text
        postDiv.appendChild(titleElement);
        postDiv.appendChild(authorElement);
        postDiv.appendChild(document.createElement('br'));
        postDiv.appendChild(textElement);
        postDiv.appendChild(document.createElement('br'));
        postDiv.appendChild(imageElement);
      } else {
        // If no image or video, just append the elements in the regular order
        postDiv.appendChild(titleElement);
        postDiv.appendChild(authorElement);
        postDiv.appendChild(document.createElement('br'));
        postDiv.appendChild(textElement);
      }

      // Add the postDiv to the post container
      postContainer.appendChild(postDiv);
    });
  }
}



// Fetch the post data from Firebase
const postsRef = db.collection('Posts');

// Add an orderBy clause to order the posts by the 'timestamp' field
postsRef.orderBy('timestamp', 'desc')
  .get()
  .then((querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      posts.push(post);
    });

    // Display the posts on the page
    displayPosts(posts);
  })
  .catch((error) => {
    console.error('Error fetching posts:', error);
  });

  const currentuserspan = document.querySelector('.currentuser');
  currentuserspan.textContent = " " + nom + "?";

//cookies :D
function setCookie(name, value, daysToExpire) {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
  const expires = "expires=" + expirationDate.toUTCString();
  document.cookie = name + "=" + value + "; " + expires;
}