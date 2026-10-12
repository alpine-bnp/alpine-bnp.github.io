# Editing the content

## Website text: page.md

Open `page.md` on GitHub and select the pencil icon. Every block has a label such as:

```md
## about-introduction

Three days of scientific exchange, hiking and time together in the mountains.
```

Change the sentence beneath the label. Keep each `## label` exactly as written, and keep every block non-empty. Labels identify where text belongs in the existing layout. The build stops with an explanation if a label is missing, duplicated, mistyped or empty.

These are plain-text blocks stored in a Markdown file for readability. The website keeps its existing paragraph layout, emphasis and line breaks. Extra lines within a block are joined into one sentence; Markdown formatting and HTML tags are displayed as literal text.

The file includes the page title and description, navigation labels, main text, image descriptions, footer and notices shown when details are pending. Some values, including the dates and workshop name, appear in several blocks; update each relevant occurrence if those details change.

## Programme and practical details: workshop.json

The sections are:

- `days`: each day's date, events, descriptions, speakers and talk titles. Edit the `events` entries to change the visible programme; `theme` and `overview` are retained information that the single-page layout does not display.
- `registration`: fee, inclusions, deadlines, payment instructions, cancellation policy and `formUrl`.
- `hiking`: distance, elevation gain, hiking time, difficulty, footwear and equipment.
- `organisers`: name, institution, optional photo and personal webpage.
- `contactEmail` and `abstractsUrl`: the official contact address and book of abstracts.
- `supporters`: only entries with `confirmed: true` appear as supporters.
- `photographs`: attribution and licence information; retain these credits.

Replace `null` only when a detail has been confirmed. Text and links go inside double quotes, for example `"name": "Confirmed organiser name"`. Keep JSON commas, brackets and quotation marks in place. Leave unconfirmed details as `null` and supporters as `false`. The build catches invalid JSON; the website shows existing provisional notices until details are supplied.

Add optional profile photographs or authorised logos to `assets/`, and use a path such as `/assets/organiser.jpg`. Registration, abstract and personal webpage links must begin with `https://` or `http://`.

Keep the hiking requirement, shared rooms and shared facilities clear. Outdoor plans and unconfirmed arrangements should retain their provisional wording. Do not add unconfirmed speakers, affiliations, prices, deadlines, routes, email addresses or endorsements.

## Review changes together

After editing, select **Commit changes**, give the change a short description and choose **Create a new branch** / **Propose changes**. Open a pull request so the other organiser can review the wording. Merge it when agreed; the configured build then checks the content and rebuilds the site. Hosting can be connected later without changing this editing workflow.
