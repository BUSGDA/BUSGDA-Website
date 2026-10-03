# BUSGDA-Website

Busgda website page! We will use this project to run a github pages website from here!

Our old website can be found here: https://busgda.ca/
We don't currently have a new design, here are some instructions/guidelines to help with making one.

- Using our new style and logos! I made a figma board with all of our current graphics and marketing styles to help with this. If you need any other resources or want help pulling graphics out as png's let me (Kyle) knwo: https://www.figma.com/design/bGDhJYr6h57adn0TsEsNv3/Website-Resources?node-id=0-1&t=xeN5zgmlvQdJrzXo-1
- An "upcoming events" section where we can include links to current events! Something like just the date and title in a section of the next few events?
- A sponsors section where we can just include multiple logos of our current sponsors.
- A "JOIN US" section where we can include links to our forms.

Feel free to include placeholder stuff anywhere where you want help finding content!
Here are a few drives where you might find good event photos if you need more then what is on the figma:
https://drive.google.com/drive/folders/1PsPiIIfXrSykxlxGinRwbW7fqGDpubWF?usp=sharing
https://drive.google.com/drive/folders/1-RDuhM9xU4SE2mqfuCciDYDHCq5yNSTH?usp=sharing

---

# Instructions

Static site. HTML, CSS, vanilla JS. No builing. Push to `stable` and GitHub Pages should serve it.

## Running locally

JSON files are fetched by the page - to test/dev use:

- VS Code Live Server - install extension, right-click `index.html`, "Open with Live Server"
- `npx serve` - Node installed
- `npx http-server` - same as above
- `python3 -m http.server` - Python installed

Visit whatever URL the tool prints (usually `localhost:3000`,
`localhost:5000`, or `localhost:8000`).

---

## Structure

index.html the page

css/styles.css all styling + color variables

js/main.js loads JSON, renders lists, activates hamburger menu on phones

data/events.json upcoming + past events

data/jams.json the jams we run

data/sponsors.json sponsor list

assets/images/ jam logos and general images

assets/logos/ brand logo (svgs + pngs)

assets/events/ event photos

assets/sponsors/ sponsor logo files

---

## Adding content

### Events → `data/events.json`

```json
{
  "title": "Global Game Jam Vancouver 2027",
  "date": "2027-01-22",
  "endDate": "2027-01-24",
  "location": "Vancouver, BC",
  "description": "One or two sentences.",
  "url": "https://www.eventbrite.ca/e/...",
  "image": "2027-01-24-ggjv-group.jpg"
}
```

Dates: YYYY-MM-DD. endDate optional.

url: leave "" if no registration link yet.

image: filename inside assets/events/. Leave "" for a placeholder block.

Past events move to the "Past Events" section on their own, and the next 3 upcoming show at the top.

### Jams → `data/jams.json`

Name, URL, logo filename (inside `assets/images/`), short blurb.

### Sponsors → `data/sponsors.json`

```
{ "name": "???", "file": "idk.svg", "url": "https://joemama.example", "alt": "????????? Games" }
```

* **Array order = display order.** Reorder the array to reorder the grid.
* `file`: filename inside `assets/sponsors/`.
* `url`: optional.
* `alt`: screen-reader text. Use the sponsor's name.

---

## Colors

All colors are CSS variables at the top of `css/styles.css`. Change a hex in the `:root` block and it flows through the whole site. Don't hardcode colors in new rules - add a variable first if you need a new one.

---

## Deploy

FLAG - sort later
