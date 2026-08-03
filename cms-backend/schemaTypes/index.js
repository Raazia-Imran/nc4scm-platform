// schemaTypes/index.js
// -----------------------------------------------------------------------------
// Central schema registry. sanity.config.js imports `schemaTypes` from this
// single file rather than importing each schema individually — this keeps
// the config file clean and makes it obvious, at a glance, exactly which
// content models exist in the project.
// -----------------------------------------------------------------------------
import teamMember from './teamMember'
import partner from './partner'
import service from './service'
import publication from './publication'
import event from './event'
import news from './news'

export const schemaTypes = [teamMember, partner, service, publication, event, news]
