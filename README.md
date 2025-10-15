# Minimalist GitHub Pages Blog

This repository contains a minimalist static blog that reads posts from Markdown files.

How it works:
- posts/index.json contains a list of posts (slug, title, date, excerpt, filename).
- Each post file is stored in posts/{filename}.md (plain markdown).
- index.html and script.js fetch posts/index.json, render the list, and fetch & render the markdown for a selected post (uses marked.js).

To publish on GitHub Pages:
1. Create a repository on GitHub and push these files to the main branch (or whichever branch you host from).
2. In the repository Settings → Pages, select the branch (e.g., main) and folder (root).
3. Save. Your site will be available at https://<your-username>.github.io/<repo-name>/ (or at your custom domain if configured).

To add a new post:
1. Add a new Markdown file to the posts/ folder, e.g. `my-post.md`.
2. Add a new entry to `posts/index.json` with:
   - slug: used in the URL/hash (e.g., "my-post")
   - title
   - date (ISO-ish string, e.g., "2025-10-15")
   - excerpt (short string for the list)
   - filename: the markdown filename, e.g. "my-post.md"

Limitations & notes:
- This is intentionally minimal and has no build step. The posts index must be updated manually (or by your own script).
- If you want automatic index generation, add a small script that scans posts/ and generates posts/index.json at commit time or via GitHub Actions.
- Uses marked.js from CDN; you can vendor it locally if you prefer.

Enjoy!