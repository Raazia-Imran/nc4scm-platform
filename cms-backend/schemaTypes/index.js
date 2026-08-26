// schemaTypes/index.js
// -----------------------------------------------------------------------------
// Central schema registry. sanity.config.js imports `schemaTypes` from this
// single file rather than importing each schema individually — this keeps
// the config file clean and makes it obvious, at a glance, exactly which
// content models exist in the project.
// -----------------------------------------------------------------------------
import teamMember from "./teamMember";
import partner from "./partner";
import service from "./service";
import publication from "./publication";
import event from "./event";
import news from "./news";
import siteSettings from "./siteSettings";
import homePage from "./homePage";
import aboutPage from "./aboutPage";
import pageSettings from "./pageSettings";
import testimonial from "./testimonial";
import { link, seo, statistic } from "./objects";

export const schemaTypes = [
  link,
  seo,
  statistic,
  siteSettings,
  homePage,
  aboutPage,
  pageSettings,
  teamMember,
  partner,
  testimonial,
  service,
  publication,
  event,
  news,
];
