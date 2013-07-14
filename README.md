mod-sass
===

Compile Sass files to CSS

## Usage

```js
module.exports = {
    plugins: {
        "sass": "mod-sass"
    },
    tasks: {
        "sass": {
            src: "test.scss",
            dest: "test.css"
        }
    }
};
```