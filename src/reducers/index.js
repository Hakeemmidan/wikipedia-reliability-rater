import {combineReducers} from 'redux';
import {entitiesReducer} from './entities/entities_reducer';
import ui from './ui/ui_reducer';

export default combineReducers({
  entities: entitiesReducer,
  ui,
});
