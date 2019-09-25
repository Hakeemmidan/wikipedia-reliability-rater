// Author:       Hakeem Almidan
// Filename:     wiki_citation_eval.js
// Description:  The purpose of this file is to provide a score (in percentage)
//               of how credible/reliable a page is.

import React from 'react'

export class WikiUrlInput extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        searchInput: ''
      }
      
      this.handleSubmit = this.handleSubmit.bind(this)
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault()
    visitPage(this.state.searchInput)
  }

  render() {
    return (
      <div>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="wiki-eval-input"
              onChange={this.update('searchInput')}/>
          </div>
          <input type="submit" class="btn btn-primary" value="evaluate"/>
        </form>
      </div>
    )
  }
}

/////////////////////////////////////////////////////////

let request = require('request')
// used to make HTTP requests
// Basically goes inside the page that you make a request to
let cheerio = require('cheerio')
// used to parse the HTML elements on the page
// Pretty much the same as using jQuery
// but MUCH faster than JS DOM and jQuery
// Docs say that it is about 8x faster than JS DOM
let URL = require('url-parse')
// used to parse URLs

function visitPage(pageUrl) {
  request(pageUrl, (error, response, body) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    if (error) {    
      throw (error)
    }
        
    if (response.statusCode === 200) {      
      const $ = cheerio.load(body)

      const allATagCitations = $("li[id^='cite_note'] a[rel='nofollow']:first-child")
      const allCitations = $("li[id^='cite_note']")
      const textCitationCount = allCitations.length - allATagCitations.length
      let allCitationUrls = [];

      allATagCitations.each(function () {
          allCitationUrls.push($(this).attr('href'))
      })

      const allDomains = getAllDomains(allCitationUrls)
      getCredibilityScore(allDomains, textCitationCount, allCitations.length)
    }
  })
}


function getAllDomains(urls) {
  // @desc: Given a list of urls, grab domains from each one by extracting it from each
  // website's hostname ( example hostname: 'www.wikipedia.org' )

  let allDomains = [];
  urls.forEach(url => {
    const packagedUrl = new URL(url).hostname
    let domain;

    for (let i = packagedUrl.length; i > 0; i--) {
      if (packagedUrl === 'books.google.com') {
          domain = packagedUrl
          break
      } else if (packagedUrl[i] === '.') {
          domain = packagedUrl.slice(i + 1)
          break
      }
    }

    allDomains.push(domain)
  })

  return allDomains
}

function getCredibilityScore(domains, textCitationCount, totalCitationCount) {
  let pageReliabilityScore = 0;

  domains.forEach(domain => {
    let score;
    switch (domain) {
      case 'books.google.com':
        score = 5;
        break;
      case "gov":
        score = 4;
        break;
      case 'edu':
        score = 4;
        break;
      case 'org':
        score = 3;
        break;
      default:
        score = 1;
        break;
    }

    pageReliabilityScore += score;
  })

  pageReliabilityScore += (textCitationCount * 5)
  // We are assuming that all text citations here are either a
  // book citation or a scholarly article, where each of those things
  // have a point value of 5 points.

  // Now we get the percentage of how reliable the source is vvv:
  console.log('Total link-including citation count : ' + domains.length)
  console.log('Total text citation count           : ' + textCitationCount)
  console.log('Total citation count                : ' + totalCitationCount)

  const pageReliabilityPercentage = (pageReliabilityScore / (totalCitationCount * 5)) * 100
  console.log('Page reliability rating             : ' + String(pageReliabilityPercentage) + '%')
  return pageReliabilityPercentage
}