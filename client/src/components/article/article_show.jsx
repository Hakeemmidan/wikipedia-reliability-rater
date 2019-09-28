import React from 'react'
import { DonutGraph } from './charts/donut_graph';
import RadarChart  from './charts/radar';
import WikiSearch from '../search';

export class ArticleShow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            articleUrl: props.location.articleUrl
        }
    }

    render() {
        return (
            <div className="article-show-page-container">
                <WikiSearch />
                <div className="article-show-charts">
                    <RadarChart />
                    <DonutGraph articleUrl={this.state.articleUrl}/>
                </div>
            </div>
        )
    }
}
