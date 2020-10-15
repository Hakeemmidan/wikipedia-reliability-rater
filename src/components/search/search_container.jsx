import {connect} from 'react-redux';
import WikiSearch from './search';

const mstp = (state) => {
  const defaultFields = {
    search_text: '',
    search_result: [],
    search_articles: [],
    score: '',
  };
  return {article: state.article, defaultFields};
};

export default connect(mstp, null)(WikiSearch);
