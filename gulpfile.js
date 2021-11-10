const gulp = require('gulp');
const rollup = require('rollup');
const clean = require('gulp-rimraf');
const { terser } = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript2');
const path = require('path');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');

const inputOptions = {
  input: path.resolve(__dirname, './src/index.ts'),
  plugins: [typescript(), json(), commonjs(), terser()],
  onwarn({ loc, frame, message }) {
    if (loc) {
      console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
      if (frame) console.warn(frame);
    } else {
      console.warn(message);
    }
  }
};
const outputOptions = {
  file: './dist/main.js',
  format: 'cjs',
  name: 'cli',
  sourcemap: false
};

gulp.task('realBuild', async function () {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
});

gulp.task('clean', function () {
  return gulp.src(['dist'], { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task('watch', async function () {
  const watcher = await rollup.watch({
    ...inputOptions,
    output: [outputOptions],
    watch: {
      include: 'src/**',
      exclude: 'node_modules/**'
    }
  });
  /**
   * @param event.code  event.code 会是下面其中一个：
   *                    START        — 监听器正在启动（重启）
   *                    BUNDLE_START — 构建单个文件束
   *                    BUNDLE_END   — 完成文件束构建
   *                    END          — 完成所有文件束构建
   *                    ERROR        — 构建时遇到错误
   */
  watcher.on('event', (event) => {
    switch (event.code) {
      case 'START':
        console.log('Watcher staring...');
        break;
      case 'BUNDLE_START':
        console.log('Start building...');
        break;
      case 'BUNDLE_END':
        console.log('The modified file has been built!');
        break;
      case 'END':
        console.log('Build finished!.');
        break;
      case 'ERROR':
        console.log('An error occurred:', event.error);
        watcher.close();
        break;
    }
  });
});

gulp.task('build', gulp.series('clean', 'realBuild'));
gulp.task('dev', gulp.series('clean', 'watch'));
