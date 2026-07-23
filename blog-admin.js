(function () {
  if (!window.RevCareBlog) return;

  const form = document.getElementById('blogAdminForm');
  const list = document.getElementById('adminPostList');
  const status = document.getElementById('adminStatus');
  const imageInput = document.getElementById('coverImageFile');
  const imagePreview = document.getElementById('coverImagePreview');
  const coverImageValue = document.getElementById('coverImageValue');
  const resetButton = document.getElementById('resetBlogForm');
  const exportButton = document.getElementById('exportBlogData');
  const importInput = document.getElementById('importBlogData');
  const seedButton = document.getElementById('resetSeedPosts');
  const githubForm = document.getElementById('githubPublishForm');

  if (!form || !list) return;

  function setStatus(message, type) {
    status.textContent = message;
    status.className = `admin-status ${type || 'info'}`;
  }

  function fields() {
    return {
      id: document.getElementById('postId'),
      title: document.getElementById('postTitle'),
      slug: document.getElementById('postSlug'),
      category: document.getElementById('postCategory'),
      author: document.getElementById('postAuthor'),
      date: document.getElementById('postDate'),
      excerpt: document.getElementById('postExcerpt'),
      body: document.getElementById('postBody')
    };
  }

  function clearForm() {
    form.reset();
    const f = fields();
    f.id.value = '';
    f.date.value = new Date().toISOString().slice(0, 10);
    f.author.value = 'RevCare Edge';
    coverImageValue.value = '';
    imagePreview.innerHTML = '<iconify-icon icon="fa6-solid:image"></iconify-icon><span>No image selected</span>';
    setStatus('Ready to add a new blog post.', 'info');
  }

  function renderList() {
    const posts = window.RevCareBlog.getPosts();
    list.innerHTML = posts.map(post => `
      <article class="admin-post-row">
        <div>
          <span>${window.RevCareBlog.escapeHtml(post.category)} - ${window.RevCareBlog.formatDate(post.date)}</span>
          <h3>${window.RevCareBlog.escapeHtml(post.title)}</h3>
          <p>${window.RevCareBlog.escapeHtml(post.excerpt)}</p>
        </div>
        <div class="admin-row-actions">
          <a href="blog-post.html?slug=${encodeURIComponent(post.slug)}" target="_blank" rel="noopener">View</a>
          <button type="button" data-edit="${post.id}">Edit</button>
          <button type="button" data-delete="${post.id}">Delete</button>
        </div>
      </article>
    `).join('');
  }

  function editPost(id) {
    const post = window.RevCareBlog.getPosts().find(item => item.id === id);
    if (!post) return;
    const f = fields();
    f.id.value = post.id;
    f.title.value = post.title;
    f.slug.value = post.slug;
    f.category.value = post.category;
    f.author.value = post.author;
    f.date.value = post.date;
    f.excerpt.value = post.excerpt;
    f.body.value = post.body;
    coverImageValue.value = post.coverImage || '';
    imagePreview.innerHTML = post.coverImage
      ? `<img src="${window.RevCareBlog.escapeHtml(post.coverImage)}" alt="">`
      : '<iconify-icon icon="fa6-solid:image"></iconify-icon><span>No image selected</span>';
    setStatus('Editing existing post. Save when you are done.', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deletePost(id) {
    const posts = window.RevCareBlog.getPosts();
    const post = posts.find(item => item.id === id);
    if (!post) return;
    if (!confirm(`Delete "${post.title}"?`)) return;
    window.RevCareBlog.savePosts(posts.filter(item => item.id !== id));
    clearForm();
    renderList();
    setStatus('Blog post deleted.', 'success');
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const f = fields();
    const posts = window.RevCareBlog.getPosts();
    const currentId = f.id.value || '';
    const nextPost = window.RevCareBlog.normalizePost({
      id: currentId || `post-${Date.now()}`,
      title: f.title.value,
      slug: f.slug.value,
      category: f.category.value,
      author: f.author.value,
      date: f.date.value,
      excerpt: f.excerpt.value,
      coverImage: coverImageValue.value,
      body: f.body.value
    }, posts, currentId);

    const nextPosts = currentId
      ? posts.map(post => post.id === currentId ? nextPost : post)
      : [nextPost, ...posts];

    window.RevCareBlog.savePosts(nextPosts);
    clearForm();
    renderList();
    setStatus('Blog post saved. Open Blog Page to preview it.', 'success');
  });

  form.addEventListener('input', (event) => {
    const f = fields();
    if (event.target === f.title && !f.id.value) {
      f.slug.value = window.RevCareBlog.slugify(f.title.value);
    }
  });

  imageInput.addEventListener('change', async () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('Please select a valid image file.', 'error');
      return;
    }
    const dataUrl = await window.RevCareBlog.fileToDataUrl(file);
    coverImageValue.value = dataUrl;
    imagePreview.innerHTML = `<img src="${dataUrl}" alt="">`;
    setStatus('Image added to this blog draft.', 'success');
  });

  list.addEventListener('click', (event) => {
    const editId = event.target.getAttribute('data-edit');
    const deleteId = event.target.getAttribute('data-delete');
    if (editId) editPost(editId);
    if (deleteId) deletePost(deleteId);
  });

  resetButton.addEventListener('click', clearForm);

  exportButton.addEventListener('click', () => {
    const content = window.RevCareBlog.buildContentJs(window.RevCareBlog.getPosts());
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blog-content.js';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('blog-content.js exported.', 'success');
  });

  importInput.addEventListener('change', async () => {
    const file = importInput.files && importInput.files[0];
    if (!file) return;
    const text = await file.text();
    const match = text.match(/window\.RevCareSeedPosts\s*=\s*(\[[\s\S]*\]);?\s*$/);
    if (!match) {
      setStatus('Import failed. Please choose an exported blog-content.js file.', 'error');
      return;
    }
    try {
      const imported = JSON.parse(match[1]);
      window.RevCareBlog.savePosts(imported);
      renderList();
      clearForm();
      setStatus('Imported blog posts successfully.', 'success');
    } catch (error) {
      setStatus('Import failed because the file content is invalid.', 'error');
    }
  });

  seedButton.addEventListener('click', () => {
    if (!confirm('Reset all saved posts back to the starter content?')) return;
    window.RevCareBlog.resetToSeed();
    clearForm();
    renderList();
    setStatus('Starter blog content restored.', 'success');
  });

  githubForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const owner = document.getElementById('githubOwner').value.trim();
    const repo = document.getElementById('githubRepo').value.trim();
    const branch = document.getElementById('githubBranch').value.trim() || 'main';
    const token = document.getElementById('githubToken').value.trim();
    const path = document.getElementById('githubPath').value.trim() || 'blog-content.js';
    if (!owner || !repo || !token) {
      setStatus('Add GitHub owner, repo, and token before publishing.', 'error');
      return;
    }

    setStatus('Publishing blog-content.js to GitHub...', 'info');
    try {
      const encodedPath = path.split('/').map(part => encodeURIComponent(part)).join('/');
      const api = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}`;
      const getResponse = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
      });
      const existing = getResponse.ok ? await getResponse.json() : null;
      const content = window.RevCareBlog.buildContentJs(window.RevCareBlog.getPosts());
      const encoded = btoa(unescape(encodeURIComponent(content)));
      const payload = {
        message: 'Update blog content from RevCare admin',
        content: encoded,
        branch
      };
      if (existing && existing.sha) payload.sha = existing.sha;

      const putResponse = await fetch(api, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!putResponse.ok) throw new Error(`GitHub returned ${putResponse.status}`);
      setStatus('Published to GitHub. Your host can redeploy from the repo.', 'success');
    } catch (error) {
      setStatus(`GitHub publish failed: ${error.message}`, 'error');
    }
  });

  clearForm();
  renderList();
})();
