
import React, { Fragment } from "react";

const pluralize = require("pluralize");
const capitalize = require("capitalize");


export let activeLanguage = 'en';


String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

export let dict = {};
const reservedParams = [
  "pluralize",
  "uppercase",
  "capitalize",
  "lowercase"
];

export const loadLanguage = (newLanguage) => {
  let locale = newLanguage;

  if (!locale) {
    locale = navigator.language || 'en';
    console.log("Switching to Language:", locale);
  }

  //We only use the first 2 characters
  locale = locale.slice(0,2);

  let newDict = {}
  try {
    newDict = require("./languages/" + locale);
  }catch(err){
    console.error(`Language files for ${locale} not found. Using english instead`);
    loadLanguage('en');
    return;
  }


  //check to make sure no param variables uses a reserved param
  for (let [k, v] of Object.entries(newDict)) {
    for (let reserved of reservedParams) {
      if (v.includes("{{" + reserved + "}}")) {
        const errorMsg = `Could not load language ${activeLanguage}: Content for '${k}' is using a reserved keyword '${reserved}'`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
    }
  }

  dict = newDict;
  activeLanguage = locale;
};

loadLanguage();

/**
 * translate some text by key name
 * @param name
 * @param params - opts. undefine this to skip dynamic translation features (static is faster)
 * @returns {*}
 */
export const t = (name, params) => {
  let text = dict[name] || "";


  if (params) {

    //replace variables?
    for (let [k, v] of Object.entries(params)) {
      text = text.replaceAll(`{{${k}}`, v);
    }

    //pluralize?
    if (params.pluralize) text = pluralize(text);

    //uppercase?
    if (params.uppercase) text = text.toUpperCase();
    if (params.lowercase) text = text.toLowerCase();

    //capitalize?
    if (params.capitalize) text = capitalize(text);
  }

  return text;
};
export const translate = t;


export const T = (props) => <Fragment>
  {t(props.name, props.params)}
</Fragment>;