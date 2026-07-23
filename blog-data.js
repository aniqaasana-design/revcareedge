(function () {
  const STORAGE_KEY = 'revcare_blog_posts_v1';

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90) || 'blog-post';
  }

  function uniqueSlug(baseSlug, posts, currentId) {
    const base = slugify(baseSlug);
    let slug = base;
    let count = 2;
    while (posts.some(post => post.slug === slug && post.id !== currentId)) {
      slug = `${base}-${count}`;
      count += 1;
    }
    return slug;
  }

  function normalizePost(post, existingPosts, currentId) {
    const now = new Date().toISOString().slice(0, 10);
    const id = post.id || `post-${Date.now()}`;
    const title = String(post.title || 'Untitled Blog').trim();
    return {
      id,
      title,
      slug: uniqueSlug(post.slug || title, existingPosts || [], currentId || id),
      category: String(post.category || 'Medical Billing').trim(),
      author: String(post.author || 'RevCare Edge').trim(),
      date: post.date || now,
      excerpt: String(post.excerpt || '').trim(),
      coverImage: String(post.coverImage || '').trim(),
      body: String(post.body || '').trim(),
      updatedAt: new Date().toISOString()
    };
  }

  function seedPosts() {
    return Array.isArray(window.RevCareSeedPosts)
      ? window.RevCareSeedPosts.map((post, index) => normalizePost({ ...post, id: post.id || `seed-${index}` }, [], post.id))
      : [];
  }

  function readStoredPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      console.warn('Could not read saved blog posts.', error);
      return null;
    }
  }

  function getPosts() {
    const stored = readStoredPosts();
    const posts = stored || seedPosts();
    return posts
      .map((post, index, list) => normalizePost(post, list, post.id || `post-${index}`))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    window.dispatchEvent(new CustomEvent('revcare:blogs-updated', { detail: posts }));
  }

  function findPost(slug) {
    return getPosts().find(post => post.slug === slug) || null;
  }

  function resetToSeed() {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('revcare:blogs-updated', { detail: seedPosts() }));
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve('');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderBody(value) {
    return String(value || '')
      .split(/\n{2,}/)
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => `<p>${escapeHtml(part).replace(/\n/g, '<br>')}</p>`)
      .join('');
  }

  function formatDate(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function buildContentJs(posts) {
    return `window.RevCareSeedPosts = ${JSON.stringify(posts, null, 2)};\n`;
  }

  window.RevCareBlog = {
    STORAGE_KEY,
    slugify,
    normalizePost,
    getPosts,
    savePosts,
    findPost,
    resetToSeed,
    fileToDataUrl,
    escapeHtml,
    renderBody,
    formatDate,
    buildContentJs
  };
})();
