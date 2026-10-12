# Alpine BNP 2027

The workshop's **single-page website**, with its original layout, colours, photography and mobile navigation. This repository is private. The existing [private one-page preview](https://alpine-bnp-2027-one-page.berahamario.chatgpt.site) remains available separately; GitHub Pages is not enabled.

## Editing the website

[Edit the page text](https://github.com/alpine-bnp/alpine-bnp.github.io/edit/main/content/page.md) · [Edit programme and practical details](https://github.com/alpine-bnp/alpine-bnp.github.io/edit/main/content/workshop.json)

- Edit [`content/page.md`](content/page.md) for headings, paragraphs, captions and navigation labels.
- Edit [`content/workshop.json`](content/workshop.json) for the programme, speaker details, organisers, registration information, hiking specifications, links and confirmed supporters.
- See [`content/README.md`](content/README.md) for the editing instructions.

On GitHub, open a content file and select the pencil icon. Change the text, choose **Commit changes**, then **Create a new branch** and **Propose changes**. A collaborator can review the pull request before it is merged. Each commit and pull request runs an automatic build and checks the page links and assets. The built website is saved as a private Actions artifact named `alpine-bnp-website` for seven days. Publishing remains a separate step: content edits do not automatically change the existing Sites preview or create a public website.

## Collaboration

Use each person’s own GitHub login. Add a collaborator through this repository’s **Settings → Collaborators and teams**, then give them **Write** access to propose edits. Review and merge their pull requests to accept changes. Organisation ownership and repository access remain under `mberaha`; no shared password is needed.

## Build and preview

The builder uses Node.js built-in libraries, with no package installation needed:

```sh
node build.mjs
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:4173/`. Rebuild and refresh after edits. Generated files are in `dist/`; edit the source files instead. The builder copies `assets/` into `dist/assets/` on every build.

For a future repository-based GitHub Pages address such as `owner.github.io/alpine-bnp-2027/`, build with its path:

```sh
BASE_PATH=/alpine-bnp-2027 node build.mjs
```

An organisation address such as `alpine-bnp.github.io` uses the default empty base path. The builder updates local asset addresses while preserving external links and page anchors. A private GitHub repository does not by itself make a GitHub Pages website private; no public Pages deployment is configured here.

## Design and credits

`build.mjs` contains the fixed layout; `assets/site.css` controls the design and `assets/site.js` controls the mobile menu. Editorial changes normally need neither file.

The two photographs are by MatthewGhera / Wikimedia Commons, used under CC BY 3.0, cropped and resized. Source and licence links remain in the website footer and `content/workshop.json`. Keep those credits when editing or moving the site.
