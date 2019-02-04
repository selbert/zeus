/* after changing this file run 'yarn run webpack:build' */
/* tslint:disable */
import '../content/scss/vendor.scss';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Imports all fontawesome core and solid icons

// Adds the SVG icon to the library so you can use it in your page
library.add(fas, fab);

// jhipster-needle-add-element-to-vendor - JHipster will add new menu items here
