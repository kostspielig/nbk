// This scripts gets the art data collection from nbk.org
// Produces a json containing art data with the structure:
// [ { "name": "Dali", "imgs": ["", ""] }, ... ]
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"

	"github.com/PuerkitoBio/goquery"
)

const DOMAIN = "http://www.nbk.org/artothek/"

type Artist struct {
	Name string   `json:"name"`
	IMGs []string `json:"imgs"`
}

func ScrapeArtists() []Artist {
	doc, err := goquery.NewDocument(DOMAIN + "artothek.html")
	if err != nil {
		log.Fatal(err)
	}
	var art []Artist
	// Find the review items
	doc.Find("#page .sammlung").Each(func(i int, s *goquery.Selection) {
		// For each item found, get the band and title
		artist := s.Text()
		href, _ := s.Attr("href")
		img := getIMGs(href)
		fmt.Printf("Artist %d: %s - %s\n", i, artist, img)
		art = append(art, Artist{artist, img})
	})

	return art
}

func getIMGs(link string) []string {
	doc, err := goquery.NewDocument(DOMAIN + link)
	if err != nil {
		log.Fatal(err)
	}
	var imgs []string
	// Find the review items
	doc.Find("#slideshow-container").Each(func(i int, s *goquery.Selection) {
		// For each item found, get the band and title
		s.Find("img").Each(func(i int, ii *goquery.Selection) {
			src, _ := ii.Attr("src")
			imgs = append(imgs, src)
		})
	})
	return imgs
}

func main() {
	art := ScrapeArtists()
	json, _ := json.Marshal(art)

	err := ioutil.WriteFile("art.json", json, 0644)
	if err != nil {
		panic(err)
	}
}
