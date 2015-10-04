import {sync as glob} from 'glob';
import {each} from 'lodash';
let testFiles = glob('./test/*.js');

require('../../../habitrpg/website/src/server.js');

each(testFiles, (file) => {
  require(`../../${file}`);
});
