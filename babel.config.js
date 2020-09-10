module.exports = api => {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          // useBuiltIns: "entry",
          useBuiltIns: false,
          modules: false,
          // caller.target will be the same as the target option from webpack
          targets: api.caller(caller => caller && caller.target === "node")
            ? {node: "current"}
            : {chrome: "58", ie: "11"}
        }
      ]
    ]
  }
}
