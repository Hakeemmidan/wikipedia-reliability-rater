import React from 'react';
import * as cheerio from 'cheerio';
import {DonutGraph} from './charts/donut_graph';
import {BarChart} from './charts/bar_chart';
import {
  visitPage,
  getAllDomains,
  getAllLinkCitations,
  getAllCitations,
  getAllCitationUrls,
} from '../../utils/articles_util';

export class ArticleShow extends React.Component {
  constructor(props) {
    super(props);

    const article = JSON.parse(
      window.localStorage.getItem(props.match.params.id)
    );
    this.state = {
      articleUrl: article['url'],
      articleTitle: article['title'],
      articleScore: article['wirrScore'],
      articleWordCount: article['wordCount'],
      articleLastUpdated: article['lastUpdated'],
      domainCounts: {
        booksOrText: 0,
        eduOrGov: 0,
        org: 0,
        comOrNet: 0,
      },
      top10Authors: [],
    };
    this.extractTop10AuthorsUsernames = this.extractTop10AuthorsUsernames.bind(
      this
    );
  }

  componentDidMount() {
    const that = this;

    visitPage(this.state.articleUrl).then((res) => {
      if (!this.state.domainCounts['org']) {
        const $ = cheerio.load(res.body);
        const linkCitations = getAllLinkCitations($);
        const allCitations = getAllCitations($);
        let allTextCitationCount = allCitations.length - linkCitations.length;
        const allCitationUrls = getAllCitationUrls(linkCitations, $);
        const allDomains = getAllDomains(allCitationUrls);
        let updatedAllDomains = [];

        // count books.google.com as a text citation
        allDomains.forEach((domain) => {
          if (domain != 'books.google.com') {
            updatedAllDomains.push(domain);
          } else {
            allTextCitationCount += 1;
          }
        });

        const domainCounts = {
          booksOrText: 0,
          eduOrGov: 0,
          org: 0,
          comOrNet: 0,
        };

        updatedAllDomains.forEach((domain) => {
          switch (domain) {
            case 'edu':
            case 'gov':
              domainCounts['eduOrGov'] += 4;
              break;
            case 'org':
              domainCounts['org'] += 3;
              break;
            default:
              domainCounts['comOrNet'] += 1;
              break;
          }
        });

        for (let i = 0; i < allTextCitationCount; i++) {
          domainCounts['booksOrText'] += 5;
        }

        that.setState({
          domainCounts,
        });
      }
    });
  }

  extractTop10AuthorsUsernames(top10Authors) {
    this.setState({
      top10Authors,
    });
  }

  render() {
    return (
      <div className="article-show-page-container">
        <div className="article-header-container">
          <div className="article-title">{this.state.articleTitle}</div>
          <div className="article-score">
            &nbsp;({this.state.articleScore}%)
          </div>
        </div>
        <div className="article-url">
          <a href={this.state.articleUrl} target="_blank">
            {this.state.articleUrl}
          </a>
        </div>
        <div className="divider"></div>
        <div className="content-main-container">
          <div className="content-left">
            <div className="article-info-container">
              <div className="article-info-title">Article Trivia Info</div>
              <div>Total word count: {this.state.articleWordCount}</div>
              <div>Last updated on: {this.state.articleLastUpdated}</div>
            </div>
            <div className="divider"></div>
            <div className="score-info-container">
              <div className="score-info-title">Scoring Info</div>
              <div>
                This Wikipedia's article reliability rating scores a score of{' '}
                {this.state.articleScore}. The score is calculated based on the
                types of references used in this article. Here is a break down
                of references:
              </div>
              <div className="content-ref">
                Number of books/text references:{' '}
                {this.state.domainCounts.booksOrText}
              </div>
              <div className="content-ref">
                Number of edu/gov website references:{' '}
                {this.state.domainCounts.eduOrGov}
              </div>
              <div className="content-ref">
                Number of org website references: {this.state.domainCounts.org}
              </div>
              <div className="content-ref">
                Number of com/net website references:{' '}
                {this.state.domainCounts.comOrNet}
              </div>
            </div>
          </div>
          <div className="content-right">
            <div className="donut-chart">
              <DonutGraph
                extractTop10AuthorsUsernames={this.extractTop10AuthorsUsernames}
                articleTitle={this.state.articleTitle}
                articleUrl={this.state.articleUrl}
              />
            </div>
            <div>
              {this.state.top10Authors.length > 0 ? (
                <BarChart top10Authors={this.state.top10Authors} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
