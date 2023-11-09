import express, { response }  from "express";
import axios from "axios";
import bodyParser from "body-parser";
import {HomePage, UserSearch, idDesc, Trending, PopThisSeason, Upcoming, AllTimePop, PopManwha} from "./API/apiRequests.js"
import {cleanDesc, cleanDate, capitalise} from "./public/js/scripts.js"
import {getAnimeSeason} from "./API/scripts.js"

const API_URL = "https://graphql.anilist.co"
const app = express();
const port = 3000;
var UserPref = "romaji"
var search = ""
var MediaType = "Anime"
var CatagoryDesc = "Info"

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function handleResponse(response) {
  return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
  });
}

function handleData(response) {
  return response.data
}

function handleError(error) {
  console.error(error);
}

app.get("/", async (req, res) => {
  const currentSeason = getAnimeSeason();
  const nextSeason = getAnimeSeason(true);
  var respone = await fetch(API_URL, {
    method: "POST",
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: HomePage,
      variables: {
        "type": MediaType.toUpperCase(),
        "season": (currentSeason.season).toUpperCase(),
        "seasonYear": currentSeason.year,
        "nextSeason": (nextSeason.season).toUpperCase(),
        "nextYear": nextSeason.year
      }
    })
  } ).then(handleResponse).then(handleData).catch(handleError);
  res.render("Main.ejs", {
    Respone: respone,
    cleanDesc: cleanDesc,
    cleanDate: cleanDate,
    capitalise: capitalise,
    Lang: UserPref,
    MediaTypePref: MediaType
  });
});

app.get("/:type/Trending", async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Cache-Control', 'no-store');
  const Type = req.params.type
  var respone = await fetch(API_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: Trending,
      variables: {
        "page": 1,
        "type": Type,
        "sort": [
          "TRENDING_DESC",
          "POPULARITY_DESC"
        ]
      }
    })
  }).then(handleResponse).then(handleData).catch(handleError);
  res.render("Catagory.ejs", {
    Respone: respone,
    cleanDesc: cleanDesc,
    cleanDate: cleanDate,
    capitalise: capitalise,
    Lang: UserPref,
    CatagoryDesc: CatagoryDesc,
    Title: `Trending ${capitalise(Type)}`,
    MediaTypePref: MediaType
  });
});

app.get("/:type/This-Season", async (req, res) => {
  const currentSeason = getAnimeSeason();
  const Type = req.params.type
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Cache-Control', 'no-store');
  var respone = await fetch(API_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: PopThisSeason,
      variables: {
        "page": 1,
        "type": Type,
        "seasonYear": currentSeason.year,
        "season": (currentSeason.season).toUpperCase()
      }
    })
  }).then(handleResponse).then(handleData).catch(handleError);
  res.render("Catagory.ejs", {
    Respone: respone,
    cleanDesc: cleanDesc,
    cleanDate: cleanDate,
    capitalise: capitalise,
    Lang: UserPref,
    CatagoryDesc: CatagoryDesc,
    Title: (currentSeason.season +" "+ currentSeason.year +" "+ capitalise(Type)),
    MediaTypePref: capitalise(Type)
  });
});

app.get("/:type/Upcoming", async (req, res) => {
  const nextSeason = getAnimeSeason(true);
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Cache-Control', 'no-store');
  const Type = req.params.type
  var respone = await fetch(API_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: Upcoming,
      variables: {
        "page": 1,
        "type": Type,
        "seasonYear": nextSeason.year,
        "season": (nextSeason.season).toUpperCase()
      }
    })
  }).then(handleResponse).then(handleData).catch(handleError);

  res.render("Catagory.ejs", {
    Respone: respone,
    cleanDesc: cleanDesc,
    cleanDate: cleanDate,
    capitalise: capitalise,
    Lang: UserPref,
    CatagoryDesc: CatagoryDesc,
    Title: `${capitalise(Type)} Next Season - Airing ${nextSeason.season} ${nextSeason.year}`,
    MediaTypePref: capitalise(Type)
  });
});

app.get("/:type/Popular", async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Cache-Control', 'no-store');
  const Type = req.params.type
  var respone = await fetch(API_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: AllTimePop,
      variables: {
        "page": 1,
        "type": Type,
        "sort": "POPULARITY_DESC"
      }
    })
  }).then(handleResponse).then(handleData).catch(handleError);

  res.render("Catagory.ejs", {
    Respone: respone,
    cleanDesc: cleanDesc,
    cleanDate: cleanDate,
    capitalise: capitalise,
    Lang: UserPref,
    CatagoryDesc: CatagoryDesc,
    Title: `All-Time Popular ${capitalise(Type)}`,
    MediaTypePref: capitalise(Type)
  });
});

app.get("/:type/PopularManhwa", async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Cache-Control', 'no-store');
  const Type = req.params.type
  var respone = await fetch(API_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: AllTimePop,
      variables: {
        "page": 1,
        "type": Type,
        "countryOfOrigin": "KR",
        "sort": "SCORE_DESC"
      }
    })
  }).then(handleResponse).then(handleData).catch(handleError);

  res.render("Catagory.ejs", {
    Respone: respone,
    cleanDesc: cleanDesc,
    cleanDate: cleanDate,
    capitalise: capitalise,
    Lang: UserPref,
    CatagoryDesc: CatagoryDesc,
    Title: `Top Manhwa`,
    MediaTypePref: capitalise(Type)
  });
});

app.get("/:type/:id/:title", async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Cache-Control', 'no-store');
  const Id = req.params.id;
  const Type = req.params.type
  var respone = await fetch(API_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: idDesc,
      variables: {
        "id": Id,
        "type": Type,
        "isAdult": false
      }
    })
  }).then(handleResponse).then(handleData).catch(handleError);

  res.render("../views/Describtion/Desc.ejs", {
    Respone: respone,
    cleanDesc: cleanDesc,
    cleanDate: cleanDate,
    capitalise: capitalise,
    Lang: UserPref,
    CatagoryDesc: CatagoryDesc,
    Type: capitalise(Type),
  });
});

app.post("/Pref", async (req, res) => {
  if (req.body.Type === "Lang") {
    UserPref = await req.body.language;
  } else if (req.body.Type === "Media") {
    MediaType = await req.body.MediaType;
  } else if (req.body.Type === "CatagoryDesc") {
    CatagoryDesc = await req.body.CatagoryDesc
  }
  res.redirect("/")
});

app.post("/search", async (req, res) => {
  search = (JSON.stringify(req.body.search))
  var respone = await fetch(API_URL, {
    method: "POST",
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: UserSearch,
      variables: {
        "page": 1,
        "type": "ANIME",
        "sort": "SEARCH_MATCH",
        "search": search
      }
    })
  } ).then(handleResponse).then(handleData).catch(handleError);
  res.render("search.ejs", {
    Respone: respone,
    cleanDesc: cleanDesc,
    cleanDate: cleanDate,
    capitalise: capitalise,
    Lang: UserPref,
    MediaTypePref: MediaType
  });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});