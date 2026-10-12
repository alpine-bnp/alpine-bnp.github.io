# Editing the content

## Website text: page.md

Open `page.md` on GitHub and select the pencil icon. Every block has a label such as:

```md
## about-introduction

Three days of scientific exchange focused on Bayesian nonparametrics, while enjoying the Italian Alps.
```

Change the sentence beneath the label. Keep each `## label` exactly as written, and keep every block non-empty. Labels identify where text belongs in the existing layout. The build stops with an explanation if a label is missing, duplicated, mistyped or empty.

These are plain-text blocks stored in a Markdown file for readability. Extra lines within a block are joined into one paragraph. Most Markdown formatting and HTML tags are displayed as literal text. The `about-paragraph-one` block also accepts links in the form `[link text](https://example.org/)`.

The file includes the page title and description, navigation labels, main text, image descriptions, footer and notices shown when details are pending. Some values, including the dates and workshop name, appear in several blocks; update each relevant occurrence if those details change.

## Programme and practical details: workshop.json

The sections are:

- `days`: each day's date and events. Edit each event's `period` and `title` to change the visible programme. The compact schedule does not show descriptions or speaker details.
- `registration`: the fee appears as `TBD` while `fee` is `null`. The other stored registration fields are not displayed in the current layout; the notice in `page.md` says registration is not open yet.
- `hiking`: distance, elevation gain, hiking time, difficulty, footwear and equipment.
- `organisers`: name, optional committee role, institution, photo and personal webpage.
- `contactEmail` and `abstractsUrl`: the official contact address and book of abstracts.
- `supporters`: only entries with `confirmed: true` appear as supporters.
- `photographs`: attribution and licence information; retain these credits.

Replace `null` only when a detail has been confirmed. Text and links go inside double quotes, for example `"name": "Confirmed organiser name"`. Keep JSON commas, brackets and quotation marks in place. Leave unconfirmed details as `null` and supporters as `false`. The build catches invalid JSON; the website shows existing provisional notices until details are supplied.

Add optional profile photographs or authorised logos to `assets/`, and use a path such as `/assets/organiser.jpg`. Abstract and personal webpage links must begin with `https://` or `http://`.

Keep the hiking requirement, shared rooms and shared facilities clear. Outdoor plans and unconfirmed arrangements should retain their provisional wording. Do not add unconfirmed speakers, affiliations, prices, deadlines, routes, email addresses or endorsements.

## Review changes together

After editing, select **Commit changes**, give the change a short description and choose **Create a new branch** / **Propose changes**. Open a pull request so the other organiser can review the wording. Merge it when agreed; the configured build then checks the content and rebuilds the site. Hosting can be connected later without changing this editing workflow.
