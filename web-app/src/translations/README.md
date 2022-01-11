# Translations

## Overview

We need to maintain translation strings for all user facing copy in the application.

This includes text, labels, html element titles, tooltips, etc.

### Implementation

This section gives an overview on how translations are implemented in this project. For more detailed information, see https://react.i18next.com/

#### Creating translations

For every user facing string in the application we add an entry to the `translateKeys` object in `./translateKeys.ts`. This is the name of a translation string.

By representing the keys using an object we can minimize issues with typos and keep our test code and rendering code dry.

For every language that we support we create a json file inside `/translations/`. The file should be called `common.json` and live inside a sub-directory named after the language being translated, e.g. `/translations/en/common.json`.

The json file must include a translation for each key in `translateKeys`. **Note** the structure of the json file has to match the structure of the translate key with dots (`.`) used to create hierarchy. See current implementation for guidance or consult the docs.

Translate string which include variables need to be formatted using curly braces as follows:
```
"error-message": {
    "more-than-user-rating": "Can't be higher than your own rating ({{ rating }})"
}
```

To add a new language all we need to do is create a new translations file (copy the english translations file) and replace all the translation strings appropriately.

#### Using translations in code

The `CreateGame` component is a good example of how translations strings can be used in code.

We can import `translateKeys` using `tk` for convenience as follows:
```
import tk from "../translations/translateKeys";
```

A component which uses translations needs to fetch the `t` function as follows:
```
const { t } = useTranslation("common");
```

To get the translated string for the current language we pass the translate key to the `t` function:
```
<span>t(tk.CreateGameRandomizeNameButtonTitle)</span>
```

If the translation string has variables we can pass variables to `t` as follows:
```
t(tk.CreateGameVariantSelectOptionLabel, { name: variant.Name, numPlayers: variant.Nations.length })
```