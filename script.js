// Minimal client-side blog loader.
// Expects posts/index.json to exist and markdown files in posts/ folder.
// Uses marked (https://github.com/markedjs/marked) loaded from CDN (marked is already included in index.html).

const postsListEl = document.getElementById('posts-list');
const postTitleEl = document.getElementById('post-title');
const postMetaEl = document.getElementById('post-meta');
const postBodyEl = document.getElementById('post-body');

let postsIndex = [];

async function loadIndex() {
  try {
    const res = await fetch('posts/index.json', {cache: "no-cache"});
    if (!res.ok) throw new Error('Failed to load posts index');
    postsIndex = await res.json();
    renderList();
    // After list loaded, try to load post from hash or first post
    const slugFromHash = getSlugFromHash();
    if (slugFromHash) {
      loadPostBySlug(slugFromHash);
    } else if (postsIndex.length) {
      loadPostBySlug(postsIndex[0].slug);
      // set hash for shareable URL
      history.replaceState(null, '', '#/post/' + postsIndex[0].slug);
    }
  } catch (err) {
    postsListEl.innerHTML = '<li>Could not load posts.</li>';
    console.error(err);
  }
}

function renderList(){
  postsListEl.innerHTML = '';
  postsIndex.forEach(post => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#/post/' + post.slug;
    a.innerHTML = `<strong class="post-title-small">${escapeHtml(post.title)}</strong><div class="post-date">${escapeHtml(post.date)}</div><div class="post-excerpt" style="font-size:13px;color:#666">${escapeHtml(post.excerpt || '')}</div>`;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadPostBySlug(post.slug);
      history.pushState(null, '', '#/post/' + post.slug);
    })
    li.appendChild(a);
    postsListEl.appendChild(li);
  })
}

function getSlugFromHash(){
  const h = location.hash || '';
  const m = h.match(/^#\/post\/(.+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function loadPostBySlug(slug){
  const postMeta = postsIndex.find(p => p.slug === slug);
  if (!postMeta) {
    postTitleEl.textContent = 'Post not found';
    postMetaEl.textContent = '';
    postBodyEl.innerHTML = '<p>Sorry, post not found.</p>';
    return;
  }
  postTitleEl.textContent = postMeta.title;
  postMetaEl.textContent = `${postMeta.date}`;
  try {
    const res = await fetch('posts/' + postMeta.filename, {cache: "no-cache"});
    if (!res.ok) throw new Error('Failed to fetch post');
    const md = await res.text();
    // Use marked (loaded in index.html) to parse markdown
    postBodyEl.innerHTML = marked.parse(md);
    // scroll content to top
    postBodyEl.scrollTop = 0;
  } catch (err) {
    postBodyEl.innerHTML = '<p>Could not load post content.</p>';
    console.error(err);
  }
}

// small helper
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

// handle back/forward and direct-hash navigation
window.addEventListener('hashchange', () => {
  const slug = getSlugFromHash();
  if (slug) loadPostBySlug(slug);
});

loadIndex();