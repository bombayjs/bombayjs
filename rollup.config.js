import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";
import replace from 'rollup-plugin-replace';
let pkg = require('./package.json');

export default {
  input: "src/index.ts",
  output: {
    file: "dist/bombay.js",
    format: "umd",
    name: "Bombay"
  },
  plugins: [
    replace({
      VERSION: pkg.version,
      delimiters: ['{{', '}}']
    }),
    typescript(),
    commonjs({ extensions: [".js", ".ts"] }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    babel({
      exclude: "node_modules/**"
    }),
    process.env.BUILD === 'production' ? uglify() : null
  ]
};
