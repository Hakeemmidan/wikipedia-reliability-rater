import {combineReducers} from 'redux';
import alert from './alert_reducer';
import {articleReducer} from './entities/article/article_reducer';
import {entitiesReducer} from './entities/entities_reducer';
import ui from './ui/ui_reducer';

export default combineReducers({
  entities: entitiesReducer,
  alert,
  article: articleReducer,
  ui,
});
