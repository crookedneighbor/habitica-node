import {sync as glob} from 'glob';
import {resolve} from 'path';

export function runTestsInDirectory(directory) {
  let files = glob(`${directory}/**/*.js`);

  files.forEach((file) => {
    require(resolve(file));
  });
}
