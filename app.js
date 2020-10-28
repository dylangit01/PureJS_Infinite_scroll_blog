const filter = document.getElementById('filter');
const number = document.querySelector('.number');
const postTitle = document.querySelector('.post-title');
const postBody = document.querySelector('.post-body');
const loader = document.querySelector('.loader');

const postsContainer = document.getElementById('post-container');

let limit = 3;
let page = 1;

const getPosts = async _ => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
  const data = await res.json();
  return data;
};

const showPosts = async _ => {
  const posts = await getPosts();

  // Method one: this method CANNOT use 'forEach()', can only use map(), because innerHTML is HTML template, not js
  // codes;

  // Updated Notice!!!, in scroll down situation, can ONLY use appendChild method
  // postsContainer.innerHTML = posts.map(post => `
  // <div class='post'>
  //   <div class="number">${post.id}</div>
  //   <div class="post-info">
  //     <h2 class="post-title">${post.title}</h2>
  //     <p class="post-body">${post.body}</p>
  //   </div>
  // </div>
  // `).join('')

  // Method two: this method can use 'forEach()', because each post has been appended to parent container
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
    <div class="number">${post.id}</div>
    <div class="post-info">
      <h2 class="post-title">${post.title}</h2>
      <p class="post-body">${post.body}</p>
    </div>
  `;
    // Have to use appendChild method to add the post
    postsContainer.appendChild(postEl)
  });
};

// set setTimeout() inside of another setTimeout() is very useful for app like this:
const showLoading = () => {
    loader.classList.add('show');
    setTimeout(_=> {
      loader.classList.remove('show');

      setTimeout(_=> {
        page++;
        showPosts();
      }, 300)
    }, 1000)
};

const filterPosts = e => {
  const searchTerm = e.target.value.toLowerCase();
  const posts = document.querySelectorAll('.post');
  // console.log(posts);

  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toLowerCase();
    const body = post.querySelector('.post-body').innerText.toLowerCase();

    if(title.includes(searchTerm) || body.includes(searchTerm) ){
      post.style.display = 'flex'
    } else post.style.display = 'none'
  });
};

showPosts();

window.addEventListener('scroll', _=> {
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
  if(scrollTop + clientHeight >= scrollHeight - .5) {
     showLoading()
  }
});

filter.addEventListener('input', filterPosts);
